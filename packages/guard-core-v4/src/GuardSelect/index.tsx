import './styles.less'

import { Avatar, List } from 'shim-antd'

import { AvatarProps } from 'shim-antd/lib/avatar'

import { ListItemProps, ListProps } from 'shim-antd/lib/list'

import classNames from 'classnames'

import { React, CSSProperties } from 'shim-react'

export interface GuardSelectItem {
  /** avatar 头像展示 */
  avatar?: AvatarProps | string
  /** 标题 */
  title?: React.ReactNode
  /** 描述 */
  description?: React.ReactNode
  /** 右侧操作组 */
  actions?: ListItemProps['actions']
  /** 右侧额外的渲染内容 */
  extra?: ListItemProps['extra']
  /** 数据项子内容，便于自定义 */
  children?: React.ReactNode
  /** 其他元字段 */
  [key: string]: any
}

export interface GuardSelectProps<T = any> extends ListProps<any> {
  /**数据项之间的间隙，默认`20px` */
  gap?: CSSProperties['marginBottom']
  /** 数据源 */
  dataSource: T[]

  onSelect?: (item?: T, index?: number) => void

  isNewStyle?: boolean
}

/** 选择列表组件 兼容绝大多数选择场景 */
export const GuardSelect = <D extends GuardSelectItem = any>(
  props: GuardSelectProps<D>
) => {
  const { dataSource, onSelect, gap = 20, isNewStyle, ...listProps } = props

  return (
    // @ts-ignore
    <List
      split={false}
      size="small"
      {...listProps}
      className={classNames(listProps.className, 'authing-guard-select-list')}
      dataSource={dataSource}
      renderItem={(item, i) => (
        // @ts-ignore
        <List.Item
          actions={item?.actions}
          extra={item?.extra}
          key={i}
          onClick={() => onSelect?.(item, i)}
          className={classNames('authing-guard-select-list-item')}
          style={dataSource?.length !== i + 1 ? { marginBottom: gap } : {}}
        >
          <List.Item.Meta
            avatar={
              typeof item?.avatar === 'string' ? (
                <Avatar size={40} src={item.avatar} />
              ) : (
                <Avatar size={40} {...item.avatar} />
              )
            }
            title={item?.title}
            description={item?.description}
          />
        </List.Item>
      )}
    />
  )
}
