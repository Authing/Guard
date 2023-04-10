import { Popover } from 'shim-antd'

import { React } from 'shim-react'

import { useTranslation } from 'react-i18next'

import { IconFont } from '../../IconFont'

import { useMediaSize } from '../../_utils/hooks'

import './style.less'

const { useMemo, useCallback } = React

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

  const { isPhoneMedia } = useMediaSize()

  const triggerWay = useMemo(() => {
    return isPhoneMedia ? 'click' : 'hover'
  }, [isPhoneMedia])

  const finallyLists = useMemo(() => {
    return [
      ...lists,
      {
        operation: false,
        id: 'other',
        title: t('login.useOtherAccount'),
        element: (
          <div className="g2-multiple__icon--add-line">
            <IconFont style={{ fontSize: 24, color: '#4E5969' }} type="authing-add-line"></IconFont>
          </div>
        )
      }
    ]
  }, [lists, t])

  const onDel = useCallback(
    (e: React.MouseEvent, id: string) => {
      handleDel(id)
      e.stopPropagation()
    },
    [handleDel]
  )

  const renderLits = useMemo(() => {
    return finallyLists.map(option => {
      const { photo, title, description, id, operation = true, element } = option as SelectOptions
      return (
        <li className="g2-multiple__li" key={id} onClick={() => onClick(id)}>
          {element ? element : <img className="g2-multiple__avatar" alt="" src={photo} />}

          <section className="g2-multiple__body">
            {title && <span className="g2-multiple__title">{title}</span>}
            <span className={title ? 'g2-multiple__desc' : 'g2-multiple__title'}>
              {description}
            </span>
          </section>
          {operation && (
            <span className="g2-multiple__op" onClick={e => e.stopPropagation()}>
              <Popover
                trigger={triggerWay}
                overlayClassName="g2-multiple__op-wrapper"
                getPopupContainer={(triggerNode: any) => triggerNode}
                content={
                  <div className="g2-multiple__del" onClick={(e: React.MouseEvent) => onDel(e, id)}>
                    <IconFont
                      style={{
                        fontSize: 20,
                        marginRight: 8
                      }}
                      type="authing-indeterminate-circle-line"
                    />
                    <span>{t('common.del')}</span>
                  </div>
                }
              >
                <div className="g2-multiple__icon">
                  <IconFont type="authing-more-fill1"></IconFont>
                </div>
              </Popover>
            </span>
          )}
        </li>
      )
    })
  }, [finallyLists, onClick, onDel, t, triggerWay])

  return <ul className="g2-multiple">{renderLits}</ul>
}

export { SelectPanel }
