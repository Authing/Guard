import { React } from 'shim-react'

import { useTranslation } from 'react-i18next'

import { GuardModuleType } from '../Guard/module'

import { ImagePro } from '../ImagePro'

import SubmitButton from '../SubmitButton'

import {
  useGuardInitData,
  useGuardModule,
  useGuardPublicConfig
} from '../_utils/context'

import { SubmitSuccessInitData } from './interface'

import { useGuardView } from '../Guard/core/hooks/useGuardView'

const { useEffect, useRef, useState } = React

export const GuardSubmitSuccessView: React.FC = () => {
  const { t } = useTranslation()

  const initData = useGuardInitData<SubmitSuccessInitData>()

  const { changeModule: __changeModule } = useGuardModule()

  const [countDown, setCountDown] = useState(5)

  const timerRef = useRef<any>(0)

  const publicConfig = useGuardPublicConfig()

  useGuardView()

  const {
    title = t('common.problem.successTip'),
    message = t('common.problem.successTipMsg'),
    text = t('common.backLoginPage'),
    countDesc = t('common.pToLogin'),
    changeModule = GuardModuleType.LOGIN
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
      __changeModule?.(changeModule)
    }
  }, [countDown])

  return (
    <div className="g2-view-container g2-submit-success">
      <div className="g2-view-tabs g2-questions-send-success-page">
        <ImagePro
          className="plate"
          src={`${cdnBase}/questions-send-ok.png`}
          alt=""
          width={240}
          height={160}
        />
        <div className="title">{title}</div>
        <div className="message">{message}</div>
        <SubmitButton
          onClick={() => {
            __changeModule?.(changeModule)
          }}
          text={text as string}
        />
        <div className="timer-tip">
          {countDown} {countDesc}
        </div>
      </div>
    </div>
  )
}
