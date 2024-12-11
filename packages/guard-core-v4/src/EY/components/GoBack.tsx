import { React } from 'shim-react'

import { useTranslation } from 'react-i18next'
import { GuardButton } from '../../GuardButton'
import { IconFont } from '../../IconFont'

export const GoBack = (props: any) => {
  const { t } = useTranslation()
  const { clickHandle, text = t('common.back') } = props
  return (
    <div className="back_wrapper">
      <GuardButton type="link" onClick={clickHandle} className="back_btn">
        <IconFont type="authing-arrow-left-s-line" style={{ fontSize: 24 }} />
        <span>{text}</span>
      </GuardButton>
    </div>
  )
}
