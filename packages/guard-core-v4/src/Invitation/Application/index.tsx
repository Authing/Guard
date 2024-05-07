import { React } from 'shim-react'
import {
  useGuardEvents,
  useGuardFinallyConfig,
  useGuardHttpClient,
  useGuardInitData,
  useGuardModule,
  useGuardPublicConfig
} from '../../_utils/context'
import {
  Form,
  Input,
  Select,
  DatePicker,
  message,
  notification
} from 'shim-antd'

import { ChangeLanguage } from '../../ChangeLanguage'
import SubmitButton from '../../SubmitButton'
import { useTranslation } from 'react-i18next'
import CustomFormItem from '../../ValidatorRules'
import { InputInternationPhone } from '../../Login/core/withVerifyCode/InputInternationPhone'
import { InputNumber } from '../../InputNumber'
import { IconFont } from '../../IconFont'
import { useMediaSize } from '../../_utils/hooks'
import './style.less'
import { fieldRequiredRule, i18n, useGuardHttp } from '../../_utils'
import { SendCodeByEmail } from '../../SendCode/SendCodeByEmail'
import { EmailScene } from '../../Type'
import { GuardModuleType } from '../../Guard'

const { useRef, useState, useCallback, useEffect } = React

export const GuardApplicationView = () => {
  const { t } = useTranslation()

  const config = useGuardFinallyConfig()
  const events = useGuardEvents()
  const initData = useGuardInitData<{
    identifier: string
    inviter: any
    userPool: any
  }>()

  const { changeModule } = useGuardModule()

  const publicConfig = useGuardPublicConfig()

  const { get, post } = useGuardHttp()

  const [form] = Form.useForm()

  let submitButtonRef = useRef<any>(null)

  const verifyCodeLength = publicConfig?.verifyCodeLength

  // const [inviter, setInviter] = useState('')

  // const getConfig = useCallback(async () => {
  //   const { data } = await get(
  //     `/api/v3/get-universal-invitation-public-config?identifier=${initData?.identifier}`
  //   )
  //   setInviter(data.inviter.displayName)
  // }, [initData])

  // useEffect(() => {
  //   getConfig()
  // }, [getConfig])

  const onFinishHandle = async () => {
    try {
      submitButtonRef.current?.onSpin(true)
      const {
        statusCode,
        message: msg,
        data
      } = await post('/api/v3/signup-by-invitation', {
        ...form.getFieldsValue(),
        identifier: initData?.identifier,
        profile: {
          ...form.getFieldsValue()
        }
      })
      if (statusCode !== 200) {
        message.error(msg)
      } else {
        changeModule?.(GuardModuleType.MESSAGE, {
          message:
            data.status === 'PENDING'
              ? t('common.pendingMsg', [config.title])
              : t('common.doneMsg')
        })
      }
    } catch (error) {
    } finally {
      submitButtonRef.current?.onSpin(false)
    }
  }

  return (
    <div className="g2-view-container g2-view-invitation-apply">
      <div className="g2-view-container-inner">
        <div className="g2-view-header">
          <img src={initData?.userPool?.logo} alt="" className="icon" />
          <div className="g2-view-header-container">
            <div className="invitation-welcome">
              {initData?.inviter?.displayName} {t('common.welcomeJoin')}
            </div>
            <div className="title">{initData?.userPool?.name}</div>
          </div>
        </div>

        <div className="g2-view-content">
          <Form
            layout="vertical"
            name="et-pre-check-email"
            onFinish={onFinishHandle}
            onFinishFailed={() => submitButtonRef.current.onError()}
            autoComplete="off"
            form={form}
            className="authing-g2-form-required-item-icon-after"
            // onValuesChange={formValuesChange}
          >
            <Form.Item
              name="name"
              label={t('common.name')}
              rules={[{ required: true }]}
              className="authing-g2-input-form"
            >
              <Input
                type="text"
                size="large"
                className="authing-g2-input"
                autoComplete="off"
              />
            </Form.Item>
            <CustomFormItem.Email
              className="authing-g2-input-form"
              name="email"
              checkRepeat={true}
              label={i18n.t('common.email')}
              key="internal email:email13"
              validateFirst={true}
              required
            >
              <Input
                className="authing-g2-input"
                autoComplete="email"
                size="large"
                placeholder={t('login.inputEmail') as string}
              />
            </CustomFormItem.Email>
            <Form.Item
              validateTrigger={['onBlur', 'onChange']}
              className="authing-g2-input-form"
              name="emailCode"
              key="internal email:code1432"
              rules={fieldRequiredRule(t('common.captchaCode'))}
            >
              <SendCodeByEmail
                className="authing-g2-input g2-send-code-input"
                autoComplete="one-time-code"
                size="large"
                placeholder={
                  t('common.inputFourVerifyCode', {
                    length: verifyCodeLength
                  }) as string
                }
                maxLength={verifyCodeLength}
                data={''}
                scene={EmailScene.VERIFY_CODE}
                fieldName="email"
                form={form}
                onSendCodeBefore={() => form.validateFields(['email'])}
              />
            </Form.Item>
            <Form.Item className="authing-g2-sumbit-form">
              <SubmitButton
                text={t('common.applyJoin') as string}
                className="password"
                ref={submitButtonRef}
              />
            </Form.Item>
          </Form>
        </div>
        <ChangeLanguage
          langRange={config?.langRange}
          onLangChange={events?.onLangChange}
        />
      </div>
    </div>
  )
}
