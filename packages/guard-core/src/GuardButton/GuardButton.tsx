import { Button } from 'shim-antd'

import { React } from 'shim-react'

import { ButtonProps } from 'shim-antd/lib/button'

import './styles.less'

import { IconFont } from '../IconFont'

export interface GuardButtonProps extends ButtonProps {}

const { useEffect, useMemo, useState } = React

export const GuardButton: React.FC<GuardButtonProps> = props => {
  const [isHover, setHover] = useState(false)

  const { type } = props

  const buttonClassName = useMemo(() => {
    let { className } = props

    if (type) {
      className += ' guard-button-link-like'
    }

    // if ((isHover && type === 'primary') || props.loading) {
    //   className += ' authing-btn--icon'
    // }

    return className
  }, [props, type, isHover])

  // const [children, setChildren] = useState(props.children)
  // useEffect(() => {
  //   if ((isHover && type === 'primary') || props.loading) {
  //     setChildren(
  //       <>
  //         {props.children}
  //         {!props.loading ? (
  //           <div className='authing-btn-icon'>
  //             <IconFont type="authing-arrow-guard" className="authing-btn-arrow" />
  //           </div>
  //         ) : (
  //           <div className='authing-btn-icon '>
  //             <IconFont
  //               type="authing-loading-guard"
  //               className="authing-btn-loading"
  //             />
  //           </div>
  //         )}
  //       </>
  //     )
  //   } else {
  //     setChildren(<>{props.children}</>)
  //   }
  // }, [isHover, props.loading, props.children])

  return (
    <Button
      {...props}
      className={buttonClassName}
      onClick={(e: any) => {
        if (props.onClick) {
          props.onClick(e)
        }
      }}
      onMouseEnter={e => {
        setHover(true)
        props?.onMouseEnter?.(e)
      }}
      onMouseLeave={e => {
        setHover(false)
        props?.onMouseLeave?.(e)
      }}
    >
      {props.children}
      <div
        className={`authing-btn-icon ${
          isHover &&
          type === 'primary' &&
          !props.loading &&
          'authing-btn-icon--hover'
        }`}
      >
        <IconFont type="authing-arrow-guard" className="authing-btn-arrow" />
      </div>
      <div
        className={`authing-btn-icon ${
          props.loading && 'authing-btn-icon--loading'
        }`}
      >
        <IconFont
          type="authing-loading-guard"
          className="authing-btn-loading"
        />
      </div>
    </Button>
  )
}
