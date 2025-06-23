import { Form, Input, Tabs } from 'shim-antd'

import { React } from 'shim-react'

import { useTranslation } from 'react-i18next'

import { GuardModuleType } from '../Guard'

import { BackCustom, BackLogin } from '../Back'

import { useGuardAuthClient } from '../Guard/authClient'

import { LoginWithPassword } from '../Login/core/withPassword'

import { LoginWithVerifyCode } from '../Login/core/withVerifyCode'

import { PasswordLoginMethods } from '../Type/application'

import {
  useGuardButtonState,
  useGuardEvents,
  useGuardFinallyConfig,
  useGuardInitData,
  useGuardModule,
  useGuardPublicConfig
} from '../_utils/context'

import { fallbackLng, i18n } from '../_utils/locales'

import {
  IdentityBindingBusinessAction,
  useIdentityBindingBusinessRequest
} from './businessRequest'

import {
  GuardIdentityBindingInitData,
  optimizeAuthMethodsTypeSafe
} from './interface'

import './styles.less'

import { useGuardView } from '../Guard/core/hooks/useGuardView'
import SubmitButton from '../SubmitButton'
import { getGuardHttp } from '../_utils'
import { IconFont } from '../IconFont'

const { useMemo, useRef, useCallback } = React

export const GuardIdentityBindingViewV2: React.FC<any> = () => {
  const initData = useGuardInitData<GuardIdentityBindingInitData>()

  const { changeModule } = useGuardModule()

  const { post } = getGuardHttp()

  const config = useGuardFinallyConfig()

  const { backModule } = useGuardModule()

  const submitButtonRef = useRef<any>(null)

  useGuardView()

  const { t } = useTranslation()

  const publicConfig = useGuardPublicConfig()

  const renderBack = useMemo(() => {
    if (initData.source === GuardModuleType.IDENTITY_BINDING_ASK)
      return (
        <BackCustom onBack={() => backModule?.()}>
          {t('common.back')}
        </BackCustom>
      )

    return <BackLogin />
  }, [backModule, initData.source, t])

  const placeholder = useMemo(() => {
    let holder = []
    if (initData.methods.includes('username-password')) {
      holder.push('用户名')
    }
    if (
      initData.methods.some(m => ['phone-password', 'phone-code'].includes(m))
    ) {
      holder.push('手机号')
    }
    if (
      initData.methods.some(m => ['email-password', 'email-code'].includes(m))
    ) {
      holder.push('邮箱')
    }
    return holder.length > 0 ? `请输入${holder.join('/')}` : undefined
  }, [])

  const onNextHandle = useCallback(async values => {
    console.log(values, 'onFinish')
    const { account } = values
    const { code, data } = await post('/api/v2/users/check', {
      account
    })
    // 是否存在账号
    if (code === 200 && data.result !== -1) {
      // 存在
      // 整合绑定的方式
      // result: -1(不存在),1phone,2email,3username, phoneCountryCode
      const res = optimizeAuthMethodsTypeSafe(data.result, initData.methods)
      console.log(res, 'res')
    } else {
      // 不存在
      changeModule?.(GuardModuleType.IDENTITY_BINDING_VERIFCATION, {
        type: 'phone',
        account: account,
        methods: ['password'],
        source: GuardModuleType.IDENTITY_BINDING_ASK,
        phoneCountryCode: data?.phoneCountryCode || '+86'
      })
    }
  }, [])

  return (
    <div className="g2-view-container g2-view-identity-binding-v2">
      {renderBack}

      <div className="g2-view-identity-binding-content">
        <div className="g2-view-identity-binding-content-logo">
          <img src={config?.logo} alt="" className="logo" />
        </div>
        <div className="g2-view-identity-binding-content-title">
          <span>{'绑定已有账号'}</span>
        </div>
        <div className="g2-view-identity-binding-content-desc">
          <span>{'请跟随步骤完成账号绑定'}</span>
        </div>

        <Form
          layout="vertical"
          name="verify-account"
          onFinish={onNextHandle}
          onFinishFailed={() => submitButtonRef.current.onError()}
          autoComplete="off"
          // form={form}
          className="authing-g2-form-required-item-icon-after"
          // onValuesChange={formValuesChange}
        >
          <Form.Item
            name="account"
            rules={[{ required: true, message: '账号未填写' }]}
            className="authing-g2-input-form"
          >
            <Input
              type="text"
              size="large"
              className="authing-g2-input"
              autoComplete="off"
              placeholder={placeholder}
              prefix={
                <IconFont
                  type="authing-a-user-line1"
                  style={{ color: '#878A95' }}
                />
              }
            />
          </Form.Item>

          <Form.Item className="authing-g2-sumbit-form">
            <SubmitButton
              text={'下一步' as string}
              className="password"
              ref={submitButtonRef}
            />
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
