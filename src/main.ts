import navigatorApi from './lib/navigator'
import screenApi from './lib/screen'
import Shortcup from './lib/shortcup'

window.navigatorApi = navigatorApi
window.screenApi = screenApi

const shortcup = new Shortcup()
const unsubscribe = shortcup.init()

document.body.style.cssText = 'background: #f00'
