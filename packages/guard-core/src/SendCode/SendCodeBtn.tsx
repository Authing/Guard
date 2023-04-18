import { Button } from 'shim-antd'

import { React } from 'shim-react'

import { i18n } from '../_utils'

import { useTranslation } from 'react-i18next'

import './style.less'

import { ButtonProps } from 'shim-antd/lib/button'

import { IconFont } from '../IconFont'

const TIME = 60

const { useState, useRef, useEffect, useMemo } = React

export interface SendCodeProps extends ButtonProps {
  beforeSend: () => Promise<boolean>
  btnRef?: React.RefObject<HTMLButtonElement>
  setSent?: (value: boolean) => void
  sendDesc?: string
}

const useSentCounter = (effect: any) => {
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
    setCountDown(TIME)

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

export const SendCodeBtn: React.FC<SendCodeProps> = props => {
  const { t } = useTranslation()
  const { sendDesc = t('login.clickSent'), beforeSend, btnRef, setSent, ...buttonProps } = props
  const { enabled, send, countDown } = useSentCounter(setSent)
  const [loading, setLoading] = useState(false)
  const disabled = useMemo(() => {
    return !enabled || loading
  }, [enabled, loading])

  const onClick = async () => {
    setLoading(true)
    if (disabled) {
      return
    }
    const beforeStop = !(await beforeSend())
    if (beforeStop) {
      setLoading(false)
      return
    }
    setLoading(false)
    send()
  }

  return (
    <Button
      {...buttonProps}
      className={`${buttonProps.type ?? 'authing-g2-send-code-btn g2-loading-btn-center'} ${
        i18n.language === 'ja-JP' ? 'send-code-btn-jp' : ''
      }`}
      disabled={loading || disabled}
      loading={loading}
      onClick={onClick}
      ref={btnRef}
      type="link"
      style={{padding: 0, height: 24}}
    >
      {loading === true && <div className={'authing-btn-icon authing-btn-icon--loading'} style={{margin: 0}}>
        <IconFont
          type="authing-loading-guard"
          className="authing-btn-loading"
        />
      </div>}
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
}
