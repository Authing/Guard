import { Form, Input, message } from 'shim-antd'

import { React } from 'shim-react'

import { useGuardAuthClient } from '../../Guard/authClient'

import { IconFont } from '../../IconFont'

import SubmitButton from '../../SubmitButton'

import CustomFormItem from '../../ValidatorRules'

import { useGuardEvents } from '../../_utils/context'

import { i18n } from '../../_utils/locales'

import { ApiCode } from '../../_utils/responseManagement/interface'

import { authFlow, ResetAccountBusinessAction } from './businessRequest'

import './style.less'

const { useCallback, useRef } = React

export const ResetAccountName: React.FC = () => {
  const submitButtonRef = useRef<any>(null)
  const [form] = Form.useForm()
  const events = useGuardEvents()
  const authClient = useGuardAuthClient()

  const onFinish = useCallback(
    async values => {
      try {
        const {
          apiCode,
          onGuardHandling,
          message: msg,
          isFlowEnd,
          data
        } = await authFlow(ResetAccountBusinessAction.ResetName, values)

        submitButtonRef.current?.onSpin(false)

        if (isFlowEnd) {
          events?.onLogin?.(data, authClient)
        } else if (apiCode === ApiCode.RESET_ACCOUNT_NAME) {
          // 用户名重复
          message.error(msg)
        } else {
          submitButtonRef.current?.onError()
          onGuardHandling?.()
        }
      } catch (error) {}
    },
    [authClient, events]
  )

  return (
    <div className="g2-view-reset-username">
      <div className="g2-view-reset-username__title">{i18n.t('common.resetAccount.title')}</div>
      <Form
        name="passworLogin"
        onFinish={onFinish}
        onFinishFailed={() => submitButtonRef.current?.onError()}
        autoComplete="off"
        form={form}
      >
        <CustomFormItem.UserName>
          <Input
            className="authing-g2-input"
            size="large"
            prefix={<IconFont type="authing-a-user-line1" style={{ color: '#878A95' }} />}
            placeholder={i18n.t('login.inputUsername')}
          />
        </CustomFormItem.UserName>
        <Form.Item className="authing-g2-sumbit-form">
          <SubmitButton text={i18n.t('common.sure')} className="password" ref={submitButtonRef} />
        </Form.Item>
      </Form>
    </div>
  )
}
