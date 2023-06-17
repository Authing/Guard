import { React } from 'shim-react'

import { useTranslation } from 'react-i18next'

import { useAsyncFn } from 'react-use'

import { GuardModuleType } from '../Guard/module'

import { BackLogin } from '../Back'

import { useGuardAuthClient } from '../Guard/authClient'

import { GuardButton } from '../GuardButton'

import { IconFont } from '../IconFont'

import { IdentityBindingAction } from '../IdentityBinding/businessRequest'

import {
  useGuardEvents,
  useGuardInitData,
  useGuardModule
} from '../_utils/context'

import { useGuardHttp } from '../_utils/guardHttp'

import { GuardIdentityBindingAskInitData } from './interface'

import './styles.less'

import { useGuardView } from '../Guard/core/hooks/useGuardView'

export const GuardIdentityBindingAskView: React.FC = () => {
  const initData = useGuardInitData<GuardIdentityBindingAskInitData>()

  const { changeModule } = useGuardModule()

  useGuardView()

  const { t } = useTranslation()

  const { authFlow } = useGuardHttp()

  const authClient = useGuardAuthClient()

  const events = useGuardEvents()

  const onCreate = (data: any) => {
    events?.onLogin?.(data, authClient)

    events?.onCreate?.(data, authClient)
  }

  const onCreateError = (code: any, data: any, message?: string) => {
    events?.onCreateError?.({
      code,
      data,
      message
    })
    events?.onLoginError?.({
      code,
      data,
      message
    })
  }

  const [createLoading, createAccount] = useAsyncFn(async () => {
    const { code, onGuardHandling, data, isFlowEnd, message } = await authFlow(
      IdentityBindingAction.CreateUser
    )

    if (isFlowEnd) {
      onCreate(data)
    } else {
      onCreateError(code, data, message)

      onGuardHandling?.()
    }
  }, [])

  const bindingAccount = () => {
    changeModule?.(GuardModuleType.IDENTITY_BINDING, {
      ...initData,
      source: GuardModuleType.IDENTITY_BINDING_ASK
    })
  }

  return (
    <div className="g2-view-container g2-view-identity-binding-ask">
      <BackLogin />

      <div className="g2-view-identity-binding-ask-content">
        <div className="g2-view-identity-binding-ask-content-title">
          <span>{t('common.identityBindingAskTitle')}</span>
        </div>
        <div className="g2-view-identity-binding-ask-content-desc">
          <span>{t('common.identityBindingAskDesc')}</span>
        </div>
        <div className="g2-view-identity-binding-ask-content-img">
          <IconFont type="authing-bind" />
        </div>
        <div className="g2-view-identity-binding-ask-content-button-group">
          <GuardButton
            className=" g2-view-identity-binding-ask-content-button g2-view-identity-binding-ask-content-button-binding authing-g2-submit-button"
            onClick={bindingAccount}
            type="primary"
          >
            {t('common.identityBindingBinding')}
          </GuardButton>
          <GuardButton
            className="g2-view-identity-binding-ask-content-button g2-view-identity-binding-ask-content-button-create"
            loading={createLoading.loading}
            onClick={createAccount}
            type="link"
          >
            {t('common.identityBindingCreate')}
          </GuardButton>
        </div>
      </div>
    </div>
  )
}
