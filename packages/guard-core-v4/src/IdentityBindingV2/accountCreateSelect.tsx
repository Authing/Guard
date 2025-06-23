import { useTranslation } from 'react-i18next'
import { React } from 'shim-react'
import { BackCustom, BackLogin } from '../Back'
import { GuardModuleType } from '../Guard'
import {
  phoneDesensitization,
  useGuardFinallyConfig,
  useGuardInitData,
  useGuardModule
} from '../_utils'
import { GuardButton } from '../GuardButton'
import './styles.less'

const { useMemo } = React
/**
 *
 * @description 用户身份源询问绑定选择创建账号时 用户用于选择创建方式的选择页
 */
export const GuardIdentityAccountCreateSelect = () => {
  const initData = useGuardInitData<any>()

  const { t } = useTranslation()

  const config = useGuardFinallyConfig()

  const { backModule, changeModule } = useGuardModule()

  const renderBack = useMemo(() => {
    if (initData.source === GuardModuleType.IDENTITY_BINDING_ASK)
      return (
        <BackCustom onBack={() => backModule?.()}>
          {t('common.back')}
        </BackCustom>
      )

    return <BackLogin />
  }, [backModule, initData.source, t])

  return (
    <div className="g2-view-identity-binding-v2 g2-view-container">
      {renderBack}
      <div className="g2-view-identity-binding-content">
        <div className="g2-view-identity-binding-v2-header">
          <div className="g2-view-identity-binding-content-logo">
            <img src={config?.logo} alt="" className="logo" />
          </div>
          <div className="g2-view-identity-binding-content-title">
            <span>{'使用当前手机号创建？'}</span>
          </div>
          <div className="g2-view-identity-binding-content-desc">
            <span>{`已获取到您的手机号为 ${phoneDesensitization(
              initData.account
            )}`}</span>
          </div>
        </div>

        <div className="g2-view-identity-binding-account-select-button-group">
          <GuardButton
            type="primary"
            className="authing-g2-submit-button"
            onClick={() => {
              changeModule?.(GuardModuleType.IDENTITY_BINDING_VERIFCATION, {
                flowType: 'create',
                type: initData.type,
                account: initData.account,
                methods: ['code'],
                source: GuardModuleType.IDENTITY_BINDING_ASK,
                phoneCountryCode: '+86'
              })
            }}
          >
            {'使用当前账号'}
          </GuardButton>
          <GuardButton
            className="authing-g2-ghost-button"
            onClick={() => {
              changeModule?.(GuardModuleType.IDENTITY_BINDING, {
                flowType: 'create',
                methods: ['phone-code', 'email-code'],
                source: GuardModuleType.IDENTITY_BINDING_ASK
              })
            }}
          >
            {'不，我要使用其他账号'}
          </GuardButton>
          <GuardButton
            className="authing-g2-ghost-button"
            onClick={() => {
              changeModule?.(GuardModuleType.IDENTITY_BINDING, {
                ...initData,
                source: GuardModuleType.IDENTITY_BINDING_ASK
              })
            }}
          >
            {'直接创建'}
          </GuardButton>
        </div>
      </div>
    </div>
  )
}
