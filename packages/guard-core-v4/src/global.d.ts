declare module '*.svg' {
  const content: any
  export default content
}

declare module 'qrcodejs2' {
  export default QRCode
}

declare module '*.gif' {
  const src: string
  export default src
}

declare const __react_version__: string
