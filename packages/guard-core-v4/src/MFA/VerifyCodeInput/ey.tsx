import { Divider } from 'shim-antd'
import { OTPInput } from 'input-otp'
import { React } from 'shim-react'
import { useTranslation } from 'react-i18next'
import { SoltInput } from '.'
import { SendCodeBtn } from '../../SendCode/SendCodeBtn'
import './style.less'

interface VerifyCodeInputProps extends React.HTMLAttributes<HTMLDivElement> {
  beforeSend: () => Promise<boolean>
  verifyType: 'emailCode' | 'phoneCode'
  length?: number
  size?: string
  gutter?: string
  onEenter?: Function
  showDivider?: boolean
  onChange?: any
  value?: string
  onFinish?: any
}

export const EyVerifyCodeInput = React.forwardRef<any, VerifyCodeInputProps>(
  (
    {
      length = 4,
      size = '46px',
      gutter = length > 4 ? '14px' : '24px',
      className,
      onEenter,
      showDivider,
      onChange,
      value,
      onFinish,
      beforeSend,
      verifyType,
      ...rest
    },
    ref
  ) => {
    const { t } = useTranslation()

    return (
      <div className="ey-captcha-inputs">
        <div className="authing-g2-code-input" {...(rest as any)}>
          <OTPInput
            value={value}
            onChange={onChange}
            maxLength={length}
            onComplete={onFinish}
            render={({ slots }: any) => (
              <div className="authing-g2-otp-wrapper">
                {slots.map((slot: any, idx: number) => (
                  <>
                    <SoltInput
                      key={idx}
                      {...slot}
                      style={{
                        marginLeft: idx === 0 ? 0 : gutter
                      }}
                    />
                    {showDivider && idx === Math.floor(length / 2 - 1) && (
                      <Divider className="authing-g2-code-input-divider" />
                    )}
                  </>
                ))}
              </div>
            )}
            autoFocus
          />
        </div>
        <SendCodeBtn
          ref={ref}
          sendDesc={t('common.ey.resendCaptcha')!}
          className="resend_code"
          beforeSend={beforeSend}
          timerTime={verifyType === 'emailCode' ? 60 * 5 : 60}
          type="link"
        />
      </div>
    )
  }
)
