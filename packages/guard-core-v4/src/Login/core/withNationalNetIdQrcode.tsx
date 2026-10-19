import { React } from 'shim-react'
import { message } from 'shim-antd'
import { useTranslation } from 'react-i18next'

import { QrCode } from '../../Qrcode'
import { CodeStatus } from '../../Qrcode/UiQrCode'
import { QrCodeResponse } from '../../Qrcode/hooks/usePostQrCode'
import { StoreInstance } from '../../Guard/core/hooks/useMultipleAccounts'
import { useGuardAuthClient } from '../../Guard/authClient'
import { LoginMethods } from '../../Type/application'
import { useGuardEvents, useGuardHttpClient } from '../../_utils/context'

const { useEffect, useRef } = React

interface NationalNetIdQrCodeProps {
  id: string
  canLoop: boolean
  onLoginSuccess: (data: any) => void
  qrCodeScanOptions?: Record<string, any>
  multipleInstance?: StoreInstance
}

export const NationalNetIdQrCode = (props: NationalNetIdQrCodeProps) => {
  const { id, canLoop, qrCodeScanOptions, multipleInstance, onLoginSuccess } =
    props
  const { t } = useTranslation()
  const { responseIntercept } = useGuardHttpClient()
  const events = useGuardEvents()
  const authClient = useGuardAuthClient()
  const activeSession = useRef({ id, canLoop, generation: 0, mounted: true })

  if (
    activeSession.current.id !== id ||
    activeSession.current.canLoop !== canLoop
  ) {
    activeSession.current = {
      id,
      canLoop,
      generation: activeSession.current.generation + 1,
      mounted: activeSession.current.mounted
    }
  }

  useEffect(() => {
    activeSession.current.mounted = true
    return () => {
      activeSession.current.mounted = false
      activeSession.current.generation += 1
    }
  }, [])

  if (!canLoop) {
    return null
  }

  const onStatusChange = async (status: CodeStatus, data: QrCodeResponse) => {
    const generation = activeSession.current.generation
    switch (status) {
      case 'success':
        if (
          events?.onBeforeLogin &&
          !(await events.onBeforeLogin(
            { type: LoginMethods.NationalNetIdQrcode, data },
            authClient
          ))
        ) {
          return
        }
        if (
          !activeSession.current.mounted ||
          !activeSession.current.canLoop ||
          activeSession.current.generation !== generation
        ) {
          return
        }
        multipleInstance?.setLoginWay(
          'qrcode',
          LoginMethods.NationalNetIdQrcode,
          id
        )
        onLoginSuccess(data)
        break
      case 'MFA':
        if (data.scannedResult) {
          responseIntercept(data.scannedResult).onGuardHandling?.()
        }
        break
      case 'error': {
        const result = data.scannedResult as
          | { errmsg?: string; message?: string }
          | undefined
        const errorMessage = result?.errmsg || result?.message
        if (errorMessage) {
          message.error(errorMessage)
        }
        break
      }
      default:
        break
    }
  }

  return (
    <QrCode
      key={id}
      scene="NATIONAL_NET_ID_AUTH"
      qrCodeScanOptions={{ ...qrCodeScanOptions, extIdpConnId: id }}
      descriptions={{
        ready: t('login.nationalNetIdScanTip'),
        already: t('login.scanSuccess'),
        success: t('common.LoginSuccess'),
        MFA: t('common.LoginSuccess')
      }}
      onStatusChange={onStatusChange}
      imageStyle={{ height: '166px', width: '166px' }}
    />
  )
}
