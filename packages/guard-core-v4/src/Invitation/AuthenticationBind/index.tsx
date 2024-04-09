import { Form } from 'shim-antd'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGuardView } from '../..'
import { ChangeLanguage } from '../../ChangeLanguage'
import { extendsFieldsToMetaData } from '../../CompleteInfo/utils'
import { GuardModuleType } from '../../Guard'
import { VerifyCodeInput } from '../../MFA/VerifyCodeInput'
import { VerifyCodeFormItem } from '../../MFA/VerifyCodeInput/VerifyCodeFormItem'
import { SendCodeBtn } from '../../SendCode/SendCodeBtn'
import SubmitButton from '../../SubmitButton'
import { mailDesensitization, phoneDesensitization } from '../../_utils'
import {
  useGuardEvents,
  useGuardFinallyConfig,
  useGuardHttpClient,
  useGuardInitData,
  useGuardModule
} from '../../_utils/context'
import { InviteContext, useRegisterHandleHook } from '../interface'
import './style.less'

export const GuardAuthenticationView = () => {
  const initData = useGuardInitData<InviteContext>()

  const events = useGuardEvents()

  const config = useGuardFinallyConfig()

  const { t } = useTranslation()

  const verifyCodeRef = useRef<any>(null)

  useGuardView()

  const { changeModule } = useGuardModule()

  const { post } = useGuardHttpClient()

  const [form] = Form.useForm()

  const submitButtonRef = useRef<any>(null)

  const [disabled, setDisabled] = useState<boolean>(true)

  const [verifyType, setVerifyType] = useState<'emailCode' | 'phoneCode'>(
    initData.receiverType
  )

  const verifyAccount = useMemo(() => {
    if (verifyType === 'emailCode') {
      return initData.email
    } else if (verifyType === 'phoneCode') {
      return initData.phone
    }
  }, [initData.email, initData.phone, verifyType])

  const descConstants: any = useMemo(() => {
    const constants = {
      prioritySMS: {
        emailCode: {
          desc: t('common.ey.sendSms'),
          show: initData.phone,
          receiverType: 'phoneCode'
        },
        phoneCode: {
          desc: t('common.ey.sendEmail'),
          show: initData.email,
          receiverType: 'emailCode'
        }
      },
      priorityEmail: {
        emailCode: {
          desc: t('common.ey.sendSms'),
          show: initData.phone,
          receiverType: 'phoneCode'
        },
        phoneCode: {
          desc: t('common.ey.sendEmail'),
          show: initData.email,
          receiverType: 'emailCode'
        }
      },
      SMS: {
        show: false
      },
      email: {
        show: false
      }
    }
    const codeMethod = initData.sendIdentifierCodeMethod
    if (['prioritySMS', 'priorityEmail'].some(type => codeMethod === type)) {
      return {
        ...(constants[codeMethod] as any)[verifyType]
      }
    }
    return constants[codeMethod]
  }, [initData, t, verifyType])

  const reSendVerifyCode = useCallback(
    async params => await post('/api/v3/resend-verification', params),
    [post]
  )

  const onRegisterHandle = useRegisterHandleHook(initData, submitButtonRef)

  const onFinishHandle = async (formValues: any) => {
    const captcha = formValues.code.join('')

    const res = await post('/api/v3/verify-invite-code', {
      code: captcha,
      receiverType: verifyType,
      ticket: initData.ticket
    })

    const { statusCode, data, onGuardHandling } = res
    if (statusCode === 200) {
      const {
        extendsFields = [],
        extendsFieldsOptions = [],
        enabledRegisterFillInfo,
        enabledExtIdpBind,
        qrCodeBindMethods
      } = data

      const context = {
        code: captcha,
        ticket: initData.ticket,
        receiverType: verifyType
      }

      // 开启补全
      const needCompleteData = extendsFields?.filter(
        (field: { name: string; type: string }) => {
          if (field.name === 'email' && field.type === 'internal') {
            return !initData.email
          }
          if (field.name === 'phone' && field.type === 'internal') {
            return !initData.phone
          }
          if (field.name === 'username' && field.type === 'internal') {
            return !initData.username
          }
          if (field.name === 'name' && field.type === 'internal') {
            return !initData.name
          }
          return true
        }
      )

      const metaData = extendsFieldsToMetaData(
        needCompleteData,
        extendsFieldsOptions
      )

      const wecomQrs =
        qrCodeBindMethods?.['wechatwork-service-provider-qrconnect'] || []
      const wecomNewQrs =
        qrCodeBindMethods?.['wechatwork-service-provider-qrconnect-v2'] || []

      if (enabledRegisterFillInfo && metaData.length > 0) {
        changeModule?.(GuardModuleType.INVITE_COMPLETE, {
          ...initData,
          ...data,
          verifyAccount,
          metaData: metaData,
          originModule: GuardModuleType.INVITE_AUTH,
          originContext: initData,
          context
        })
      }
      // else if (enabledExtIdpBind && wecomQrs.length > 0) {
      //   // 开启身份源绑定
      //   changeModule?.(GuardModuleType.EY_IDENTITY_BIND, {
      //     ...initData,
      //     ...data,
      //     verifyAccount,
      //     context,
      //     weComConfig: wecomQrs[0],
      //     originModule: GuardModuleType.EY_CHECK_CAPTCHA,
      //     originContext: initData
      //   })
      // } else if (enabledExtIdpBind && wecomNewQrs.length > 0) {
      //   changeModule?.(GuardModuleType.EY_IDENTITY_BIND, {
      //     ...initData,
      //     ...data,
      //     verifyAccount,
      //     context,
      //     weComConfig: wecomNewQrs[0],
      //     isNew: true,
      //     originModule: GuardModuleType.EY_CHECK_CAPTCHA,
      //     originContext: initData
      //   })
      // }
      else {
        await onRegisterHandle(context)
      }
    } else {
      onGuardHandling?.()
    }
  }

  useEffect(() => {
    verifyCodeRef.current && verifyCodeRef.current?.send()
  }, [])

  return (
    <div className="g2-view-container g2-view-invite">
      <div className="g2-invite-content">
        <div className="g2-view-invite-header">
          <div className="title">{t('common.inputCaptcha')}</div>
          <div className="tips">
            {t('common.verifyAccount', [
              verifyAccount &&
                (verifyType === 'emailCode'
                  ? mailDesensitization(verifyAccount)
                  : phoneDesensitization(verifyAccount))
            ])}
          </div>
          <div className="tips errorTips">
            {t('common.captchaMaxErrorCount', [initData.verifyCodeMaxErrCount])}
          </div>
        </div>
        <Form
          form={form}
          onFinish={onFinishHandle}
          onFinishFailed={() => submitButtonRef.current?.onError()}
          onValuesChange={v => {
            const codes: string[] = v.code
            if (
              codes.filter(code => Boolean(code)).length >=
              initData.verifyCodeMaxLength
            ) {
              setDisabled(false)
            } else {
              setDisabled(true)
            }
          }}
        >
          <VerifyCodeFormItem
            codeLength={initData.verifyCodeMaxLength}
            name="code"
          >
            <VerifyCodeInput
              // ref={verifyCodeRef}
              length={initData.verifyCodeMaxLength}
              showDivider={true}
              gutter={'10px'}
              // beforeSend={async () => {
              //   const res = await reSendVerifyCode({
              //     receiverType: verifyType,
              //     ticket: initData.ticket
              //   })
              //   if (res.statusCode === 200) {
              //     return true
              //   }
              //   return false
              // }}
              // onFinish={async (code: number) => {
              //   await onFinishHandle({
              //     code
              //   })
              // }}
            />
          </VerifyCodeFormItem>
          <SubmitButton
            text={t('login.nextStep') as string}
            ref={submitButtonRef}
            disabled={disabled}
          />
        </Form>
        {descConstants?.show && (
          <div className="resend_email">
            <SendCodeBtn
              sendDesc={descConstants.desc}
              className="resend_code"
              beforeSend={async () => {
                const res = await reSendVerifyCode({
                  ticket: initData.ticket,
                  receiverType: descConstants.receiverType
                })
                if (res.statusCode === 200) {
                  setVerifyType(descConstants.receiverType)
                  return true
                } else {
                  res.onGuardHandling?.()
                  return false
                }
              }}
              type="link"
            />
          </div>
        )}
        <ChangeLanguage
          langRange={config?.langRange}
          onLangChange={events?.onLangChange}
        />
      </div>
    </div>
  )
}
