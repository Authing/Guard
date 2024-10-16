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

import { phoneDesensitization } from '../../_utils'

import { useGuardPublicConfig } from '../../_utils/context'

import { useMfaBusinessRequest, MfaBusinessAction } from '../businessRequest'

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
      code: mfaCode.join(''),
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
      await authClient.sendSmsCode(
        userPhone ? userPhone : phoneNumber,
        phoneCountryCode ? phoneCountryCode : countryCode,
        SceneType.SCENE_TYPE_MFA_VERIFY
      )
      return true
    } catch (e: any) {
      if (e.code === 'ECONNABORTED') {
        message.error(t('login.sendCodeTimeout'))
        return false
      }
      const errorMessage = JSON.parse(e.message)
      message.error(errorMessage.message)
      return false
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
          text={t('common.sure') as string}
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
