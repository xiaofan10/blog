/** @license
 * keymage.js - Javascript keyboard bindings handling
 * http://github.com/piranha/keymage
 *
 * (c) 2012-2016 Alexander Solovyov under terms of ISC License
 */

;(function (define, undefined) {
  define(function () {
    'use strict'

    var VERSION = '1.1.3'
    var isOsx = ~navigator.userAgent.indexOf('Mac OS X')

    // Defining all keys
    var MODPROPS = ['shiftKey', 'ctrlKey', 'altKey', 'metaKey']
    var MODS = {
      shift: 'shift',
      ctrl: 'ctrl',
      control: 'ctrl',
      alt: 'alt',
      option: 'alt',
      win: 'meta',
      cmd: 'meta',
      super: 'meta',
      meta: 'meta',
      // default modifier for os x is cmd and for others is ctrl
      defmod: isOsx ? 'meta' : 'ctrl',
    }
    var MODORDER = ['shift', 'ctrl', 'alt', 'meta']
    var MODNUMS = [16, 17, 18, 91]

    var KEYS = {
      backspace: 8,
      tab: 9,
      enter: 13,
      return: 13,
      pause: 19,
      caps: 20,
      capslock: 20,
      escape: 27,
      esc: 27,
      space: 32,
      pgup: 33,
      pageup: 33,
      pgdown: 34,
      pagedown: 34,
      end: 35,
      home: 36,
      ins: 45,
      insert: 45,
      del: 46,
      delete: 46,

      left: 37,
      up: 38,
      right: 39,
      down: 40,

      '*': 106,
      '+': 107,
      plus: 107,
      minus: 109,
      ';': 186,
      '=': 187,
      ',': 188,
      '-': 189,
      '.': 190,
      '/': 191,
      '`': 192,
      '[': 219,
      '\\': 220,
      ']': 221,
      "'": 222,
    }

    var i
    // numpad
    for (i = 0; i < 10; i++) {
      KEYS['num-' + i] = i + 95
    }
    // top row 0-9
    for (i = 0; i < 10; i++) {
      KEYS['' + i] = i + 48
    }
    // f1-f24
    for (i = 1; i < 25; i++) {
      KEYS['f' + i] = i + 111
    }
    // alphabet
    for (i = 65; i < 91; i++) {
      KEYS[String.fromCharCode(i).toLowerCase()] = i
    }

    // Reverse key codes 反转key与code
    var KEYREV = {}
    Object.keys(KEYS).forEach(function (k) {
      var val = KEYS[k]
      if (!KEYREV[val] || KEYREV[val].length < k.length) {
        KEYREV[val] = k
      }
    })
    console.log(KEYREV)

    // -----------------------
    // Actual work is done here

    var currentScope = ''
    var allChains = {}

    function parseKeyString(keystring) {
      var bits = keystring.split(/-(?!$)/)
      console.log(bits, 'bits')
      var button = bits[bits.length - 1]
      var key = { code: KEYS[button] }
      console.log(button, 'button')

      if (!key.code) {
        throw 'Unknown key "' + button + '" in keystring "' + keystring + '"'
      }

      var mod
      for (var i = 0; i < bits.length - 1; i++) {
        button = bits[i]
        mod = MODS[button]
        if (!mod) {
          throw 'Unknown modifier "' + button + '" in keystring "' + keystring + '"'
        }
        key[mod] = true
      }

      return key
    }

    function stringifyKey(key) {
      var s = ''
      for (var i = 0; i < MODORDER.length; i++) {
        if (key[MODORDER[i]]) {
          s += MODORDER[i] + '-'
        }
      }
      s += KEYREV[key.code]
      return s
    }

    function normalizeKeyChain(keychainString) {
      var keychain = []
      var keys = keychainString.split(' ')

      for (var i = 0; i < keys.length; i++) {
        var key = parseKeyString(keys[i])
        key = stringifyKey(key)
        keychain.push(key)
      }

      keychain.original = keychainString
      return keychain
    }

    function eventKeyString(e) {
      var key = { code: e.keyCode }
      for (var i = 0; i < MODPROPS.length; i++) {
        var mod = MODPROPS[i]
        if (e[mod]) {
          key[mod.slice(0, mod.length - 3)] = true
        }
      }
      return stringifyKey(key)
    }

    function getNestedChains(chains, scope) {
      for (var i = 0; i < scope.length; i++) {
        var bit = scope[i]
        if (bit) {
          chains = chains[bit]
        }
        if (!chains) {
          break
        }
      }
      return chains
    }

    var sequence = [] // 当前key
    function dispatch(e) {
      // Skip all modifiers
      if (~MODNUMS.indexOf(e.keyCode)) {
        return
      }

      var seq = sequence.slice()
      seq.push(eventKeyString(e))
      console.log(seq, 'seq')
      var scope = currentScope.split('.')
      console.log(scope, 'scope', scope.length)
      var matched, chains, key

      for (var i = scope.length; i >= 0; i--) {
        chains = getNestedChains(allChains, scope.slice(0, i))
        console.log(chains, 111, scope.slice(0, i))
        if (!chains) {
          continue
        }
        matched = true
        for (var j = 0; j < seq.length; j++) {
          key = seq[j]
          console.log(key, 'ssss')
          if (!chains[key]) {
            matched = false
            break
          }
          chains = chains[key]
        }

        if (matched) {
          break
        }
      }

      var definitionScope = scope.slice(0, i).join('.')
      var preventDefault = chains.preventDefault

      // partial match, save the sequence
      if (matched && !chains.handlers) {
        sequence = seq
        if (preventDefault) {
          e.preventDefault()
        }
        return
      }

      if (matched) {
        for (i = 0; i < chains.handlers.length; i++) {
          var handler = chains.handlers[i]
          var options = handler._keymage

          var res = handler.call(options.context, e, {
            shortcut: options.original,
            scope: currentScope,
            definitionScope: definitionScope,
          })

          if (res === false || preventDefault) {
            e.preventDefault()
          }
        }
      }

      // either matched or not, drop the sequence
      sequence = []
    }
    // 处理scope
    function getHandlers(scope, keychain, fn) {
      var bits = scope.split('.')
      var chains = allChains
      bits = bits.concat(keychain)
      console.log(bits, chains)
      var l = bits.length
      for (var i = 0; i < l; i++) {
        var bit = bits[i]
        if (!bit) continue

        chains = chains[bit] || (chains[bit] = {})
        console.log(chains)
        if (fn && fn._keymage.preventDefault) {
          chains.preventDefault = true
        }
      }
      if (l) {
        var handlers = chains.handlers || (chains.handlers = [])
        console.log(l, chains)
        return handlers
      }
    }

    function assignKey(scope, keychain, fn) {
      var handlers = getHandlers(scope, keychain, fn)
      console.log(handlers, 'handlers')
      handlers.push(fn)
    }

    function unassignKey(scope, keychain, fn) {
      var handlers = getHandlers(scope, keychain)
      var idx = handlers.indexOf(fn)
      if (~idx) {
        handlers.splice(idx, 1)
      }
    }

    function parsed(scope, keychain, fn, options) {
      if (keychain === undefined && fn === undefined) {
        return function (keychain, fn) {
          return keymage(scope, keychain, fn)
        }
      }

      if (typeof keychain === 'function') {
        options = fn
        fn = keychain
        keychain = scope
        scope = ''
      }

      var normalized = normalizeKeyChain(keychain)

      return [scope, normalized, fn, options]
    }

    // optional arguments: scope, options.
    function keymage(scope, keychain, fn, options) {
      var args = parsed(scope, keychain, fn, options)
      fn = args[2]
      options = args[3]
      fn._keymage = options || {}
      fn._keymage.original = keychain
      assignKey.apply(null, args)

      return function () {
        unassignKey.apply(null, args)
      }
    }

    keymage.unbind = function (scope, keychain, fn) {
      var args = parsed(scope, keychain, fn)
      unassignKey.apply(null, args)
    }

    keymage.parse = parseKeyString
    keymage.stringify = stringifyKey

    keymage.bindings = allChains

    keymage.setScope = function (scope) {
      currentScope = scope ? scope : ''
    }

    keymage.getScope = function () {
      return currentScope
    }

    keymage.pushScope = function (scope) {
      currentScope = (currentScope ? currentScope + '.' : '') + scope
      return currentScope
    }

    keymage.popScope = function (scope) {
      var i

      if (!scope) {
        i = currentScope.lastIndexOf('.')
        scope = currentScope.slice(i + 1)
        currentScope = i == -1 ? '' : currentScope.slice(0, i)
        return scope
      }

      currentScope = currentScope.replace(new RegExp('(^|\\.)' + scope + '(\\.|$).*'), '')
      return scope
    }

    keymage.version = VERSION

    window.addEventListener('keydown', dispatch)

    return keymage
  })
})(
  typeof define !== 'undefined'
    ? define
    : function (factory) {
        if (typeof module !== 'undefined') {
          module.exports = factory()
        } else {
          window.keymage = factory()
        }
      }
)
