import { React } from 'shim-react'

import { useShaking } from '../_utils/hooks'

import { GuardButton } from '../GuardButton'

import { useGuardButtonState } from '../_utils/context'

import { ButtonProps } from 'shim-antd'

const { forwardRef, useState, useImperativeHandle, useEffect } = React

interface SubmitButtonProps extends ButtonProps {
  text?: string
  className?: string
  onClick?: any
  disabled?: boolean
}
const SubmitButton = (props: SubmitButtonProps, ref: any) => {
  const { spinChange, spin: buttonSpin } = useGuardButtonState()
  let [spin, setSpin] = useState(false) // spin 状态需要手动设置关闭
  let [shaking, setShaking] = useState(false) // 抖动状态会自动关闭
  let { MountShaking, UnMountShaking } = useShaking() // 协议和 form input 抖动的挂载和卸载

  useEffect(() => {
    let timeOut: NodeJS.Timeout
    if (shaking === true) {
      timeOut = setTimeout(() => {
        UnMountShaking()
      }, 820)
    }

    return () => {
      clearTimeout(timeOut)
    }
  }, [UnMountShaking, shaking])

  useImperativeHandle(ref, () => ({
    onError: (text?: string) => {
      setSpin(false)
      setShaking(true)
      spinChange(false)
      let timeOut: NodeJS.Timeout

      timeOut = setTimeout(() => {
        MountShaking()
        clearTimeout(timeOut)
      })
    },
    onSpin: (sp: boolean) => {
      setSpin(sp)
      spinChange(sp)
    }
  }))

  let propsCls = props.className ? props.className : ''
  // let shakingCls = shaking ? 'shaking' : ''
  let shakingCls = ''
  return (
    <GuardButton
      {...props}
      size={props?.size ?? 'large'}
      type={props?.type ?? 'primary'}
      htmlType={props?.htmlType ?? 'submit'}
      loading={spin}
      disabled={buttonSpin ? true : props?.disabled ?? spin}
      onClick={props.onClick ? props.onClick : () => {}}
      className={`authing-g2-submit-button ${propsCls} ${shakingCls}`}
    >
      {props.text}
    </GuardButton>
  )
}
export default forwardRef(SubmitButton)
