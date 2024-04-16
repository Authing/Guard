import { Form } from 'shim-antd'
import { React } from 'shim-react'
import { useTranslation } from 'react-i18next'
import { EmailScene } from '../../Type'
import { useGuardView } from '../../Guard/core/hooks/useGuardView'
import { SceneType } from 'authing-js-sdk'
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
  useGuardModule,
  useGuardPublicConfig
} from '../../_utils/context'
import { InviteContext, useRegisterHandleHook } from '../interface'
import './style.less'

const { useCallback, useEffect, useMemo, useRef, useState } = React

export const GuardAuthenticationView = () => {
  const initData = useGuardInitData<InviteContext>()

  const events = useGuardEvents()

  const config = useGuardFinallyConfig()

  const { t } = useTranslation()

  const verifyCodeRef = useRef<any>(null)

  useGuardView()

  const { changeModule } = useGuardModule()

  const { post } = useGuardHttpClient()

  const publicConfig = useGuardPublicConfig()

  const verifyCodeLength = publicConfig?.verifyCodeLength

  const [form] = Form.useForm()

  const submitButtonRef = useRef<any>(null)

  const [disabled, setDisabled] = useState<boolean>(true)

  const [verifyType, setVerifyType] = useState<'emailCode' | 'smsCode'>(
    initData.sendVerifyCodeMethod === 'prioritySMS' && initData.phone
      ? 'smsCode'
      : 'emailCode'
  )
  const btnRef = useRef(null)

  const verifyAccount = useMemo(() => {
    if (verifyType === 'emailCode') {
      return initData.email
    } else if (verifyType === 'smsCode') {
      return initData.phone
    }
  }, [initData.email, initData.phone, verifyType])

  const descConstants: any = useMemo(() => {
    const constants = {
      prioritySMS: {
        emailCode: {
          desc: t('common.sendSms'),
          show: initData.phone,
          receiverType: 'smsCode'
        },
        smsCode: {
          desc: t('common.sendEmail'),
          show: initData.email,
          receiverType: 'emailCode'
        }
      },
      priorityEmail: {
        emailCode: {
          desc: t('common.sendSms'),
          show: initData.phone,
          receiverType: 'smsCode'
        },
        smsCode: {
          desc: t('common.sendEmail'),
          show: initData.email,
          receiverType: 'emailCode'
        }
      }
    }
    const codeMethod = initData.sendVerifyCodeMethod
    if (['prioritySMS', 'priorityEmail'].some(type => codeMethod === type)) {
      return {
        ...(constants[codeMethod] as any)[verifyType]
      }
    }
    return constants[codeMethod]
  }, [initData, t, verifyType])

  const reSendVerifyCode = useCallback(
    async params =>
      await post(
        params.receiverType === 'emailCode'
          ? '/api/v2/email/send'
          : '/api/v2/sms/send',
        {
          ...params,
          scene:
            params.receiverType === 'emailCode'
              ? EmailScene.REGISTER_VERIFY_CODE
              : SceneType.SCENE_TYPE_REGISTER
        }
      ),
    [post]
  )

  const onRegisterHandle = useRegisterHandleHook(initData, submitButtonRef)

  const onFinishHandle = async (formValues: any) => {
    const captcha = formValues.code.join('')

    const res = await post('/api/v3/verify-invite-code', {
      code: captcha,
      receiverType: verifyType,
      token: initData.token
    })

    const { statusCode, onGuardHandling } = res
    if (statusCode === 200) {
      const {
        extendsFields = [],
        extendsFieldsOptions = [],
        enabledInfoFill
      } = initData

      const context = {
        code: captcha,
        token: initData.token,
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

      console.log('needCompleteData: ', needCompleteData)

      const metaData = extendsFieldsToMetaData(
        needCompleteData,
        extendsFieldsOptions
      )

      console.log('metaData:-----', metaData)

      if (enabledInfoFill && metaData.length > 0) {
        changeModule?.(GuardModuleType.INVITE_COMPLETE, {
          ...initData,
          // ...data,
          verifyAccount,
          metaData: metaData,
          originModule: GuardModuleType.INVITE_AUTH,
          originContext: initData,
          context
        })
      } else {
        await onRegisterHandle(context)
      }
    } else {
      onGuardHandling?.()
    }
  }

  useEffect(() => {
    console.log('verifyCodeRef.current: ', verifyCodeRef.current.click)

    verifyCodeRef.current && verifyCodeRef.current?.click()
  }, [])

  const onSend = async (type: 'default' | 'reSend') => {
    const receiverType =
      type === 'default' ? verifyType : descConstants.receiverType
    const res = await reSendVerifyCode({
      phone: initData.phone,
      phoneCountryCode: initData.phoneCountryCode,
      email: initData.email,
      receiverType
    })
    if (res.code === 200) {
      setVerifyType(receiverType)
      return true
    } else {
      res.onGuardHandling?.()
      return false
    }
  }

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
            console.log('verifyCodeLength: ', verifyCodeLength)

            const codes: string[] = v.code
            if (
              codes.filter(code => Boolean(code)).length >= verifyCodeLength
            ) {
              setDisabled(false)
            } else {
              setDisabled(true)
            }
          }}
        >
          <VerifyCodeFormItem codeLength={verifyCodeLength} name="code">
            <VerifyCodeInput
              length={verifyCodeLength}
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
          <div className="resend_container">
            <SendCodeBtn
              btnRef={verifyCodeRef}
              beforeSend={async () => await onSend('default')}
              type="link"
            />
          </div>
          <SubmitButton
            text={t('login.nextStep') as string}
            ref={submitButtonRef}
            disabled={disabled}
          />
        </Form>
        {descConstants?.show && (
          <div className="resend_container">
            <SendCodeBtn
              btnRef={btnRef}
              sendDesc={descConstants.desc}
              beforeSend={async () => await onSend('reSend')}
              type="link"
              className="resend_code"
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
