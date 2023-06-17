import { UiQrCode } from './UiQrCode'

import { WorkQrCode } from './WorkQrCode'

type IQrCode = typeof WorkQrCode & {
  UI: typeof UiQrCode
}

const QrCode = WorkQrCode as IQrCode

QrCode.UI = UiQrCode

export { QrCode }
