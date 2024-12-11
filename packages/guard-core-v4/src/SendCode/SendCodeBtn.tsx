import { Button } from 'shim-antd'

import { React } from 'shim-react'

import { useTranslation } from 'react-i18next'

import './style.less'

import { ButtonProps } from 'shim-antd'

import { i18n } from '../_utils/locales'

const { useState, useRef, useEffect, useMemo, useImperativeHandle } = React

export interface SendCodeProps extends ButtonProps {
  beforeSend: () => Promise<boolean>
  btnRef?: React.RefObject<HTMLButtonElement>
  setSent?: (value: boolean) => void
  sendDesc?: string
  timerTime?: number
}

const useSentCounter = (effect: any, timerTime = 60) => {
  const [countDown, setCountDown] = useState(0)
  const timerRef = useRef<any>(0)

  useEffect(() => {
    return () => clearInterval(timerRef.current)
  }, [])

  useEffect(() => {
    if (countDown <= 0) {
      clearInterval(timerRef.current)
      effect?.(false)
    } else {
      effect?.(true)
    }
  }, [countDown, effect])

  const enabled = useMemo(() => countDown <= 0, [countDown])

  const send = () => {
    setCountDown(timerTime)

    timerRef.current = setInterval(() => {
      setCountDown(prev => {
        return prev - 1
      })
    }, 1000)
  }

  return {
    enabled,
    send,
    countDown
  }
}

export const SendCodeBtn = React.forwardRef((props: SendCodeProps, ref) => {
  const { t } = useTranslation()
  const {
    sendDesc = t('login.clickSent'),
    beforeSend,
    btnRef,
    setSent,
    timerTime,
    ...buttonProps
  } = props
  const { enabled, send, countDown } = useSentCounter(setSent, timerTime)
  const [loading, setLoading] = useState(false)
  const disabled = useMemo(() => {
    return !enabled || loading
  }, [enabled, loading])

  const onClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setLoading(true)
    if (disabled) {
      return
    }
    let beforeStop = !(await beforeSend())
    if (beforeStop) {
      setLoading(false)
      return
    }
    setLoading(false)
    send()
  }

  useImperativeHandle(ref, () => {
    return {
      send
    }
  })

  return (
    <Button
      className={`${
        buttonProps.type ?? 'authing-g2-send-code-btn g2-loading-btn-center'
      } ${i18n.resolvedLanguage === 'ja-JP' ? 'send-code-btn-jp' : ''} `}
      disabled={disabled}
      loading={loading}
      onClick={onClick}
      ref={btnRef}
      type="ghost"
      {...buttonProps}
    >
      {loading === true && <span></span>}
      {loading === false && (
        <span>
          {enabled
            ? sendDesc
            : t('common.retryAfterTime', {
                time: countDown
              })}
        </span>
      )}
    </Button>
  )
})
