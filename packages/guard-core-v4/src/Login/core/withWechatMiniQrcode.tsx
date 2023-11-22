import { message } from 'shim-antd'

// import '@antd-lib-style/message/style/index.less'

import { React } from 'shim-react'

import { useTranslation } from 'react-i18next'

import { QrCode } from '../../Qrcode'

import { QrCodeResponse } from '../../Qrcode/hooks/usePostQrCode'

import { CodeStatus } from '../../Qrcode/UiQrCode'

import { useGuardEvents, useGuardHttpClient } from '../../_utils/context'

import { StoreInstance } from '../../Guard/core/hooks/useMultipleAccounts'

import { LoginMethods } from '../../Type'

import { isWeChatBrowser } from '../../_utils'

import { useGuardAuthClient } from '../../Guard/authClient'

interface LoginWithWechatMiniQrcodeProps {
  // onLogin: any
  onLoginSuccess: any
  canLoop: boolean
  qrCodeScanOptions: any
  // 当前登录方式 对应的id
  id: string
  multipleInstance?: StoreInstance
}

export const LoginWithWechatMiniQrcode = (
  props: LoginWithWechatMiniQrcodeProps
) => {
  const { canLoop, qrCodeScanOptions } = props

  const { t } = useTranslation()

  const { responseIntercept } = useGuardHttpClient()

  const events = useGuardEvents()

  const authClient = useGuardAuthClient()

  if (!canLoop) {
    return null
  }

  const descriptions: any = {
    already: (referQrCode: () => void) => (
      <span className="qrcode__again-scan" onClick={referQrCode}>
        {t('login.scanAgain')}
      </span>
    ),
    ready: isWeChatBrowser()
      ? t('common.loginWithWechatmpQrcodeTipsTitle')
      : t('login.wechatScanLogin'),
    success: t('common.LoginSuccess'),
    MFA: t('common.LoginSuccess')
  }

  /**
   * 状态发生变化时的处理函数
   * @param status
   * @param data
   */
  const onStatusChange = async (status: CodeStatus, data: QrCodeResponse) => {
    switch (status) {
      case 'success':
        if (events?.onBeforeLogin) {
          const isContinue = await events?.onBeforeLogin(
            { type: LoginMethods.WxMinQr, data },
            authClient
          )
          if (!isContinue) {
            break
          }
        }

        props.multipleInstance &&
          props.multipleInstance.setLoginWay(
            'qrcode',
            LoginMethods.WxMinQr,
            props.id
          )

        props.onLoginSuccess(data)
        break
      case 'error':
        // 怎么模拟这里的 error
        if (data.scannedResult) {
          const { message: msg } = data.scannedResult
          message.error(msg)
        }
        break
      case 'MFA':
        const { onGuardHandling } = responseIntercept(data.scannedResult!)
        onGuardHandling?.()
        break
      default:
        break
    }
  }

  return (
    <QrCode
      scene="WXAPP_AUTH"
      descriptions={descriptions}
      onStatusChange={onStatusChange}
      qrCodeScanOptions={qrCodeScanOptions}
      imageStyle={{
        height: '166px',
        width: '166px'
      }}
    />
  )
}
