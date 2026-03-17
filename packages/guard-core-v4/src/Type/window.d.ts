interface Window {
  DDLogin: any
  WwLogin: any
  DTFrameLogin: any
  TencentCaptcha: new (
    appId: string,
    callback: (res: any) => void,
    options?: Record<string, any>
  ) => {
    show: () => void
  }
  [key: symbol]: any
}
