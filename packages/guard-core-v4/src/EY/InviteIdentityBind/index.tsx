import { React } from 'shim-react'
import { useTranslation } from 'react-i18next'
import { ChangeLanguage } from '../../ChangeLanguage'
import { GuardModuleType } from '../../Guard'

import SubmitButton from '../../SubmitButton'
import {
  useGuardEvents,
  useGuardFinallyConfig,
  useGuardInitData,
  useGuardModule
} from '../../_utils/context'
import { GoBack } from '../components/GoBack'
import {
  EyGuardInviteIdentityBindInitData,
  useRegisterHandleHook
} from '../interface'
import { WeComQrcode } from './component/WeComQrcode'
import { WeComQrcodeNew } from './component/WeComQrcodeNew'
import { Lang } from '../../Type'
const { useCallback, useRef, useState } = React

export const EyGuardIviteIdentityBindView = () => {
  const initData = useGuardInitData<EyGuardInviteIdentityBindInitData>()

  const { t } = useTranslation()

  const config = useGuardFinallyConfig()

  const events = useGuardEvents()

  const { changeModule } = useGuardModule()

  const [refreshQrcode, setRefreshQrcode] = useState<number>(0)

  const submitButtonRef = useRef<any>(null)

  const {
    weComConfig,
    autoLogin,
    canBack = true,
    extIdpBindMsg,
    isNew = false
  } = initData

  const onRegisterHandle = useRegisterHandleHook(initData, submitButtonRef)

  const onLangChangeEnhance = useCallback(
    (lang: Lang) => {
      events?.onLangChange?.(lang)
      setRefreshQrcode(prev => prev + 1)
    },
    [events]
  )

  const onRegister = useCallback(
    async (identity?: string) => {
      const content = {
        connection: 'PASSWORD',
        identity: identity,
        ...initData.context
      }
      if (autoLogin) {
        // 自动登录
        changeModule?.(GuardModuleType.EY_INVITE_LOADING, {
          ...initData,
          context: content
        })
      } else {
        await onRegisterHandle?.(content)
      }
    },
    [autoLogin, changeModule, initData, onRegisterHandle]
  )

  return (
    <div className="g2-view-container ey-identity-bind">
      <div className="g2-view-container-inner">
        <div className="g2-view-header">
          {canBack && initData?.originModule && (
            <GoBack
              text={t('common.ey.backPreStep')}
              clickHandle={() => {
                initData?.originModule &&
                  changeModule?.(initData.originModule, initData.originContext)
              }}
            />
          )}

          <div className="content">
            <div className="title">{t('common.ey.identifyBind')}</div>
            <div className="sub_title">
              {extIdpBindMsg ? extIdpBindMsg : t('common.ey.identifyBindDesc')}
            </div>
          </div>
        </div>
        <div className="g2-view-content">
          {isNew ? (
            <WeComQrcodeNew
              id={weComConfig?.id}
              QRConfig={weComConfig?.QRConfig}
              onRegister={onRegister}
              refreshQrcode={refreshQrcode}
              setRefreshQrcode={setRefreshQrcode}
            />
          ) : (
            <WeComQrcode
              id={weComConfig?.id}
              QRConfig={weComConfig?.QRConfig}
              onRegister={onRegister}
              refreshQrcode={refreshQrcode}
              setRefreshQrcode={setRefreshQrcode}
            />
          )}
          {initData?.allowSkipBindExtIdp && (
            <SubmitButton
              style={{ marginTop: 24 }}
              ref={submitButtonRef}
              text={t('common.skip')!}
              onClick={() => {
                onRegister()
              }}
            />
          )}
        </div>
        <ChangeLanguage
          langRange={config?.langRange}
          onLangChange={onLangChangeEnhance}
        />
      </div>
    </div>
  )
}
