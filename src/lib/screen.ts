
interface IScreenInfo {
  colorDepth: number;
  pixelDepth: number;
  availWidth: number;
  availHeight: number;
  width: number;
  height: number;
  orientation: number;
}

export class ScreenApi {
  colorDepth: number;
  pixelDepth: number;
  availWidth: number;
  availHeight: number;
  width: number;
  height: number;
  orientation: number;
  constructor(screen) {
    this.colorDepth = screen.colorDepth // 显示器每像素颜色的位深
    this.pixelDepth = screen.pixelDepth
    this.availHeight = screen.availHeight // 返回屏幕的可用宽度（排除任务栏、工具栏等非屏幕显示区域)
    this.availWidth = screen.availWidth // 返回屏幕的可用高度（排除任务栏、工具栏等非屏幕显示区域)
    this.height = screen.height // 返回屏幕的高度
    this.width = screen.width // 返回屏幕的宽度
    this.orientation = screen.orientation // 返回一个表示屏幕方向的 ScreenOrientation 对象，其中包含了 angle 和 type 等属性，可以用于检测屏幕的方向（横向或纵向）
  }
  getScreenInfo():IScreenInfo {
    return {
      colorDepth: this.colorDepth,
      pixelDepth: this.pixelDepth,
      availHeight: this.availHeight,
      availWidth: this.availWidth,
      height: this.height,
      width: this.width,
      orientation: this.orientation,
    }
  }
 
}

export default new ScreenApi(screen);

