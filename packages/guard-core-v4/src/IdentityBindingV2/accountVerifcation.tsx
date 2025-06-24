import { Form, Input, Tabs, message } from 'shim-antd'

import { React } from 'shim-react'

import { useTranslation } from 'react-i18next'

import { GuardModuleType } from '../Guard'

import { BackCustom, BackLogin } from '../Back'

import {
  useGuardFinallyConfig,
  useGuardInitData,
  useGuardModule,
  useGuardPublicConfig
} from '../_utils/context'

import { GuardIdentityAccountVerificationInitData } from './interface'

import './styles.less'

import { useGuardView } from '../Guard/core/hooks/useGuardView'
import SubmitButton from '../SubmitButton'
import {
  fieldRequiredRule,
  getGuardHttp,
  mailDesensitization,
  phoneDesensitization
} from '../_utils'
import { VerifyCodeFormItem } from '../MFA/VerifyCodeInput/VerifyCodeFormItem'
import { VerifyCodeInput } from '../MFA/VerifyCodeInput'
import { SendCodeBtn } from '../SendCode/SendCodeBtn'
import { useGuardAuthClient } from '../Guard/authClient'
import { useEffectOnce } from 'react-use'
import { InputPassword } from '../InputPassword'
import { IconFont } from '../IconFont'
import { SendCodeByPhone } from '../SendCode/SendCodeByPhone'
import { EmailScene, SceneType } from 'authing-js-sdk'
import { SendCodeByEmail } from '../SendCode/SendCodeByEmail'

const { useMemo, useRef, useCallback, useState } = React

// 提取常量

const TAB_CONFIG = {
  code: { key: 'code', tab: '验证码' },
  password: { key: 'password', tab: '密码' }
}

/**
 * @description 用户身份源绑定已有账号流程中验证账号的视图 不建议向外暴露使用
 */
export const GuardIdentityAccountVerifcation: React.FC<any> = () => {
  const initData = useGuardInitData<GuardIdentityAccountVerificationInitData>()

  const { post } = getGuardHttp()

  const config = useGuardFinallyConfig()

  const { backModule, changeModule } = useGuardModule()

  const [form] = Form.useForm()

  const submitButtonRef = useRef<any>(null)

  const sendCodeRef = useRef<HTMLButtonElement>(null)

  const authClient = useGuardAuthClient()

  useGuardView()

  const { t } = useTranslation()

  const publicConfig = useGuardPublicConfig()

  const codeLength = publicConfig?.verifyCodeLength || 4

  // 是否开启了国际化短信功能
  const isInternationSms =
    publicConfig?.internationalSmsConfig?.enabled || false

  const [sent, setSent] = useState<boolean>(false)

  const renderBack = useMemo(() => {
    if (initData.source === GuardModuleType.IDENTITY_BINDING_ASK)
      return (
        <BackCustom onBack={() => backModule?.()}>
          {t('common.back')}
        </BackCustom>
      )

    return <BackLogin />
  }, [backModule, initData.source, t])

  const sendVerifyCode = async () => {
    try {
      if (initData.type === 'email') {
        const {
          code,
          message: tips,
          apiCode
        } = await post('/api/v2/email/send', {
          email: initData.account,
          scene: EmailScene.MFA_VERIFY_CODE
        })
        if (apiCode === 2080) {
          // 一分钟只能发一次邮箱验证码的提示信息，特殊处理
          message.error(tips)
          return false
        }
        if (code === 200) {
          setSent(true)
          return true
        } else {
          message.error(t('login.sendCodeTimeout'))
          return false
        }
      } else {
        await authClient.sendSmsCode(
          initData.account,
          initData.phoneCountryCode,
          SceneType.SCENE_TYPE_MFA_VERIFY
        )
        return true
      }
    } catch (e: any) {
      if (e.code === 'ECONNABORTED') {
        message.error(t('login.sendCodeTimeout'))
        return false
      }
      try {
        const errorMessage = JSON.parse(e.message)
        message.error(errorMessage.message)
      } catch (_) {
        message.error(e)
      }
      return false
    }
  }

  const onFinish = useCallback(async values => {
    changeModule?.(GuardModuleType.IDENTITY_BINDING_RESULT, {
      title: '手机号不存在',
      desc: '请再次确认您的手机号码,您可以',
      actions: [
        {
          title: '重新填写',
          callback: () => {
            changeModule?.(GuardModuleType.IDENTITY_BINDING_VERIFCATION, {
              ...initData
            })
          }
        },
        {
          title: '创建新账号',
          callback: () => {
            changeModule?.(GuardModuleType.IDENTITY_BINDING_VERIFCATION, {
              ...initData
            })
          }
        }
      ]
    })
    // const res = await post('/api/v2/users/check', values)
    // 是否存在账号
    // if (res.code === 200) {
    //   // 存在
    // } else {
    //   // 不存在
    // }
  }, [])

  useEffectOnce(() => {
    sendCodeRef.current?.click()
  })

  const FORM_CONFIG = useMemo(() => {
    return {
      onFinishFailed: (submitButtonRef: any) => () =>
        submitButtonRef.current?.onError(),
      validateTrigger: ['onBlur', 'onChange'],
      className: 'authing-g2-input-form',
      submitButtonProps: {
        text: initData.flowType === 'create' ? '确认' : '确认绑定',
        className: 'g2-mfa-submit-button'
      },
      title: initData.flowType === 'create' ? '创建新账号' : '绑定已有账号'
    }
  }, [])
  // 提取通用表单配置
  const commonFormProps = useMemo(
    () => ({
      onFinish,
      onFinishFailed: FORM_CONFIG.onFinishFailed(submitButtonRef)
    }),
    [onFinish]
  )

  //  渲染验证码组件
  const SendCode = useCallback(
    (props: any) => {
      return (
        <>
          {initData.type === 'phone' && (
            <SendCodeByPhone
              {...props}
              isInternationSms={isInternationSms}
              className="authing-g2-input g2-send-code-input"
              autoComplete="off"
              size="large"
              placeholder={t('common.inputFourVerifyCode', {
                length: codeLength
              })}
              areaCode={'+86'}
              prefix={
                <IconFont
                  type="authing-a-shield-check-line1"
                  style={{ color: '#878A95' }}
                />
              }
              scene={SceneType.SCENE_TYPE_LOGIN}
              maxLength={codeLength}
              form={form}
              fieldName={'identify'}
              data={'182962678'}
              codeFieldName={'captchaCode'}
              onSendCodeBefore={async () => {
                await form.validateFields(['captchaCode'])
              }}
            />
          )}
          {initData.type === 'email' && (
            <SendCodeByEmail
              {...props}
              className="authing-g2-input g2-send-code-input"
              autoComplete="off"
              size="large"
              placeholder={t('common.inputFourVerifyCode', {
                length: codeLength
              })}
              prefix={
                <IconFont
                  type="authing-a-shield-check-line1"
                  style={{ color: '#878A95' }}
                />
              }
              form={form}
              data={'1111'}
              scene={EmailScene.LOGIN_VERIFY_CODE}
              maxLength={codeLength}
              onSendCodeBefore={async () => {
                await form.validateFields(['identify'])
              }}
            />
          )}
        </>
      )
    },
    [form, isInternationSms, t, codeLength]
  )

  // 渲染验证码表单
  const renderCodeForm = useCallback(
    () => (
      <Form {...commonFormProps}>
        <Form.Item
          validateTrigger={FORM_CONFIG.validateTrigger}
          className={FORM_CONFIG.className}
          name="code"
          rules={[...fieldRequiredRule(t('common.captchaCode'))]}
        >
          <SendCode />
        </Form.Item>
        <SubmitButton
          {...FORM_CONFIG.submitButtonProps}
          ref={submitButtonRef}
        />
      </Form>
    ),
    [commonFormProps, SendCode, submitButtonRef, t]
  )

  // 渲染密码表单
  const renderPasswordForm = useCallback(
    () => (
      <>
        <Form {...commonFormProps}>
          <Form.Item
            validateTrigger={FORM_CONFIG.validateTrigger}
            className={FORM_CONFIG.className}
            name="password"
            rules={fieldRequiredRule(t('common.password'))}
          >
            <InputPassword
              autoComplete="off"
              className="authing-g2-input"
              size="large"
              placeholder={t('login.inputPwd')}
              prefix={
                <IconFont
                  type="authing-a-lock-line1"
                  style={{ color: '#878A95' }}
                />
              }
            />
          </Form.Item>
          <SubmitButton
            {...FORM_CONFIG.submitButtonProps}
            ref={submitButtonRef}
          />
        </Form>
      </>
    ),
    [commonFormProps, submitButtonRef, t]
  )
  const renderPasswordFormBySingle = useCallback(
    () => (
      <>
        <div className="g2-view-identity-binding-v2-header">
          <div className="g2-view-identity-binding-content-logo">
            <img src={config?.logo} alt="" className="logo" />
          </div>
          <div className="g2-view-identity-binding-content-desc">
            <span>{'请跟随步骤完成账号绑定'}</span>
          </div>
          <div className="g2-view-identity-binding-content-title">
            <span>{FORM_CONFIG.title}</span>
          </div>
        </div>
        <div className="g2-identity-binding-verifcation-content">
          {renderPasswordForm()}
        </div>
      </>
    ),
    [commonFormProps, submitButtonRef, t]
  )

  const renderTips = useCallback(
    type => {
      const smsTips = `${
        isInternationSms ? initData?.phoneCountryCode : ''
      } ${phoneDesensitization(initData.account)}`

      const emailTips = mailDesensitization(initData.account)
      return sent
        ? `${t('login.verifyCodeSended')} ${
            type === 'phone' ? smsTips : emailTips
          }`
        : t('common.SmsMfaCheck')
    },
    [isInternationSms, sent, t, initData]
  )
  // 渲染验证码输入表单（单独的验证码组件）
  const renderVerifyCodeForm = useCallback(
    type => (
      <>
        <div className="g2-view-identity-binding-v2-header">
          <h3 className="authing-g2-mfa-title">{FORM_CONFIG.title}</h3>
          <p className="authing-g2-mfa-tips">{renderTips(type)}</p>
        </div>
        <div className="g2-identity-binding-verifcation-content">
          <Form {...commonFormProps}>
            <VerifyCodeFormItem
              codeLength={codeLength}
              ruleKeyword={t('common.captchaCode') as string}
            >
              <VerifyCodeInput length={codeLength} onFinish={onFinish} />
            </VerifyCodeFormItem>

            <SendCodeBtn
              btnRef={sendCodeRef}
              beforeSend={() => sendVerifyCode()}
              type="link"
              setSent={setSent}
            />

            <SubmitButton
              {...FORM_CONFIG.submitButtonProps}
              ref={submitButtonRef}
            />
          </Form>
        </div>
      </>
    ),
    [
      commonFormProps,
      codeLength,
      onFinish,
      sendCodeRef,
      sendVerifyCode,
      setSent,
      submitButtonRef,
      t
    ]
  )

  // 渲染标签页
  const renderTabs = useCallback(
    () => (
      <>
        <div className="g2-view-identity-binding-v2-header">
          <div className="g2-view-identity-binding-content-logo">
            <img src={config?.logo} alt="" className="logo" />
          </div>
          <div className="g2-view-identity-binding-content-desc">
            <span>{'请跟随步骤完成账号绑定'}</span>
          </div>
          <div className="g2-view-identity-binding-content-title">
            <span>{'绑定已有账号'}</span>
          </div>
        </div>
        <div className="g2-identity-binding-verifcation-content">
          <Tabs destroyInactiveTabPane={true}>
            <Tabs.TabPane {...TAB_CONFIG.code}>{renderCodeForm()}</Tabs.TabPane>
            <Tabs.TabPane {...TAB_CONFIG.password}>
              {renderPasswordForm()}
            </Tabs.TabPane>
          </Tabs>
        </div>
      </>
    ),
    [renderCodeForm, renderPasswordForm]
  )

  //主渲染逻辑
  const renderView = useCallback(() => {
    const { methods, type } = initData
    const hasMultipleMethods = methods.length > 1
    const hasPassword = methods.includes('password')
    const hasCode = methods.includes('code')

    // 多种验证方式 - 显示标签页
    if (hasMultipleMethods) {
      return renderTabs()
    }

    // 单一验证方式
    if (hasPassword) {
      return renderPasswordFormBySingle()
    }

    if (hasCode) {
      return renderVerifyCodeForm(type)
    }

    // 默认情况或无匹配方法
    return null
  }, [initData.methods, renderTabs, renderPasswordForm, renderVerifyCodeForm])

  return (
    <div className="g2-view-container g2-view-identity-binding-v2">
      {renderBack}
      <div className="g2-view-identity-binding-content">{renderView()}</div>
    </div>
  )
}
