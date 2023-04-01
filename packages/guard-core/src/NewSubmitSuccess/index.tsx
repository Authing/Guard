import { React } from 'shim-react'

import { i18n } from '../_utils'

import { GuardModuleType } from '..'

import { ImagePro } from '../ImagePro'

import SubmitButton from '../SubmitButton'

import { useGuardInitData, useGuardModule, useGuardPublicConfig } from '../_utils/context'

import { SubmitSuccessInitData } from './interface'

import { useGuardView } from '../Guard/core/hooks/useGuardView'

const { useEffect, useRef, useState } = React

export const GuardNewSubmitSuccessView: React.FC = () => {
  const { t } = i18n

  const initData = useGuardInitData<SubmitSuccessInitData>()

  const { changeModule: __changeModule } = useGuardModule()

  const [countDown, setCountDown] = useState(5)

  const timerRef = useRef<any>(0)

  const publicConfig = useGuardPublicConfig()

  useGuardView()

  const {
    title = t('login.resetPassword.successTip'),
    message = t('login.resetPassword.successTipMsg'),
    text = t('login.resetPassword.back'),
    countDesc = t('login.resetPassword.backLogin'),
    // changeModule = GuardModuleType.LOGIN,
    needBack = true,
    goBack = () => __changeModule?.(GuardModuleType.LOGIN)
  } = initData ?? {}
  const cdnBase = publicConfig?.cdnBase

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCountDown(prev => {
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timerRef.current)
  }, [])

  useEffect(() => {
    if (countDown <= 0) {
      clearInterval(timerRef.current)
      needBack && goBack?.()
    }
  }, [countDown, needBack, goBack])

  return (
    <div className="g2-view-container g2-submit-success g2-view-container-submit-success">
      <div className="g2-view-tabs g2-questions-send-success-pageWrap">
        <ImagePro
          className="plate-submit-success"
          src={`${cdnBase}/questions-send-ok.png`}
          alt=""
          width={157}
          height={120}
        />
        <div className="success-page-title ">{title}</div>
        <div className="success-page-message">{message}</div>
        {needBack && (
          <>
            <SubmitButton
              className="success-page-btn"
              onClick={() => {
                goBack?.()
              }}
              text={text as string}
            />
            <div className="success-page-timer-tip">
              {countDown} {countDesc}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
