declare module '*.svg' {
  const content: any
  export default content
}

declare module 'qrcodejs2' {
  export default QRCode
}

declare const __react_version__: string
