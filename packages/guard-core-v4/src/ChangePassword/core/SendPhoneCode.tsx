import { React } from 'shim-react'

import { useTranslation } from 'react-i18next'

import { SceneType } from 'authing-js-sdk'

import { IconFont } from '../../IconFont'

import { SendCodeByPhone } from '../../SendCode/SendCodeByPhone'

import { useGuardInitData } from '../../_utils/context'

interface SendPhoneCodeProps {
  publicConfig: any
}
export const SendPhoneCode = (props: SendPhoneCodeProps) => {
  const { t } = useTranslation()
  const verifyCodeLength = props.publicConfig.verifyCodeLength ?? 4
  // 是否开启了国际化短信功能
  const isInternationSms =
    props.publicConfig.internationalSmsConfig?.enabled || false

  const { phone } = useGuardInitData<Record<'phone', string>>()

  return (
    <div className="authing-g2-login-phone-code">
      <SendCodeByPhone
        {...props}
        isInternationSms={isInternationSms}
        className="authing-g2-input g2-send-code-input"
        autoComplete="off"
        size="large"
        placeholder={t('login.resetPassword.inputFourVerifyCode', {
          length: verifyCodeLength
        })}
        prefix={
          <IconFont
            type="authing-a-shield-check-line1"
            style={{ color: '#878A95' }}
          />
        }
        scene={SceneType.SCENE_TYPE_RESET}
        maxLength={verifyCodeLength}
        data={phone}
        onSendCodeBefore={async () => {}}
      />
    </div>
  )
}
