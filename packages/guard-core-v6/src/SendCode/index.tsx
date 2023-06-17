import { Col, Row } from 'shim-antd'

import { React } from 'shim-react'

import { SendCodeBtn } from './SendCodeBtn'

import './style.less'

import { i18n } from '../_utils'

import { useTranslation } from 'react-i18next'

import { InputProps } from 'shim-antd/lib/input'

import { InputNumber } from '../InputNumber'

export interface SendPhoneCodeProps extends InputProps {
  form?: any
  beforeSend?: any // 点击的时候先做这个
  autoSubmit?: boolean //验证码输入完毕是否自动提交
  name: string
}

export const SendCode: React.FC<SendPhoneCodeProps> = ({
  value,
  onChange,
  autoSubmit = false,
  form,
  beforeSend,
  maxLength,
  ...inputProps
}) => {
  const { t } = useTranslation()
  return (
    <>
      <Row justify="space-between" align="middle">
        <Col
          span={/ja/.test(i18n.language) ? 8 : 16}
          className="g2-send-code-input-col"
        >
          <InputNumber
            value={value}
            onChange={(e: any) => {
              onChange?.(e)
              if (!autoSubmit) return
              if (maxLength && e.target.value.length >= maxLength) {
                form?.submit()
              }
            }}
            {...inputProps}
            maxLength={maxLength}
          />
        </Col>
        <Col span={/ja/.test(i18n.language) ? 16 : 8}>
          <SendCodeBtn
            beforeSend={beforeSend}
            sendDesc={t('common.sendVerifyCode') as string}
          />
        </Col>
      </Row>
    </>
  )
}
