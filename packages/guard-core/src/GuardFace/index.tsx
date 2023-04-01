import { Avatar, Tag } from 'shim-antd'

import { AvatarProps } from 'shim-antd/lib/avatar'

import { TagProps } from 'shim-antd/lib/tag'

import { React } from 'shim-react'

import './styles.less'

export interface GuardFaceProps {
  /** 顶部 avatar 头像展示 */
  avatar: AvatarProps | string
  /** 标题头部 */
  title: React.ReactNode
  /** 标题描述 */
  description?: React.ReactNode
  /** 标签功能 */
  tags?: TagProps[]
}

/** 顶部通用区域封装，同时兼容样式的层叠和功能的自定义 */
export const GuardFace = (props: GuardFaceProps) => {
  const { avatar, title, description, tags } = props
  const avatarProps: AvatarProps =
    typeof avatar === 'string' ? { shape: 'square', size: 48, src: avatar } : avatar
  return (
    <div className="g2-view-header">
      <Avatar className="g2-view-avatar icon" {...avatarProps} />
      <div className="title">{title}</div>
      <div className="title-description">{description}</div>
      {tags?.map?.((tag, i) => (
        // @ts-ignore
        <Tag key={i} className="authing-header-tag" {...tag} />
      ))}
    </div>
  )
}
