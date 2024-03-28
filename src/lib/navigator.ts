/* eslint-disable @typescript-eslint/no-explicit-any */

interface IBrowserInfo {
  oscpu: string;
  vendor: string;
  platform: string;
}

// 定义一个返回函数的函数类型
type FuncType = () => void;

type ConnectionType = Navigator['connection'];

export class NavigatorApi {
  navigator: Navigator
  oscpu:  string
  vendor: string
  platform: string
  connection: ConnectionType
  constructor(navigator) {
    this.navigator = navigator
    this.oscpu = navigator.oscpu || '浏览器不支持获取 操作系统与系统架构相关信息'
    this.vendor = navigator.vendor || '浏览器不支持获取 浏览器开发商信息'
    this.platform = navigator.platform || '浏览器不支持获取 示浏览器所在的操作系统'
    this.connection = navigator.connection || '浏览器不支持获取 网络信息'
  }
  getBrowserInfo(): IBrowserInfo {
    return {
      oscpu: this.oscpu,
      vendor: this.vendor,
      platform: this.platform,
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getLocation(): any {
    if(this.navigator.geolocation) {
      return this.navigator.geolocation.getCurrentPosition((position) =>  console.log(position))
    }
    return null
  }

  listen(event, callback): FuncType {
    window.addEventListener(event,callback)

    return () => {
      window.removeEventListener(event, callback)
    }
  }
// 联网设备监听
  onLine(): FuncType{
    return this.listen('online',(e) => {
      console.log('onLine', e)
    })
  }
  // 断网设备监听
  offLine(): FuncType {
    return this.listen('offline',(e) => {
      console.log('offLine', e)
    })
  }

  getConnection() :ConnectionType{
    return this.connection
  }

  async getBatteryInfo() {
    if(this.navigator.getBattery) {
       const res = await this.navigator.getBattery()
       console.log(res)
       return res
    } else {
      return null
    }
  }

  getDeviceInfo() {
    return {
      hardwareConcurrency: this.navigator.hardwareConcurrency, // 返回浏览器支持逻辑处理器核心数
      deviceMemory: this.navigator.deviceMemory, // 系统内存
      maxTouchPoints: this.navigator.maxTouchPoints // 返回触屏支持最大关联触电个数
    }
  }
}

export default new NavigatorApi(navigator)
