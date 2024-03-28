interface IKeyEvents {
  keydown: string
  keypress: string // 字符按键或部分功能键会触发该事件，ctrl等不会被触发，长按会持续触发
  keyup: string
}

const isOsx = ~navigator.userAgent.indexOf('Mac OS X')

const MODS = {
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

const MOD_ORDER = ['shift', 'ctrl', 'alt', 'meta']
// 按 MOD_ORDER 键触发keypress事件，event中对应的属性会变true
const MOD_PROPS = ['shiftKey', 'ctrlKey', 'altKey', 'metaKey']
const MOD_NUMS = [16, 17, 18, 91]

const KEYS = {
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

let i
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
// a-z
for (i = 65; i < 91; i++) {
  KEYS[String.fromCharCode(i).toLowerCase()] = i
}

const getKeyMap = keys => {
  const KEY_MAP = {}
  for (let key in keys) {
    const val = keys[key]
    if (!KEY_MAP[val] || KEY_MAP[val].length < key.length) {
      KEY_MAP[val] = key
    }
  }
  return KEY_MAP
}

// 反转key与code
const KEY_MAP = getKeyMap(KEYS)

class Shortcup {
  VERSION: string = '0.0.1'
  EVENTS: IKeyEvents = {
    keypress: 'keypress',
    keydown: 'keydown',
    keyup: 'keyup',
  }

  constructor() {
    this.main = this.main.bind(this)
  }

  init() {
    const { keypress } = this.EVENTS
    const main = this.main
    return this.subscribe(keypress, main)
  }

  subscribe(event, fn) {
    document.addEventListener(event, fn)
    return () => {
      document.removeEventListener(event, fn)
    }
  }

  main(e: KeyboardEvent) {
    console.log(e)
    const { keyCode } = e
    if (~MOD_NUMS.indexOf(keyCode)) {
      return
    }

    const keyString = this.eventKeyFormat(e)
  }

  eventKeyFormat(e) {
    const key = { code: e.keyCode }
    // 取出为MOD_PROPS 中为 true 的
    MOD_PROPS.forEach(modKey => {
      let mod = MOD_PROPS[modKey]
      if (e[mod]) {
        key[mod.slice(0, mod.length - 3)] = true
      }
    })

    let strKey = ''
    MOD_ORDER.forEach(orderKey => {
      if (key[MOD_ORDER[orderKey]]) {
        strKey += MOD_ORDER[orderKey] + '-'
      }
    })

    strKey += KEY_MAP[key.code]

    return strKey // 'Ctrl-Shift-m' or 'Ctrl-m'
  }
  // 匹配
  match() {}
}

let currentShort: any[] = []
const shortcuts = ['Control k']
export default Shortcup

// pad number 0-9 -> 96~105
// +->107
// -->109
// /->111
// .->110
// NumLock->144

// top number 0~9 -> 48~57
// -->189
// =->187

// F1~F12 -> 112~123

// a~z -> 65~90

// `->192
// ;->186
// '->222
// Alt -> 18
// Shift->16
// Control->17
// Meta->91
// CapsLock->20
// ,->188
// .->190
// \->220
// [->219
// ]->221
// Backspace->8
//  ->32   // 空格space
// Insert->45
// PageUp->33
// PageDown->34
// End->35
// Enter->13
// Delete->46
// Escape->27

// window.addEventListener('keypress', (e) => {
// console.log(`${e.key}->${e.keyCode}`,e)
//   const {key} = e

//   e.preventDefault()
//   if(currentShort.includes(key)){
//     return
//   } else {
//     currentShort.push(key)
//     if(shortcuts.includes(currentShort.join(' '))){
//       console.log(currentShort, 'shortcut triggered')
//     }
//   }
// })

// window.addEventListener('keyup', (e) => {
//   const {key} = e
//   if(currentShort.includes(key)){
//     currentShort = currentShort.filter((item:any) => item!== key)
//   } else {
//     currentShort = []
//   }
// })
