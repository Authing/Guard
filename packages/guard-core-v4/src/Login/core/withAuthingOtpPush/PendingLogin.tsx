import { React } from 'shim-react'

import { Button, Form } from 'shim-antd'

import '@antd-lib-style/form/style/index.less'

import '@antd-lib-style/button/style/index.less'

import './styles.less'

import { IconFont } from '../../../IconFont'

import { useTranslation } from 'react-i18next'

interface PendingLoginProps {
  onCancelLogin: () => void
}

export function PendingLogin(props: PendingLoginProps) {
  const onCancelLogin = () => {
    props.onCancelLogin()
  }

  const { t } = useTranslation()

  return (
    <>
      <div className="pending-tips">
        <div className="code-success">
          <IconFont type="authing-checkbox-circle-fill" />
        </div>
        <div>{t('login.otpLoginPendingText')}</div>
      </div>
      <Form>
        <Form.Item className="authing-g2-sumbit-form">
          <Button
            block
            style={{
              width: '348px',
              height: '44px',
              background: '#F2F3F5',
              borderRadius: '4px',
              border: 'none'
            }}
            onClick={onCancelLogin}
          >
            {t('login.authingOtpPushCancelLogin')}
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}
