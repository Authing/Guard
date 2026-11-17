import { React } from 'shim-react'

import { Space, Checkbox } from 'shim-antd'

import { useTranslation } from 'react-i18next'

import './style.less'

import { getClassnames } from '../../../_utils'

import { Agreement } from '../../../Type/application'

import { useAgreements } from '../../../Guard/core/hooks/useAgreements'

import { useGuardPublicConfig } from '../../../_utils/context'

const { useState, useMemo, useEffect, useCallback, useRef } = React

const AgreementSelectionContext = React.createContext<{
  acceptList: (string | number)[]
  setAcceptList: React.Dispatch<React.SetStateAction<(string | number)[]>>
  validationAttempt: number
  reportValidationError: () => void
} | null>(null)

export const useAgreementSelection = () =>
  React.useContext(AgreementSelectionContext)

export const AgreementSelectionProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const isB2C = useGuardPublicConfig()?.sceneCode === 'B2C'
  const [acceptList, setAcceptList] = useState<(string | number)[]>([])
  const [validationAttempt, setValidationAttempt] = useState(0)
  const reportValidationError = useCallback(() => {
    setValidationAttempt(attempt => attempt + 1)
  }, [])
  const value = useMemo(
    () => ({
      acceptList,
      setAcceptList,
      validationAttempt,
      reportValidationError
    }),
    [acceptList, validationAttempt, reportValidationError]
  )

  return (
    <AgreementSelectionContext.Provider value={isB2C ? value : null}>
      {children}
    </AgreementSelectionContext.Provider>
  )
}

export interface AgreementsProps {
  value?: boolean
  onChange?: (value: boolean, acceptList: (string | number)[]) => void
  style?: React.CSSProperties
  agreements: Agreement[]
  showError?: boolean
}

export const Agreements: React.FC<AgreementsProps> = ({
  showError,
  onChange = () => {},
  style,
  agreements
}) => {
  const { t } = useTranslation()
  const isB2C = useGuardPublicConfig()?.sceneCode === 'B2C'
  const rootRef = useRef<HTMLDivElement>(null)
  const selection = useAgreementSelection()
  const [localAcceptList, setLocalAcceptList] = useState<(string | number)[]>(
    []
  )
  const { acceptList, setAcceptList } = selection ?? {
    acceptList: localAcceptList,
    setAcceptList: setLocalAcceptList
  }

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

  const validationAttempt = selection?.validationAttempt ?? 0
  const lastValidationAttempt = useRef(validationAttempt)
  const hasError = !isAccept && validationAttempt > 0

  useEffect(() => {
    // 切换 Tab 重新挂载时，不重播共享状态中已有的校验失败。
    const isNewAttempt = validationAttempt > lastValidationAttempt.current
    lastValidationAttempt.current = validationAttempt
    if (!isNewAttempt || isAccept) return

    const invalidItems = Array.from(
      rootRef.current?.querySelectorAll<HTMLElement>(
        '.authing-agreements-item-invalid'
      ) ?? []
    )

    invalidItems.forEach(item => {
      item.classList.remove('shaking')
      // 重置动画，连续点击未通过校验的入口时也能再次抖动。
      void item.offsetWidth
      item.classList.add('shaking')
    })

    const clearShaking = () => {
      invalidItems.forEach(item => item.classList.remove('shaking'))
    }
    const timeout = setTimeout(clearShaking, 820)

    return () => {
      clearTimeout(timeout)
      clearShaking()
    }
  }, [validationAttempt, isAccept])

  useEffect(() => {
    onChange(isAccept, acceptList)
  }, [isAccept, onChange, acceptList])

  return (
    <div
      ref={rootRef}
      className={getClassnames([
        'authing-agreements',
        isB2C && 'authing-agreements-b2c',
        (showError || hasError) && 'authing-agreements-error',
        hasError && 'authing-agreements-validation-error'
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
      {hasError && (
        <div className="authing-agreements-error-message" role="alert">
          {t('common.loginProtocolTips')}
        </div>
      )}
    </div>
  )
}
