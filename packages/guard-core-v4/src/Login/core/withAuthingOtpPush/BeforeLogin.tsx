import { React } from 'shim-react'

import { Form, Input, message } from 'shim-antd'

import '@antd-lib-style/input/style/index.less'

import '@antd-lib-style/message/style/index.less'

import '@antd-lib-style/form/style/index.less'

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

import { getSortLabels } from '../../../_utils'

import { Agreement, TabFieldsI18nItem } from '../../../Type'

import { Agreements } from '../../../Register/components/Agreements'

import { PushLoginGudeModal } from './PushLoginGuideModal'

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
  const {
    onPushSuccess,
    signinByPush,
    pushLoginStatus,
    setAccount,
    agreements
  } = props

  const { isPhoneMedia } = useMediaSize()

  const { t } = useTranslation()

  const config = useGuardFinallyConfig()

  const publicConfig = useGuardPublicConfig()

  const defaultLanguageConfig = useGuardDefaultLanguage()

  const [form] = Form.useForm()

  const [acceptedAgreements, setAcceptedAgreements] = useState(false)

  const [validated, setValidated] = useState(false)

  let submitButtonRef = useRef<any>(null)

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
    const methods =
      publicConfig.authingOtpPushTabConfig?.validLoginMethods || []

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
      <Form onFinish={onFinish} form={form}>
        <Form.Item name="account">
          <Input
            className="authing-g2-input"
            autoComplete="off"
            size="large"
            autoFocus={!isPhoneMedia}
            placeholder={placeholder}
            prefix={
              <IconFont
                type="authing-a-user-line1"
                style={{ color: '#878A95' }}
              />
            }
          />
        </Form.Item>
        {Boolean(agreements?.length) && (
          <Agreements
            agreements={agreements}
            showError={validated}
            onChange={setAcceptedAgreements}
          />
        )}
        <Form.Item className="authing-g2-sumbit-form">
          <SubmitButton
            text={t('login.loginText') as string}
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
