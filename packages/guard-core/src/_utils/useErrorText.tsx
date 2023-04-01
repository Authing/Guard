import { React } from 'shim-react'

import { i18n } from '../_utils/locales'

const { useState } = React

export const usePasswordErrorText = () => {
  const { t } = i18n

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
