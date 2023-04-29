import { React } from 'shim-react'

import { Space, Checkbox } from 'shim-antd'

import './style.less'

import { getClassnames } from '../../../_utils'

import { Agreement } from '../../../Type/application'

import { useAgreements } from '../../../Guard/core/hooks/useAgreements'

export interface AgreementsProps {
  value?: boolean
  onChange?: (value: boolean) => void
  style?: React.CSSProperties
  agreements: Agreement[]
  showError?: boolean
}

const { useState, useMemo, useEffect } = React

export const Agreements: React.FC<AgreementsProps> = ({
  showError,
  onChange = () => {},
  style,
  agreements
}) => {
  const [acceptList, setAcceptList] = useState<(string | number)[]>([])

  const toggleItemCheck = (id: string | number) => {
    setAcceptList(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id)
      }
      return [...prev, id]
    })
  }

  useAgreements({
    agreements,
    checkedAgreements: acceptList,
    checkAllAgreements() {
      const acceptList = agreements.map(agreement => {
        return agreement.id
      })
      setAcceptList(acceptList)
    },
    unCheckAllAgreements() {
      setAcceptList([])
    }
  })

  /** 是否可以注册 */
  const isAccept = useMemo(() => {
    /** 所有必须勾选的都勾了就可以通过 */
    return agreements
      .filter(item => item.required)
      .every(item => acceptList.includes(item.id))
  }, [acceptList, agreements])

  useEffect(() => {
    onChange(isAccept)
  }, [isAccept, onChange])

  return (
    <div
      className={getClassnames([
        'authing-agreements',
        showError && 'authing-agreements-error'
      ])}
    >
      {agreements.map(item => {
        return (
          <div
            key={item.id}
            style={{ ...style }}
            className={getClassnames([
              'authing-agreements-item',
              item.required &&
                !acceptList.includes(item.id) &&
                'authing-agreements-item-invalid'
            ])}
            onClick={(e: any) => {
              e.persist()
              if (e.target.nodeName !== 'A') {
                toggleItemCheck(item.id)
              }
            }}
          >
            <Space align="start" size={5}>
              <Checkbox
                className="authing-agreements-checkbox"
                checked={acceptList.includes(item.id)}
              />
              <div
                className="authing-agreements-item-content"
                dangerouslySetInnerHTML={{
                  __html: item.title
                }}
              ></div>
            </Space>
          </div>
        )
      })}
    </div>
  )
}
