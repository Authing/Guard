import { QrCode } from '../../Qrcode'

import { React } from 'shim-react'

import { CodeStatus } from '../../Qrcode/UiQrCode'

import { QrCodeResponse } from '../../Qrcode/hooks/usePostQrCode'

import { message } from 'shim-antd'

import { useGuardEvents, useGuardHttpClient } from '../../_utils/context'

import { WorkQrCodeRef } from '../../Qrcode/WorkQrCode'

import { useTranslation } from 'react-i18next'

import { StoreInstance } from '../../Guard/core/hooks/useMultipleAccounts'

import { LoginMethods } from '../..'

import { useGuardAuthClient } from '../../Guard/authClient'

const { useRef } = React

interface LoginWithAppQrcodeProps {
  // onLogin: any
  onLoginSuccess: any
  canLoop: boolean
  // qrCodeScanOptions: any
  multipleInstance?: StoreInstance
}

export const LoginWithAppQrcode = (props: LoginWithAppQrcodeProps) => {
  const codeRef = useRef<WorkQrCodeRef>()

  const { canLoop } = props

  const { responseIntercept } = useGuardHttpClient()

  const events = useGuardEvents()

  const authClient = useGuardAuthClient()

  const { t } = useTranslation()

  if (!canLoop) {
    return null
  }

  const descriptions: any = {
    already: (referQrCode: () => void) => (
      <span className="qrcode__again-scan" onClick={referQrCode}>
        {t('login.scanAgain')}
      </span>
    ),
    ready: t('login.appScanLogin'),
    success: t('common.LoginSuccess'),
    MFA: t('common.LoginSuccess')
  }

  /**
   * Sever Status 发生变化
   * @param status
   * @param data
   */
  const onStatusChange = async (status: CodeStatus, data: QrCodeResponse) => {
    switch (status) {
    case 'success':
      if (events?.onBeforeLogin) {
        const isContinue = await events?.onBeforeLogin(
          { type: LoginMethods.AppQr, data },
          authClient
        )
        if (!isContinue) {
          break
        }
      }
      props.multipleInstance && props.multipleInstance.setLoginWay('qrcode', LoginMethods.AppQr)
      props.onLoginSuccess(data)
      break
    case 'error':
      if (data.scannedResult) {
        const { message: msg } = data.scannedResult
        message.error(msg)
      }
      break
    case 'MFA':
      if (data.scannedResult) {
        const { onGuardHandling } = responseIntercept(data.scannedResult)
        onGuardHandling?.()
      }
      break
    default:
      break
    }
  }

  return (
    <QrCode
      ref={codeRef}
      scene="APP_AUTH"
      descriptions={descriptions}
      onStatusChange={onStatusChange}
      imageStyle={{
        height: '166px',
        width: '166px'
      }}
    />
  )
}
