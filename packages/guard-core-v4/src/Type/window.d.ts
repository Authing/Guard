interface Window {
  DDLogin: any
  WwLogin: any
  DTFrameLogin: any
  sensors_sw?: {
    login?: (distinctId: string) => void
  }
}
