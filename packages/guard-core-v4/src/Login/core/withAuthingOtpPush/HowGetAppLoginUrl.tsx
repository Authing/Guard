import { React } from 'shim-react'

import { Spin } from 'shim-antd'

import '@antd-lib-style/spin/style/index.less'

import { useTranslation } from 'react-i18next'

import { LazyloadImage } from '../../../LazyloadImage'

export function HowGetAppLoginUrl() {
  const { t } = useTranslation()

  return (
    <>
      <div className="guide-step">
        <div className="title">
          <span className="dot"></span>
          <span>1. {t('login.getCodeFromAdmin')}</span>
        </div>
        <div className="desc">{t('login.getCodeFromAdminTips')}</div>
        <div className="qrcode-container center grey">
          <LazyloadImage
            src="https://files.authing.co/authing-guard/push-login-get-associated-qrcode-from-admin.svg"
            placeholder={<Spin />}
            className="qrcode-verifier"
            alt={t('login.getCodeFromAdmin') as string}
          ></LazyloadImage>
        </div>
      </div>

      <div className="guide-step">
        <div className="title">
          <span className="dot"></span>
          <span>2. {t('login.getCodeFromPersonalCenter')}</span>
        </div>
        <div className="desc">{t('login.getCodeFromPersonalCenterTips')}</div>
        <div className="qrcode-container center grey">
          <LazyloadImage
            src="https://files.authing.co/authing-guard/push-login-get-code-from-personal.svg"
            placeholder={<Spin />}
            className="qrcode-verifier"
            alt={t('login.getCodeFromPersonalCenter') as string}
          ></LazyloadImage>
        </div>
      </div>

      <div className="guide-step">
        <div className="title">
          <span className="dot"></span>
          <span>3. {t('login.getLoginUrlFromConsole')}</span>
        </div>
        <div className="desc">{t('login.getLoginUrlFromConsoleTips')}</div>
        <div className="qrcode-container center grey">
          <LazyloadImage
            src="https://files.authing.co/authing-guard/push-login-get-login-url-from-console.png"
            placeholder={<Spin />}
            className="qrcode-verifier"
            alt={t('login.getLoginUrlFromConsole') as string}
          ></LazyloadImage>
        </div>
      </div>
    </>
  )
}
