import { message, Form } from 'shim-antd'

import { SceneType } from 'authing-js-sdk'

import { React } from 'shim-react'

import { useTranslation } from 'react-i18next'

import { VerifyCodeInput } from '../VerifyCodeInput'

import { useGuardAuthClient } from '../../Guard/authClient'

import { SendCodeBtn } from '../../SendCode/SendCodeBtn'

import SubmitButton from '../../SubmitButton'

import CustomFormItem from '../../ValidatorRules'

import { VerifyCodeFormItem } from '../VerifyCodeInput/VerifyCodeFormItem'

import { GuardMFAInitData, MFAConfig, MFAType } from '../interface'

import { InputNumber } from '../../InputNumber'

import { IconFont } from '../../IconFont'

import { phoneDesensitization, useGuardHttp } from '../../_utils'

import { useGuardEvents, useGuardPublicConfig } from '../../_utils/context'

import {
  useMfaBusinessRequest,
  MfaBusinessAction,
  checkEmailOrSms
} from '../businessRequest'

import { InputInternationPhone } from '../../Login/core/withVerifyCode/InputInternationPhone'

import { parsePhone } from '../../_utils/hooks'
import { useEffectOnce } from 'react-use'

const { useCallback, useMemo, useRef, useState } = React
export interface BindMFASmsProps {
  mfaToken: string
  onBind: (phone: string) => void
  config: any
  areaCode: string
  setAreaCode: (areaCode: string) => void
  isInternationSms: boolean
  mfaConfigsMap: Map<MFAType, boolean>
}

export const BindMFASms: React.FC<BindMFASmsProps> = ({
  mfaToken,
  onBind,
  config,
  areaCode,
  setAreaCode,
  isInternationSms,
  mfaConfigsMap
}) => {
  const submitButtonRef = useRef<any>(null)
  const { t } = useTranslation()
  const [form] = Form.useForm()

  const onFinish = async ({ phone }: any) => {
    await form.validateFields()
    submitButtonRef.current?.onSpin(false)
    try {
      onBind(phone)
    } catch (e) {
      // do nothing
      submitButtonRef.current?.onError()
    }
  }

  const PhoneAccount = useCallback(
    (props: any) => {
      if (isInternationSms) {
        return (
          <InputInternationPhone
            {...props}
            className="authing-g2-input"
            size="large"
            areaCode={areaCode}
            onAreaCodeChange={(value: string) => {
              setAreaCode(value)
              form.getFieldValue(['phone']) && form.validateFields(['phone'])
            }}
            maxLength={20}
          />
        )
      } else {
        return (
          <InputNumber
            {...props}
            className="authing-g2-input"
            autoComplete="off"
            size="large"
            placeholder={t('login.inputPhone')}
            prefix={
              <IconFont
                type="authing-a-smartphone-line1"
                style={{ color: '#878A95' }}
              />
            }
            maxLength={20}
          />
        )
      }
    },
    [areaCode, form, isInternationSms, setAreaCode, t]
  )
  return (
    <>
      <h3 className="authing-g2-mfa-title">{t('common.mfaCertification')}</h3>
      <p className="authing-g2-mfa-tips">
        {mfaConfigsMap.get(MFAType.SMS)
          ? t('login.bindWarning')
          : t('login.bindPhoneInfo')}
      </p>
      {!mfaConfigsMap.get(MFAType.SMS) ? (
        <Form
          form={form}
          onSubmitCapture={() => submitButtonRef.current.onSpin(true)}
          onFinish={onFinish}
          onFinishFailed={() => submitButtonRef.current.onError()}
        >
          <CustomFormItem.Phone
            className={
              isInternationSms
                ? 'authing-g2-input-form remove-padding'
                : 'authing-g2-input-form'
            }
            name="phone"
            form={form}
            // checkRepeat={true}
            required={true}
            areaCode={areaCode}
          >
            <PhoneAccount />
          </CustomFormItem.Phone>
          <SubmitButton
            text={t('common.sure') as string}
            ref={submitButtonRef}
          />
        </Form>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <IconFont type="authing-bianzu" style={{ width: 178, height: 120 }} />
        </div>
      )}
    </>
  )
}

export interface VerifyMFASmsProps {
  mfaToken: string
  phone: string
  onVerify: (code: number, data: any) => void
  sendCodeRef: React.RefObject<HTMLButtonElement>
  codeLength: number
  areaCode: string //绑定选择的
  phoneCountryCode?: string //后端返回的国家区号
  isInternationSms: boolean
  userPhone?: string
}

export const VerifyMFASms: React.FC<VerifyMFASmsProps> = ({
  mfaToken,
  phone,
  userPhone,
  onVerify,
  sendCodeRef,
  codeLength = 4,
  areaCode,
  phoneCountryCode,
  isInternationSms
}) => {
  const authClient = useGuardAuthClient()

  const { post } = useGuardHttp()

  const events = useGuardEvents()

  const submitButtonRef = useRef<any>(null)

  const { t } = useTranslation()

  const [form] = Form.useForm()

  const [sent, setSent] = useState<boolean>(false)

  const { phoneNumber, countryCode } = parsePhone(
    isInternationSms,
    phone,
    areaCode
  )
  useEffectOnce(() => {
    sendCodeRef.current?.click()
  })

  const businessRequest = useMfaBusinessRequest()[MfaBusinessAction.VerifySms]

  const onFinish = async (values: any) => {
    submitButtonRef.current?.onSpin(true)
    const mfaCode = form.getFieldValue('mfaCode')

    const requestData: any = {
      mfaToken,
      phone: phone!,
      code: mfaCode,
      phoneCountryCode: phoneCountryCode ? phoneCountryCode : countryCode
    }

    const { isFlowEnd, data, onGuardHandling } = await businessRequest(
      requestData
    )

    submitButtonRef.current?.onSpin(false)

    if (isFlowEnd) {
      onVerify(200, data)
    } else {
      submitButtonRef.current.onError()
      onGuardHandling?.()
    }
  }

  const tips = useMemo(
    () =>
      sent
        ? `${t('login.verifyCodeSended')} ${
            isInternationSms
              ? phoneCountryCode
                ? phoneCountryCode
                : countryCode
              : ''
          } ${phoneDesensitization(phone)}`
        : t('common.SmsMfaCheck'),
    [countryCode, isInternationSms, phone, phoneCountryCode, sent, t]
  )

  const sendVerifyCode = async () => {
    try {
      const data = await post('/api/v2/sms/send', {
        phone: userPhone ? userPhone : phoneNumber,
        phoneCountryCode: phoneCountryCode ? phoneCountryCode : countryCode,
        scene: SceneType.SCENE_TYPE_MFA_VERIFY
      })
      const { code, statusCode, message: msg } = data
      // 200 表示请求成功，不报错
      if (statusCode === 200 || code === 200) {
        return { status: true }
      } else {
        // 由于使用项目中 post 方法进行请求，外层进行了处理，不会抛错，catch 不会走，在这对 code 进行针对处理
        // 'ECONNABORTED' 不知道是不是只有 sdk 报错，所以我在接口这也写了，防止接口也会1报这个错
        if ((code as any) === 'ECONNABORTED') {
          message.error(t('login.sendCodeTimeout'))
          return {
            status: false,
            error: data
          }
        }
        // code 不是 -1、-2 时，并且 msg 存在， 那么进行报错
        if (!(code === -1 || code === -2)) {
          msg && message.error(msg)
        }
        // 这里看之前 sdk catch 中把整个 error对象传递的，所以报错时我就把整个返回值当作 error 对象传递了，而不是单独传递 message
        // 看的本文件 117行 onPhoneSendError 函数接受的 error 类型是一个对象「只包含 code、message」
        return { status: false, error: data }
      }
    } catch (error: any) {
      if (error.code === 'ECONNABORTED') {
        message.error(t('login.sendCodeTimeout'))
        return {
          status: false,
          error
        }
      }

      try {
        const errorMessage = JSON.parse(error.message)
        message.error(errorMessage.message)
      } catch (_) {
        message.error(error)
      }
      return {
        status: false,
        error
      }
    }
  }

  return (
    <>
      <h3 className="authing-g2-mfa-title">{t('common.mfaCertification')}</h3>
      <p className="authing-g2-mfa-tips">{tips}</p>
      <Form
        form={form}
        onFinish={onFinish}
        onFinishFailed={() => submitButtonRef.current.onError()}
      >
        <VerifyCodeFormItem
          codeLength={codeLength}
          ruleKeyword={t('common.captchaCode')!}
        >
          <VerifyCodeInput
            length={codeLength}
            onFinish={onFinish}
            showDivider={true}
            gutter={'10px'}
            ResentBtnSort={() => (
              <SendCodeBtn
                className="resend_code"
                btnRef={sendCodeRef}
                setSent={setSent}
                beforeSend={async () => {
                  const { status, error } = await sendVerifyCode()
                  if (status) {
                    events?.onPhoneSend?.(
                      authClient,
                      SceneType.SCENE_TYPE_MFA_VERIFY
                    )
                  } else {
                    events?.onPhoneSendError?.(
                      error,
                      authClient,
                      SceneType.SCENE_TYPE_MFA_VERIFY
                    )
                  }
                  return status
                }}
                type="link"
              />
            )}
          />
        </VerifyCodeFormItem>

        <SubmitButton
          text={t('common.sure')!}
          ref={submitButtonRef}
          className="g2-mfa-submit-button"
        />
      </Form>
    </>
  )
}

export const MFASms: React.FC<{
  // mfaToken: string
  // phone?: string
  mfaLogin: any
  config: MFAConfig
  initData: GuardMFAInitData
  mfaConfigsMap: Map<MFAType, boolean>
}> = ({
  mfaLogin,
  config,
  initData: {
    mfaPhone: userPhone,
    mfaToken,
    mfaPhoneCountryCode: phoneCountryCode
  },
  mfaConfigsMap
}) => {
  const [phone, setPhone] = useState(userPhone)

  const sendCodeRef = useRef<HTMLButtonElement>(null)

  const publicConfig = useGuardPublicConfig()

  const codeLength = publicConfig?.verifyCodeLength
  const [areaCode, setAreaCode] = useState(
    publicConfig?.internationalSmsConfig?.defaultISOType || 'CN'
  )

  const isInternationSms = Boolean(
    publicConfig?.internationalSmsConfig?.enabled
  )
  // todo 后续改 不用 phone 作为判断模式
  return (
    <>
      {phone ? (
        <VerifyMFASms
          mfaToken={mfaToken}
          phone={phone}
          userPhone={userPhone}
          phoneCountryCode={phoneCountryCode}
          isInternationSms={isInternationSms}
          onVerify={(code, data) => {
            mfaLogin(code, data)
          }}
          codeLength={codeLength ?? 4}
          sendCodeRef={sendCodeRef}
          areaCode={areaCode}
        />
      ) : (
        <BindMFASms
          config={config}
          mfaToken={mfaToken}
          areaCode={areaCode}
          setAreaCode={setAreaCode}
          isInternationSms={isInternationSms}
          onBind={(phone: string) => {
            setPhone(phone)
            sendCodeRef.current?.click()
          }}
          mfaConfigsMap={mfaConfigsMap}
        />
      )}
    </>
  )
}

export const SmsPreCheck: React.FC<any> = ({
  mfaToken,
  phone,
  userPhone,
  checkSuccess,
  codeLength = 4,
  areaCode,
  phoneCountryCode,
  isInternationSms
}) => {
  const authClient = useGuardAuthClient()

  const { post } = useGuardHttp()

  const events = useGuardEvents()

  const submitButtonRef = useRef<any>(null)

  const { t } = useTranslation()

  const [form] = Form.useForm()

  const [sent, setSent] = useState<boolean>(false)

  const { phoneNumber, countryCode } = parsePhone(
    isInternationSms,
    phone,
    areaCode
  )

  const onFinish = async (values: any) => {
    submitButtonRef.current?.onSpin(true)
    const mfaCode = form.getFieldValue('mfaCode')

    const requestData: any = {
      type: 'sms',
      mfaToken,
      phone: phone!,
      code: mfaCode,
      phoneCountryCode: phoneCountryCode ? phoneCountryCode : countryCode
    }

    try {
      const { code, onGuardHandling } = await checkEmailOrSms(requestData)
      submitButtonRef.current?.onSpin(false)
      if (code === 200) {
        checkSuccess()
      } else {
        onGuardHandling?.()
      }
    } finally {
      submitButtonRef.current?.onSpin(false)
    }
  }

  const tips = useMemo(
    () =>
      sent
        ? `${t('login.verifyCodeSended')} ${
            isInternationSms
              ? phoneCountryCode
                ? phoneCountryCode
                : countryCode
              : ''
          } ${phoneDesensitization(phone)}`
        : t('common.SmsMfaCheck'),
    [countryCode, isInternationSms, phone, phoneCountryCode, sent, t]
  )

  const sendVerifyCode = async () => {
    try {
      const data = await post('/api/v2/sms/send', {
        phone: userPhone ? userPhone : phoneNumber,
        phoneCountryCode: phoneCountryCode ? phoneCountryCode : countryCode,
        scene: SceneType.SCENE_TYPE_MFA_VERIFY
      })
      const { code, statusCode, message: msg } = data
      // 200 表示请求成功，不报错
      if (statusCode === 200 || code === 200) {
        return { status: true }
      } else {
        // 由于使用项目中 post 方法进行请求，外层进行了处理，不会抛错，catch 不会走，在这对 code 进行针对处理
        // 'ECONNABORTED' 不知道是不是只有 sdk 报错，所以我在接口这也写了，防止接口也会1报这个错
        if ((code as any) === 'ECONNABORTED') {
          message.error(t('login.sendCodeTimeout'))
          return {
            status: false,
            error: data
          }
        }
        // code 不是 -1、-2 时，并且 msg 存在， 那么进行报错
        if (!(code === -1 || code === -2)) {
          msg && message.error(msg)
        }
        // 这里看之前 sdk catch 中把整个 error对象传递的，所以报错时我就把整个返回值当作 error 对象传递了，而不是单独传递 message
        // 看的本文件 117行 onPhoneSendError 函数接受的 error 类型是一个对象「只包含 code、message」
        return { status: false, error: data }
      }
    } catch (error: any) {
      if (error.code === 'ECONNABORTED') {
        message.error(t('login.sendCodeTimeout'))
        return {
          status: false,
          error
        }
      }
      try {
        const errorMessage = JSON.parse(error.message)
        message.error(errorMessage.message)
      } catch (_) {
        message.error(error)
      }
      return {
        status: false,
        error
      }
    }
  }

  return (
    <>
      <h3 className="authing-g2-mfa-title">{t('common.mfaBindPreMessage')}</h3>
      <p className="authing-g2-mfa-tips">{tips}</p>
      <Form
        form={form}
        onFinish={onFinish}
        onFinishFailed={() => submitButtonRef.current.onError()}
      >
        <VerifyCodeFormItem
          codeLength={codeLength}
          ruleKeyword={t('common.captchaCode')!}
        >
          <VerifyCodeInput
            length={codeLength}
            onFinish={onFinish}
            showDivider={true}
            gutter={'10px'}
            ResentBtnSort={() => (
              <SendCodeBtn
                className="resend_code"
                setSent={setSent}
                beforeSend={async () => {
                  const { status, error } = await sendVerifyCode()
                  if (status) {
                    events?.onPhoneSend?.(
                      authClient,
                      SceneType.SCENE_TYPE_MFA_VERIFY
                    )
                  } else {
                    events?.onPhoneSendError?.(
                      error,
                      authClient,
                      SceneType.SCENE_TYPE_MFA_VERIFY
                    )
                  }
                  return status
                }}
                type="link"
              />
            )}
          />
        </VerifyCodeFormItem>

        <SubmitButton
          text={t('common.sure')!}
          ref={submitButtonRef}
          className="g2-mfa-submit-button"
        />
      </Form>
    </>
  )
}
