import classNames from 'classnames'
import { OTPInput, SlotProps } from 'input-otp'
import { Divider } from 'shim-antd'
import { React } from 'shim-react'

import './style.less'

interface VerifyCodeInputProps extends React.HTMLAttributes<HTMLDivElement> {
  length?: number
  size?: string
  gutter?: string
  onEenter?: Function
  showDivider?: boolean
  onChange?: any
  value?: string
  onFinish?: any
}

const InputCursor = () => {
  return <div className="authing-g2-otp-input-cursor"></div>
}
const SoltInput = (solt: SlotProps & { style: any }) => {
  return (
    <div
      style={solt.style}
      className={classNames('authing-g2-code-input-item', {
        focus: solt.isActive
      })}
    >
      {solt.char !== null && <div>{solt.char}</div>}
      {solt.hasFakeCaret && <InputCursor />}
    </div>
  )
}

export const VerifyCodeInput: React.FC<VerifyCodeInputProps> = ({
  length = 4,
  size = '46px',
  gutter = length > 4 ? '14px' : '24px',
  className,
  onEenter,
  showDivider = false,
  onChange,
  value,
  onFinish,
  ...rest
}) => {
  return (
    <div className="authing-g2-code-input" {...rest}>
      <OTPInput
        value={value}
        onChange={onChange}
        maxLength={length}
        onComplete={onFinish}
        render={({ slots }) => (
          <div className="authing-g2-otp-wrapper">
            {slots.map((slot, idx) => (
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
  )
}
