import { Divider, Input } from 'shim-antd'

import { React } from 'shim-react'

import './style.less'

interface VerifyCodeInputProps extends React.HTMLAttributes<HTMLDivElement> {
  verifyCode: string[]
  setVerifyCode: (code: string[]) => void
  length?: number
  onEnter?: Function
}

const { Fragment, useRef } = React

export const VerifyCodeInput: React.FC<VerifyCodeInputProps> = ({
  verifyCode,
  setVerifyCode,
  length = 6,
  onEnter
}) => {
  const inputRef = useRef<any[]>([])

  const handleChange = (val: string | undefined = '', index: number) => {
    const num = parseInt(val)
    if (isNaN(num)) {
      val = ''
    } else {
      val = String(num)
    }
    const codes = [...verifyCode]
    codes[index] = val.split('').slice(-1)[0] || ''
    setVerifyCode(codes)

    if (val && inputRef.current[index + 1]) {
      inputRef.current[index + 1].focus()
    }
  }

  const handleKeyDown = (evt: any, index: number) => {
    const currentVal = verifyCode[index]

    switch (evt.keyCode) {
    case 8:
      if (!currentVal && inputRef.current[index - 1]) {
        handleChange('', index - 1)
        inputRef.current[index - 1].focus()
      }
      break

    case 13:
      onEnter?.()
      break
    default:
      break
    }
  }

  return (
    <div className="authing-code-input">
      {new Array(length).fill(0).map((_, index) => (
        <Fragment key={index}>
          <Input
            ref={(el: any) => (inputRef.current[index] = el)}
            className="authing-code-input-item"
            size="large"
            autoFocus={index === 0}
            onKeyDown={(evt: any) => handleKeyDown(evt, index)}
            value={verifyCode[index]}
            onChange={(evt: any) => handleChange(evt.target.value, index)}
          />
          {index === Math.floor(length / 2 - 1) && (
            <Divider className="authing-code-input-divider" />
          )}
        </Fragment>
      ))}
    </div>
  )
}
