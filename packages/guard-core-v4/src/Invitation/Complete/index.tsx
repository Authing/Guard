import { React } from 'shim-react'
import { useTranslation } from 'react-i18next'
import { ChangeLanguage } from '../../ChangeLanguage'
import { CompleteInfo } from '../../CompleteInfo/core/completeInfo'
import { CompleteInfoRequest } from '../../CompleteInfo/interface'
import { fieldValuesToRegisterProfile } from '../../CompleteInfo/utils'
import {
  useGuardEvents,
  useGuardFinallyConfig,
  useGuardInitData,
  useGuardModule
} from '../../_utils/context'
import { BackCustom } from '../../Back'
import {
  GuardInviteCompleteInitData,
  useRegisterHandleHook
} from '../interface'
import './style.less'

export const GuardInviteCompleteView = () => {
  const initData = useGuardInitData<GuardInviteCompleteInitData>()

  const config = useGuardFinallyConfig()

  const events = useGuardEvents()

  const { t } = useTranslation()
  const {
    metaData,
    extendsFieldsI18n,
    // enabledExtIdpBind,
    // qrCodeBindMethods,
    extendsFields,
    canBack = true,
    registerInfoFillMsg
  } = initData

  const { changeModule } = useGuardModule()

  const onRegisterHandle = useRegisterHandleHook(initData)

  const nextStepHandle = async (data: CompleteInfoRequest) => {
    const { fieldValues } = data

    // const wecomQrs =
    //   qrCodeBindMethods?.['wechatwork-service-provider-qrconnect'] || []
    // const wecomNewQrs =
    //   qrCodeBindMethods?.['wechatwork-service-provider-qrconnect-v2'] || []

    const { registerProfile, udf } = fieldValuesToRegisterProfile(
      extendsFields!,
      fieldValues
    )

    let phonePassCodeForInformationCompletion = null
    let emailPassCodeForInformationCompletion = null
    if (Reflect.has(registerProfile, 'phoneToken')) {
      phonePassCodeForInformationCompletion = registerProfile.phoneToken
      Reflect.deleteProperty(registerProfile, 'phoneToken')
    }
    if (Reflect.has(registerProfile, 'emailToken')) {
      emailPassCodeForInformationCompletion = registerProfile.emailToken
      Reflect.deleteProperty(registerProfile, 'emailToken')
    }

    const complete = {
      profile: {
        ...registerProfile,
        customData: udf
        // 扩展字段
      },
      options: {
        phonePassCodeForInformationCompletion,
        emailPassCodeForInformationCompletion
      }
    }
    const context = {
      ...initData.context,
      ...complete
    }

    //   todo 携带补全数据 判断走后续身份源绑定 还是直接注册
    // await businessRequest?.(CompleteInfoAuthFlowAction.Complete, data)
    //   todo 携带当前 metadata 跳转到身份源绑定页 以便回来后数据回显
    // if (enabledExtIdpBind && wecomQrs.length > 0) {
    //   changeModule?.(GuardModuleType.EY_IDENTITY_BIND, {
    //     ...initData,
    //     originModule: GuardModuleType.EY_INVITE_COMPLETE,
    //     originContext: initData,
    //     weComConfig: wecomQrs[0],
    //     context,
    //   })
    // } else if (enabledExtIdpBind && wecomNewQrs.length > 0) {
    //   changeModule?.(GuardModuleType.EY_IDENTITY_BIND, {
    //     ...initData,
    //     originModule: GuardModuleType.EY_INVITE_COMPLETE,
    //     originContext: initData,
    //     weComConfig: wecomNewQrs[0],
    //     isNew: true,
    //     context,
    //   })
    // } else {
    // 直接注册登录
    await onRegisterHandle?.(context)
    // }
  }

  return (
    <div className="g2-view-container g2-complete-info g2-invitation-complete">
      <div className="g2-view-header">
        {canBack && initData?.originModule && (
          <BackCustom
            onBack={() => {
              initData?.originModule &&
                changeModule?.(initData.originModule, initData.originContext)
            }}
          >
            {t('common.back')}
          </BackCustom>
        )}
        <div className="content">
          <div className="title">{t('common.invitation.completeInfo')}</div>
          <div className="title-explain">
            {registerInfoFillMsg
              ? registerInfoFillMsg
              : t('common.invitation.completeInfoDesc')}
          </div>
        </div>
      </div>
      <div className="g2-view-tabs g2-completeInfo-content">
        <CompleteInfo
          extendsFieldsI18n={extendsFieldsI18n}
          // submitText={t('login.nextStep')}
          metaData={metaData}
          businessRequest={nextStepHandle}
        />
      </div>
      <ChangeLanguage
        langRange={config?.langRange}
        onLangChange={events?.onLangChange}
      />
    </div>
  )
}
