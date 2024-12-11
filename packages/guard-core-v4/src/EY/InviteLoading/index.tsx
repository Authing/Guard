import { React } from 'shim-react'
import { useTranslation } from 'react-i18next'
import EyLoading from '../../assets/images/ey_loading.gif'
import { useGuardInitData } from '../../_utils/context'
import { EyGuardInviteLoginInitData, useRegisterHandleHook } from '../interface'
const { useEffect } = React
export const EyGuardInviteLoadingView = () => {
  const initData = useGuardInitData<EyGuardInviteLoginInitData>()

  const { t } = useTranslation()

  const { context } = initData

  const onRegisterHandle = useRegisterHandleHook(initData)

  useEffect(() => {
    onRegisterHandle(context)
  }, [])

  return (
    <div className="g2-view-container ey-invite-login">
      <div className="g2-view-container-inner">
        <div className="g2-view-content">
          <div className="title">
            {t('common.ey.acountTitle', [initData.name])}
          </div>
          <div className="loading">
            <img src={EyLoading} alt="" width="80" />
          </div>
          <div className="desc">{t('common.ey.invitedLoading')}</div>
        </div>
      </div>
    </div>
  )
}
