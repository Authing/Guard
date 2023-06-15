import { Spin } from 'shim-antd'

import { React } from 'shim-react'

import { useTranslation } from 'react-i18next'

import { LazyloadImage } from '../../../LazyloadImage'

export function HowUsePushLogin() {
  const { t } = useTranslation()

  return (
    <>
      <div className="guide-step">
        <div className="title">
          <span className="dot"></span>
          <span>1. {t('login.inputAccountInWeb')}</span>
        </div>
        <div className="desc">{t('login.clickLoginButton')}</div>
        <div className="qrcode-container center grey">
          <LazyloadImage
            src="https://files.authing.co/authing-guard/push-login-input-account.svg"
            placeholder={<Spin />}
            className="qrcode-verifier"
            alt={t('login.clickLoginButton') as string}
          ></LazyloadImage>
        </div>
      </div>

      <div className="guide-step">
        <div className="title">
          <span className="dot"></span>
          <span>2. {t('login.receiveMessageInApp')}</span>
        </div>
        <div className="desc">{t('login.confirmLoginInApp')}</div>
        <div className="qrcode-container center grey">
          <LazyloadImage
            src="https://files.authing.co/authing-guard/push-login-receive-message-in-app.svg"
            placeholder={<Spin />}
            className="qrcode-verifier"
            alt={t('login.confirmLoginInApp') as string}
          ></LazyloadImage>
        </div>
      </div>
    </>
  )
}
