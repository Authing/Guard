import { UiQrCode, LinkQrcode } from './UiQrCode'

import { WorkQrCode, WorkGeneQrCode } from './WorkQrCode'

type IQrCode = typeof WorkQrCode & {
  UI: typeof UiQrCode
}

type IGeneQrCode = typeof WorkGeneQrCode & {
  UI: typeof LinkQrcode
}

const QrCode = WorkQrCode as IQrCode

const GeneQrcode = WorkGeneQrCode as IGeneQrCode

QrCode.UI = UiQrCode

GeneQrcode.UI = LinkQrcode

export { QrCode, GeneQrcode }
