import { Button } from 'shim-antd'

import { React } from 'shim-react'

import { ButtonProps } from 'shim-antd/lib/button'

import { useGuardButtonState } from '../_utils/context'

import './styles.less'

import { IconFont } from '../IconFont'

export interface GuardButtonProps extends ButtonProps {}

const { useEffect, useMemo, useState } = React

export const GuardButton: React.FC<GuardButtonProps> = props => {
  const [isHover, setHover] = useState(false)
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

    if ((isHover && type === 'primary') || props.loading) {
      className += ' authing-btn--icon'
    }

    return className
  }, [isLockButtonClick, props, type, isHover])

  const [children, setChildren] = useState(props.children)
  useEffect(() => {
    if ((isHover && type === 'primary') || props.loading) {
      setChildren(
        <>
          {props.children}
          {!props.loading ? (
            <IconFont type="authing-arrow-guard" className="authing-btn-icon authing-btn-arrow" />
          ) : (
            <IconFont
              type="authing-loading-guard"
              className="authing-btn-icon authing-btn-loading"
            />
          )}
        </>
      )
    } else {
      setChildren(<>{props.children}</>)
    }
  }, [isHover, props.loading, props.children])

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
      onMouseEnter={() => {
        setHover(true)
      }}
      onMouseLeave={() => {
        setHover(false)
      }}
    >
      {children}
    </Button>
  )
}
