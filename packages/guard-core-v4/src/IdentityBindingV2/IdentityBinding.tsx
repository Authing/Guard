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
import { getGuardHttp, parsePhone, validate } from '../_utils'
import { IconFont } from '../IconFont'
import phone from 'phone'

const { useMemo, useRef, useCallback } = React

export const GuardIdentityBindingViewV2: React.FC<any> = () => {
  const initData = useGuardInitData<GuardIdentityBindingInitData>()

  const { changeModule } = useGuardModule()

  const { post } = getGuardHttp()

  const config = useGuardFinallyConfig()

  const submitButtonRef = useRef<any>(null)

  useGuardView()

  const { t } = useTranslation()

  const publicConfig = useGuardPublicConfig()

  // 是否开启了国际化短信功能
  const isInternationSms =
    publicConfig?.internationalSmsConfig?.enabled || false

  const methodsConfig = useMemo(() => {
    let holder = []
    let matchFields = []
    if (initData.methods.includes('username-password')) {
      holder.push('用户名')
      matchFields.push(3)
    }
    if (
      initData.methods.some(m => ['phone-password', 'phone-code'].includes(m))
    ) {
      initData.flowType === 'create' && isInternationSms
        ? holder.push(t('common.areaCodePhone'))
        : holder.push(t('common.phoneNumber'))
      matchFields.push(1)
    }
    if (
      initData.methods.some(m => ['email-password', 'email-code'].includes(m))
    ) {
      holder.push(t('common.email'))
      matchFields.push(2)
    }
    return {
      placeholder: holder.length > 0 ? `请输入${holder.join('/')}` : undefined,
      matchFields
    }
  }, [])

  const onNextHandle = useCallback(async values => {
    const { account } = values

    if (initData.flowType === 'create') {
      let type: 'email' | 'phone' = 'phone'
      let _account = account
      let phoneCountryCode: string | undefined = '+86'
      if (validate('email', account)) {
        // 邮箱
        type = 'email'
      } else {
        type = 'phone'
        const { phoneNumber: phone, countryCode } = parsePhone(
          isInternationSms,
          account
        )
        _account = phone
        phoneCountryCode = countryCode
      }
      changeModule?.(GuardModuleType.IDENTITY_BINDING_VERIFCATION, {
        flowType: initData.flowType,
        type,
        account: _account,
        methods: ['code'],
        source: GuardModuleType.IDENTITY_BINDING_ASK,
        phoneCountryCode: phoneCountryCode || '+86',
        backHandle: () => {
          changeModule?.(GuardModuleType.IDENTITY_BINDING_ASK, initData)
        }
      })
    } else {
      const { code, data } = await post('/api/v2/users/check', {
        account,
        matchFields: methodsConfig.matchFields
      })
      // 是否存在账号
      if (code === 200 && data.result !== -1) {
        // 存在
        // 整合绑定的方式
        // result: -1(不存在),1phone,2email,3username, phoneCountryCode
        const { type, methods } = optimizeAuthMethodsTypeSafe(
          data.result,
          initData.methods
        )
        changeModule?.(GuardModuleType.IDENTITY_BINDING_VERIFCATION, {
          flowType: initData.flowType,
          type,
          account: account,
          methods,
          phoneCountryCode: data?.phoneCountryCode || '+86',
          backHandle: () => {
            changeModule?.(GuardModuleType.IDENTITY_BINDING_ASK, initData)
          }
        })
      } else {
        // 不存在
        changeModule?.(GuardModuleType.IDENTITY_BINDING_RESULT, {
          title: '账号不存在',
          actions: [
            {
              title: '重新填写',
              callback: () => {
                changeModule?.(GuardModuleType.IDENTITY_BINDING, {
                  ...initData
                })
              }
            },
            {
              title: '使用其他方式登录',
              callback: () => {
                changeModule?.(GuardModuleType.LOGIN)
              }
            }
          ]
        })
      }
    }
  }, [])

  return (
    <div className="g2-view-container g2-view-identity-binding-v2">
      <BackCustom onBack={() => initData?.backHandle?.()}>
        {t('common.back')}
      </BackCustom>

      <div className="g2-view-identity-binding-content">
        <div className="g2-view-identity-binding-content-logo">
          <img src={config?.logo} alt="" className="logo" />
        </div>
        <div className="g2-view-identity-binding-content-title">
          <span>
            {initData.flowType === 'create' ? '创建新账号' : '绑定已有账号'}
          </span>
        </div>
        <div className="g2-view-identity-binding-content-desc">
          <span>{'请跟随步骤完成账号绑定,完善您的账号信息'}</span>
        </div>

        <Form
          layout="vertical"
          name="verify-account"
          onFinish={onNextHandle}
          onFinishFailed={() => submitButtonRef.current.onError()}
          autoComplete="off"
          className="authing-g2-form-required-item-icon-after"
        >
          <Form.Item
            name="account"
            validateTrigger={['onBlur', 'onChange']}
            validateFirst={true}
            rules={[
              {
                required: true,
                message: '账号未填写',
                validateTrigger: 'onChange',
                whitespace: true
              },
              {
                validateTrigger: 'onBlur',
                validator: async (_: any, value: any) => {
                  if (
                    !value ||
                    initData.flowType !== 'create' ||
                    validate('email', value) ||
                    !isInternationSms
                  ) {
                    return Promise.resolve()
                  }
                  if (
                    phone(value).isValid ||
                    phone(value, {
                      country:
                        publicConfig.internationalSmsConfig?.defaultISOType
                    })
                  )
                    return Promise.resolve()
                  return Promise.reject(t('common.i18nCheckErrorMessage'))
                }
              }
            ]}
            className="authing-g2-input-form"
          >
            <Input
              type="text"
              size="large"
              className="authing-g2-input"
              autoComplete="off"
              placeholder={methodsConfig.placeholder}
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
