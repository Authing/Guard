import { React } from 'shim-react'

import { getClassnames } from '../_utils'

import './iconfont'

import './style.less'

export const IconFont: React.FC<{
  type: string
  style?: React.CSSProperties
  className?: string
}> = ({ type, style, className }) => {
  return (
    <svg style={{ ...style }} className={getClassnames(['g2-icon', className])}>
      <use xlinkHref={`#${type}`}></use>
    </svg>
  )
}
