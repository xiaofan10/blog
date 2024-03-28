type NavigatorApi = import('../lib/navigator').NavigatorApi;

interface Window {
  navigatorApi?: NavigatorApi;
  [propsName: string]: any;
}

interface Navigator {
  connection?: any;
  [propsName: string]: any;
}

