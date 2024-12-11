import { React } from 'shim-react'

import { useTranslation } from 'react-i18next'
import { ImagePro } from '../../ImagePro'
import { useGuardInitData, useGuardPublicConfig } from '../../_utils/context'

interface ErrorInitData {
  logo: string
  title?: string
  description?: string
}

export const EyGuardInviteExpireView = () => {
  const initData = useGuardInitData<ErrorInitData>()
  const { t } = useTranslation()
  const publicConfig = useGuardPublicConfig()
  const {
    logo = `${publicConfig.cdnBase}/ey_error.png`,
    title = t('common.ey.validateFail'),
    description = t('common.ey.contactsDesc')
  } = initData

  return (
    <div className="g2-view-container ey-error">
      <div className="g2-error-content">
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {logo && <ImagePro src={logo} alt="" style={{ height: 120 }} />}
        </div>
        {title && <div className="error-title">{title}</div>}

        {description && <div className="error-description"> {description}</div>}
      </div>
    </div>
  )
}
