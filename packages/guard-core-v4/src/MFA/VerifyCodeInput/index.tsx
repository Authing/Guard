import { Divider } from 'shim-antd'

import { React } from 'shim-react'

import { OTPInput, SlotProps } from 'input-otp'

import './style.less'
import classNames from 'classnames'

interface VerifyCodeInputProps extends React.HTMLAttributes<HTMLDivElement> {
  length?: number
  size?: string
  gutter?: string
  onEenter?: Function
  showDivider?: boolean
  onChange?: any
  value?: string
  onFinish?: any
  ResentBtnSort?: () => JSX.Element
}

export const SoltInput = (solt: SlotProps & { style: any }) => {
  return (
    <div
      style={solt.style}
      className={classNames('authing-g2-code-input-item', {
        focus: solt.isActive
      })}
    >
      {solt.char !== null && <div>{solt.char}</div>}
      {solt.hasFakeCaret && <div className="authing-g2-otp-input-cursor"></div>}
    </div>
  )
}

export const VerifyCodeInput: React.FC<VerifyCodeInputProps> = ({
  length = 4,
  size = '46px',
  gutter = length > 4 ? '14px' : '24px',
  className,
  onEenter,
  showDivider,
  onChange,
  value,
  onFinish,
  ResentBtnSort,
  ...rest
}) => {
  return (
    <div className="ey-captcha-inputs">
      <div className="authing-g2-code-input" {...rest}>
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
      {ResentBtnSort && ResentBtnSort()}
    </div>
  )
}
