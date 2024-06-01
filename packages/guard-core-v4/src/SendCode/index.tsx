import { Col, Row } from 'shim-antd'

import { React } from 'shim-react'

import { SendCodeBtn } from './SendCodeBtn'

import { i18n, resolvedLanguage } from '../_utils/locales'

import './style.less'

import { useTranslation } from 'react-i18next'

import { InputProps } from 'shim-antd'

import { InputNumber } from '../InputNumber'

export interface SendPhoneCodeProps extends InputProps {
  form?: any
  beforeSend?: any // 点击的时候先做这个
  autoSubmit?: boolean //验证码输入完毕是否自动提交
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
          span={/ja/.test(resolvedLanguage) ? 9 : 15}
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
        <Col offset={1} span={/ja/.test(resolvedLanguage) ? 14 : 8}>
          <SendCodeBtn
            beforeSend={beforeSend}
            sendDesc={t('common.sendVerifyCode') as string}
          />
        </Col>
      </Row>
    </>
  )
}
