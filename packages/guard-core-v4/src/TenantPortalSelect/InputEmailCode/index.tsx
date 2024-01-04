import { useTranslation } from 'react-i18next'
import { React } from 'shim-react'
import { VerifyCodeFormItem } from '../../MFA/VerifyCodeInput/VerifyCodeFormItem'
import { VerifyCodeInput } from '../../MFA/VerifyCodeInput'
import { SendCodeBtn } from '../../SendCode/SendCodeBtn'
import { useGuardHttp, useGuardPublicConfig } from '../../_utils'
import { EmailScene } from 'authing-js-sdk'
import { message } from 'shim-antd'
import { useEffectOnce } from 'react-use'

const { useRef, useState, useEffect } = React

interface Props {
  email: string
  setSent: (sent: boolean) => void
  onFinish: () => void
}

export const InputEmailCode: React.FC<Props> = ({
  email,
  setSent,
  onFinish
}) => {
  const { t } = useTranslation()
  const { post, get } = useGuardHttp()
  const publicConfig = useGuardPublicConfig()
  const codeLength = publicConfig?.verifyCodeLength

  const sendCodeBtnRef = useRef<HTMLButtonElement>(null)

  const sendVerifyCode = async () => {
    try {
      const {
        code,
        message: tips,
        apiCode
      } = await post('/api/v2/email/send', {
        email,
        scene: EmailScene.VerifyCode
      })
      if (apiCode === 2080) {
        // 一分钟只能发一次邮箱验证码的提示信息，特殊处理
        message.error(tips)
        return false
      }
      if (code === 200) {
        setSent(true)
        return true
      } else {
        message.error(t('login.sendCodeTimeout'))
        return false
      }
    } catch (e: any) {
      if (e.code === 'ECONNABORTED') {
        message.error(t('login.sendCodeTimeout'))
        return false
      }
      const errorMessage = JSON.parse(e.message)
      message.error(errorMessage.message)
      return false
    }
  }

  useEffect(() => {
    setTimeout(() => {
      sendCodeBtnRef.current?.click()
    })
  }, [])

  return (
    <>
      <VerifyCodeFormItem
        name="emailCode"
        codeLength={codeLength}
        ruleKeyword={t('common.captchaCode') as string}
      >
        <VerifyCodeInput length={codeLength} onFinish={onFinish} />
      </VerifyCodeFormItem>
      <SendCodeBtn
        btnRef={sendCodeBtnRef}
        setSent={setSent}
        beforeSend={() => sendVerifyCode()}
        type="link"
      />
    </>
  )
}
