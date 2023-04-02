import { React } from 'shim-react'

import { Form, message } from 'shim-antd'

import { IconFont } from '../../../IconFont'

import { useMediaSize } from '../../../_utils/hooks'

import SubmitButton from '../../../SubmitButton'

import { OnPushSuccessProps, OnLoginProps } from './types'

import { AuthingGuardResponse } from '../../../_utils/http'

import { useTranslation } from 'react-i18next'

import {
  useGuardDefaultLanguage,
  useGuardFinallyConfig,
  useGuardPublicConfig
} from '../../../_utils/context'

import { getSortLabels, isDisabled } from '../../../_utils'

import { Agreement, TabFieldsI18nItem } from '../../../Type'

import { Agreements } from '../../../Register/components/Agreements'

import { PushLoginGudeModal } from './PushLoginGuideModal'

import { CommonFormItem } from '../../../CommonFormItem'

import { CommonInput } from '../../../CommonInput'

const { useMemo, useRef, useState } = React

interface BeforeLoginProps {
  onPushSuccess: (props: OnPushSuccessProps) => void
  signinByPush: (props: OnLoginProps) => Promise<
    AuthingGuardResponse<{
      pushCodeId: string
    }>
  >
  pushLoginStatus: boolean
  onchangePushLoginStatus: () => void
  defaultAccount: string
  setAccount: React.Dispatch<any>
  agreements: Agreement[]
}

export function BeforeLogin(props: BeforeLoginProps) {
  const { onPushSuccess, signinByPush, pushLoginStatus, setAccount, agreements } = props

  const { isPhoneMedia } = useMediaSize()

  const { t } = useTranslation()

  const config = useGuardFinallyConfig()

  const publicConfig = useGuardPublicConfig()

  const defaultLanguageConfig = useGuardDefaultLanguage()

  const [form] = Form.useForm()

  const [acceptedAgreements, setAcceptedAgreements] = useState(false)

  const [validated, setValidated] = useState(false)

  const submitButtonRef = useRef<any>(null)

  const [btnDisabled, setDisabled] = useState(true)

  const formValuesChange = (_: Record<string, any>, allValues: Record<string, any>) => {
    // 判断其他表单项是否填写
    setDisabled(isDisabled(allValues))
  }

  const i18nFields = useMemo(() => {
    const i18nMap = new Map<string, TabFieldsI18nItem>()
    publicConfig.tabMethodsFields.forEach(item => {
      i18nMap.set(item.key, item)
    })
    return i18nMap
  }, [publicConfig.tabMethodsFields])

  const onPushLogin = async (account: string) => {
    setValidated(true)

    if (agreements?.length && !acceptedAgreements) {
      submitButtonRef?.current.onError()
      return
    }

    if (!account) {
      return message.error(t('login.enterAccount'))
    }

    const {
      statusCode,
      message: _message,
      data
    } = await signinByPush({
      account
    })

    if (statusCode === 200) {
      setAccount(account)
      onPushSuccess({
        pushCodeId: data?.pushCodeId || ''
      })
    } else {
      message.error(_message)
    }
  }

  const onFinish = async (values: any) => {
    const { account } = values

    onPushLogin(account)
  }

  const [visible, setVisible] = useState<boolean>(false)

  const onCloseModal = () => {
    setVisible(false)
  }

  const openModal = () => {
    setVisible(true)
  }

  const placeholder = useMemo(() => {
    const methods = publicConfig.authingOtpPushTabConfig?.validLoginMethods || []

    // 登录注册合并
    if (config?.autoRegister) {
      return t('login.inputAccount', {
        text: getSortLabels(methods, i18nFields, defaultLanguageConfig)
      })
    }

    // 登录注册分页
    return t('login.inputAccount', {
      text: getSortLabels([...methods], i18nFields, defaultLanguageConfig)
    })
  }, [
    config?.autoRegister,
    i18nFields,
    defaultLanguageConfig,
    publicConfig.authingOtpPushTabConfig?.validLoginMethods,
    t
  ])

  return (
    <div>
      {!pushLoginStatus && (
        <div className="push-login-error-tips-container">
          <div className="push-login-error-warning-box">
            <IconFont
              type="authing-error-warning-fill1"
              className="icon-push-login-error-warning"
            />
            <div>{t('login.getOtpLoginRequestAgain')}</div>
          </div>
          <div onClick={props.onchangePushLoginStatus}>
            <IconFont type="authing-close-line" className="close-line" />
          </div>
        </div>
      )}
      <Form onFinish={onFinish} form={form} onValuesChange={formValuesChange}>
        <CommonFormItem name="account">
          <CommonInput
            name="account"
            className="authing-g2-input"
            autoComplete="off"
            autoFocus={!isPhoneMedia}
            placeholder={placeholder}
          />
        </CommonFormItem>
        {Boolean(agreements?.length) && (
          <Agreements
            agreements={agreements}
            showError={validated}
            onChange={setAcceptedAgreements}
          />
        )}
        <Form.Item className="authing-g2-sumbit-form">
          <SubmitButton
            disabled={btnDisabled}
            text={t('login.loginText')}
            htmlType="submit"
            ref={submitButtonRef}
          />
        </Form.Item>
      </Form>
      <div className="how-use-push-login" onClick={openModal}>
        {t('login.howUsePushLogin')}?
      </div>
      <PushLoginGudeModal visible={visible} onClose={onCloseModal} />
    </div>
  )
}
