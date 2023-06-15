import { React } from 'shim-react'

import { Spin } from 'shim-antd'

import { useTranslation } from 'react-i18next'

import { LazyloadImage } from '../../../LazyloadImage'

import {
  useGuardAppId,
  useGuardFinallyConfig,
  useGuardPublicConfig
} from '../../../_utils/context'

import { QRCodeSVG } from 'qrcode.react'

const { useMemo } = React

export function HowBindClient() {
  const { t } = useTranslation()

  const config = useGuardFinallyConfig()

  const publicConfig = useGuardPublicConfig()

  const appId = useGuardAppId()

  const qrcodeInfo = useMemo(() => {
    const data = {
      appId,
      appHost: config.host,
      scene: 'APP_OPTIONS',
      userPoolId: publicConfig.userPoolId
    }
    return JSON.stringify(data)
  }, [config, appId])

  return (
    <>
      <div className="guide-step">
        <div className="title">
          <span className="dot"></span>
          <span>1. {t('login.installAuthingToken')}</span>
        </div>
        <div className="desc">{t('login.downloadAuthingToken')}</div>
        <div className="qrcode-container space-between">
          <div className="qrcode-app grey-bg">
            <LazyloadImage
              src="https://cdn.authing.co/authing-assets/qrcode-download-android.png"
              placeholder={<Spin />}
              className="qrcode-verifier download-app"
              alt={t('login.downloadAndroid') as string}
            ></LazyloadImage>
            <div className="qrcode-tips">{t('login.downloadAndroid')}</div>
          </div>
          <div className="qrcode-app grey-bg">
            <LazyloadImage
              src="https://cdn.authing.co/authing-assets/qrcode-download-ios.png"
              placeholder={<Spin />}
              className="qrcode-verifier download-app"
              alt={t('login.downloadIOS') as string}
            ></LazyloadImage>
            <div className="qrcode-tips">{t('login.downloadIOS')}</div>
          </div>
        </div>
      </div>

      <div className="guide-step">
        <div className="title">
          <span className="dot"></span>
          <span>2. {t('login.openAppList')}</span>
        </div>
        <div className="desc">{t('login.addApp')}</div>
        <LazyloadImage
          src="https://files.authing.co/authing-guard/push-login-open-application-list.svg"
          placeholder={<Spin />}
          className="qrcode-verifier"
          alt={t('login.downloadIOS') as string}
        ></LazyloadImage>
      </div>

      <div className="guide-step">
        <div className="title">
          <span className="dot"></span>
          <span>3. {t('login.openLoginPage')}</span>
        </div>
        <div className="desc">{t('login.scanQrcode')}</div>
        <LazyloadImage
          src="https://files.authing.co/authing-guard/push-login-open-application.svg"
          placeholder={<Spin />}
          className="qrcode-verifier"
          alt={t('login.downloadIOS') as string}
        ></LazyloadImage>
      </div>

      <div className="guide-step">
        <div className="title">
          <span className="dot"></span>
          <span>4. {t('login.scanFollowingQrcode')}</span>
        </div>
        <div
          className="qrcode-container center grey-bg"
          style={{
            marginTop: '16px',
            padding: '25px 0',
            boxSizing: 'border-box'
          }}
        >
          <QRCodeSVG
            size={80}
            value={qrcodeInfo}
            style={{ padding: '5px', backgroundColor: '#fff' }}
          ></QRCodeSVG>
        </div>
      </div>

      <div className="guide-step">
        <div className="title">
          <span className="dot"></span>
          <span>5. {t('login.relevanceApp')}</span>
        </div>
        <div className="desc">{t('login.receiveMessageFromAuthingToken')}</div>
        <div className="qrcode-container center grey-bg">
          <LazyloadImage
            src="https://files.authing.co/authing-guard/push-login-relevance-application.svg"
            placeholder={<Spin />}
            className="qrcode-verifier"
            alt={t('login.receiveMessageFromAuthingToken') as string}
          ></LazyloadImage>
        </div>
      </div>
    </>
  )
}
