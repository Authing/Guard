import { Button, ButtonProps } from 'shim-antd'

import '@antd-es-style/button/style/index.less'

import { React } from 'shim-react'

import { useGuardButtonState } from '../_utils/context'

import './styles.less'

const { useMemo } = React

export interface GuardButtonProps extends ButtonProps {}

export const GuardButton: React.FC<GuardButtonProps> = props => {
  const { spin } = useGuardButtonState()

  const { type } = props

  const isLockButtonClick = useMemo(() => {
    return spin
  }, [spin])

  const buttonClassName = useMemo(() => {
    let { className } = props

    if (type) {
      className += ' guard-button-link-like'
    }

    if (isLockButtonClick) {
      className += ' guard-button-disabled'
    }

    return className
  }, [isLockButtonClick, props, type])

  return (
    <Button
      {...props}
      className={buttonClassName}
      onClick={(e: any) => {
        if (isLockButtonClick) {
          // // 阻止事件冒泡
          // e.stopPropagation()
          return
        }

        if (props.onClick) {
          props.onClick(e)
        }
      }}
    />
  )
}
