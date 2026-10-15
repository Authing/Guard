import {
  Avatar,
  DeleteOutlined,
  MoreOutlined,
  PlusOutlined,
  Popover,
  RightOutlined
} from 'shim-antd'

import { React } from 'shim-react'

import { useTranslation } from 'react-i18next'

import './style.less'

const { useState } = React

interface SelectPanelProps {
  lists: SelectOptions[]
  /**
   * 点击删除
   */
  handleDel: (id: string) => void
  /**
   * 点击 li
   */
  onClick: (id: string) => void
}

export interface SelectOptions {
  /**
   * 头像
   */
  photo?: string
  /**
   * 标题
   */
  title?: string
  /**
   * 描述
   */
  description?: string
  /**
   * 用户 ID 唯一标识符
   */
  id: string | 'other'
  /**
   * 显示操作栏 default: true
   */
  operation?: boolean
  /**
   * 登录时间
   */
  _updateTime: number
  /**
   * 替代图片元素
   */
  element?: React.ReactElement

  way: string
}

const SelectPanel: React.FC<SelectPanelProps> = props => {
  const { lists, handleDel, onClick } = props
  const { t } = useTranslation()

  const [activeMenu, setActiveMenu] = useState<string>()

  const renderLists = lists.map((option, index) => {
    const {
      photo,
      title,
      description,
      id,
      operation = true,
      element
    } = option as SelectOptions
    const accountLabel = title?.trim() || description?.trim() || id
    const initials = accountLabel
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(word => word[0])
      .join('')
      .toUpperCase()
    const subtitle =
      title && description && title !== description
        ? description
        : index === 0 && option._updateTime > 0
        ? t('common.lastUsed')
        : undefined

    return (
      <li className="g2-multiple__li" key={id}>
        <button
          type="button"
          className={`g2-multiple__account${
            operation ? ' g2-multiple__account--with-operation' : ''
          }`}
          onClick={() => onClick(id)}
        >
          {element ? (
            <span className="g2-multiple__avatar">{element}</span>
          ) : (
            <Avatar
              className="g2-multiple__avatar"
              size={32}
              src={photo || undefined}
            >
              {initials}
            </Avatar>
          )}
          <span className="g2-multiple__body">
            <span className="g2-multiple__title" title={accountLabel}>
              {accountLabel}
            </span>
            {subtitle && (
              <span className="g2-multiple__desc" title={subtitle}>
                {subtitle}
              </span>
            )}
          </span>
          <RightOutlined
            className="g2-multiple__account-arrow"
            aria-hidden="true"
          />
        </button>
        {operation && (
          <Popover
            trigger="click"
            placement="bottomRight"
            showArrow={false}
            open={activeMenu === id}
            onOpenChange={open => setActiveMenu(open ? id : undefined)}
            overlayClassName="g2-multiple__op-wrapper"
            getPopupContainer={triggerNode =>
              triggerNode.parentElement || triggerNode
            }
            content={
              <div role="menu">
                <button
                  type="button"
                  role="menuitem"
                  className="g2-multiple__del"
                  onClick={() => {
                    setActiveMenu(undefined)
                    handleDel(id)
                  }}
                >
                  <DeleteOutlined aria-hidden="true" />
                  {t('login.removeSavedAccount')}
                </button>
              </div>
            }
          >
            <button
              type="button"
              className="g2-multiple__op"
              aria-label={`${t('common.more')}: ${accountLabel}`}
              aria-haspopup="menu"
              aria-expanded={activeMenu === id}
            >
              <MoreOutlined aria-hidden="true" />
            </button>
          </Popover>
        )}
      </li>
    )
  })

  return (
    <div
      className="g2-multiple"
      onKeyDown={event => {
        if (event.key === 'Escape') {
          const trigger = event.currentTarget.querySelector<HTMLButtonElement>(
            '[aria-expanded="true"]'
          )
          setActiveMenu(undefined)
          trigger?.focus()
        }
      }}
    >
      <ul className="g2-multiple__list">{renderLists}</ul>
      <div className="g2-multiple__footer">
        <button
          type="button"
          className="g2-multiple__other"
          onClick={() => onClick('other')}
        >
          <PlusOutlined aria-hidden="true" />
          <span>{t('login.useOtherAccount')}</span>
        </button>
      </div>
    </div>
  )
}

export { SelectPanel }
