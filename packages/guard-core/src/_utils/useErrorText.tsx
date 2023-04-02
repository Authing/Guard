import { React } from 'shim-react'

import { useTranslation } from 'react-i18next'

const { useState } = React

export const usePasswordErrorText = () => {
  const { t } = useTranslation()

  const [show, setPasswordErrorTextShow] = useState(false)

  return {
    setPasswordErrorTextShow,
    getPassWordUnsafeText: () => {
      return (
        <>
          {show ? (
            <div
              style={{
                marginBottom: 23,
                fontSize: 12,
                color: '#E8353E',
                display: 'block'
              }}
            >
              {t('common.passwordUnsafeTip')}
            </div>
          ) : (
            <></>
          )}
        </>
      )
    }
  }
}
