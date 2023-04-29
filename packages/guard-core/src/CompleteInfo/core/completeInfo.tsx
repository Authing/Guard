import { React } from 'shim-react'

import { Form, Input, Select, DatePicker, message } from 'shim-antd'

import { i18n, isDisabled } from '../../_utils'

import { useTranslation } from 'react-i18next'

import { useAsyncFn } from 'react-use'

import {
  CompleteInfoBaseControls,
  CompleteInfoExtendsControls,
  CompleteInfoMetaData,
  CompleteInfoRequest
} from '../interface'

import { useGuardHttp } from '../../_utils/guardHttp'

import SubmitButton from '../../SubmitButton'

import { InputNumber } from '../../InputNumber'

import { SceneType } from 'authing-js-sdk'

import CustomFormItem from '../../ValidatorRules'

import { fieldRequiredRule, getCurrentLng } from '../../_utils'

import { SendCodeByEmail } from '../../SendCode/SendCodeByEmail'

import { SendCodeByPhone } from '../../SendCode/SendCodeByPhone'

import { useGuardPublicConfig } from '../../_utils/context'

import { parsePhone } from '../../_utils/hooks'

import { InputInternationPhone } from '../../Login/core/withVerifyCode/InputInternationPhone'

import { EmailScene } from '../../Type'

import { UploadImage } from '../../UploadImage'
import { CommonFormItem } from '../../CommonFormItem'
import { CommonInput } from '../../CommonInput'
import { IconFont } from '../../IconFont'

const { useCallback, useEffect, useMemo, useRef, useState } = React

const MomentPicker: any = DatePicker

export interface CompleteInfoProps {
  metaData: CompleteInfoMetaData[]
  businessRequest: (data: CompleteInfoRequest) => Promise<void>
}

export interface FieldMetadata {
  key: string
  options: any
}

const filterOption = (input: any, option: any) => {
  return (
    option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
    option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
  )
}

export const CompleteInfo: React.FC<CompleteInfoProps> = props => {
  const { metaData, businessRequest } = props

  const config = useGuardPublicConfig()

  const verifyCodeLength = config?.verifyCodeLength

  const submitButtonRef = useRef<any>(null)

  const [countryList, setCountryList] = useState<any>([])

  const isInternationSms = config?.internationalSmsConfig?.enabled || false

  const [areaCode, setAreaCode] = useState(
    config?.internationalSmsConfig?.defaultISOType || 'CN'
  )

  const { get, post } = useGuardHttp()

  const { t } = useTranslation()

  const [form] = Form.useForm()

  const loadInitCountryList = useCallback(async () => {
    const { data } = await get('/api/v2/country-list')

    const countryMap = i18n.language === 'zh-CN' ? data?.zh : data?.en

    const countryList: { label: string; value: string }[] = []

    for (const [key, value] of Object.entries(countryMap)) {
      countryList.push({
        label: value + ` (${key})`,
        value: key
      })
    }

    setCountryList(countryList)
  }, [get])

  useEffect(() => {
    if (!metaData.map(i => i.name).includes('country')) return
    loadInitCountryList()
  }, [loadInitCountryList, metaData])

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
              form.getFieldValue(['internal phone:phone']) &&
                form.validateFields(['internal phone:phone'])
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
            key="internal-phone:phone123"
            type="tel"
            size="large"
            maxLength={11}
            placeholder={t('login.inputPhone')}
          />
        )
      }
    },
    [areaCode, form, isInternationSms, t]
  )
  const baseControlMap: Record<
    string,
    (props?: any) => React.ReactNode | undefined
  > = useMemo(
    () => ({
      gender: props => (
        <Select
          key={props.key}
          className="authing-g2-select"
          suffixIcon={
            <IconFont
              type="authing-arrow-down-s-line"
              className="authing-select-down-arrow"
            />
          }
          options={[
            { label: i18n.t('common.man'), value: 'M' },
            { label: i18n.t('common.female'), value: 'F' }
          ]}
          menuItemSelectedIcon={
            <IconFont
              type="authing-check-fill"
              style={{ fontSize: 16, color: '#4E5969' }}
            />
          }
        />
      ),
      country: props => (
        <Select
          key={props.key}
          className="authing-g2-select"
          options={countryList}
          suffixIcon={
            <IconFont
              type="authing-arrow-down-s-line"
              className="authing-select-down-arrow"
            />
          }
          showSearch
          filterOption={filterOption}
          menuItemSelectedIcon={
            <IconFont
              type="authing-check-fill"
              style={{ fontSize: 16, color: '#4E5969' }}
            />
          }
        />
      ),
      image: () => <UploadImage />,
      number: props => (
        <InputNumber
          key={props.key}
          name={props.key}
          style={{ width: '100%' }}
          showType="normal"
          className="authing-g2-input"
        />
      ),
      date: props => (
        <MomentPicker
          key={props.key}
          className="authing-g2-input"
          style={{ width: '100%' }}
          placeholder={i18n.t('common.pleaseSelectDate')}
        />
      ),
      datetime: props => (
        <MomentPicker
          key={props.key}
          className="authing-g2-input"
          style={{ width: '100%' }}
          placeholder={i18n.t('common.pleaseSelectDate')}
        />
      ),
      select: (props: any) => (
        <Select
          key={props.key}
          className="authing-g2-select"
          suffixIcon={
            <IconFont
              type="authing-arrow-down-s-line"
              className="authing-select-down-arrow"
            />
          }
          showSearch
          options={props.options}
          filterOption={filterOption}
          menuItemSelectedIcon={
            <IconFont
              type="authing-check-fill"
              style={{ fontSize: 16, color: '#4E5969' }}
            />
          }
        />
      ),
      dropdown: (props: any) => (
        <Select
          key={props.key}
          className="authing-g2-select"
          suffixIcon={
            <IconFont
              type="authing-arrow-down-s-line"
              className="authing-select-down-arrow"
            />
          }
          showSearch
          options={props.options}
          filterOption={filterOption}
          menuItemSelectedIcon={
            <IconFont
              type="authing-check-fill"
              style={{ fontSize: 16, color: '#4E5969' }}
            />
          }
        />
      ),
      boolean: props => (
        <Select
          key={props.key}
          className="authing-g2-select"
          suffixIcon={
            <IconFont
              type="authing-arrow-down-s-line"
              className="authing-select-down-arrow"
            />
          }
          options={[
            { label: i18n.t('common.yes'), value: true as any },
            { label: i18n.t('common.no'), value: false as any }
          ]}
          menuItemSelectedIcon={
            <IconFont
              type="authing-check-fill"
              style={{ fontSize: 16, color: '#4E5969' }}
            />
          }
        />
      ),
      string: props => (
        <Input
          key={props.key}
          type="text"
          size="large"
          className="authing-g2-input"
          autoComplete="off"
        />
      ),
      text: props => (
        <Input
          key={props.key}
          type="text"
          size="large"
          className="authing-g2-input"
          autoComplete="off"
        />
      )
    }),
    [countryList]
  )
  const internalControlMap: Record<
    string,
    (props: any) => React.ReactNode | undefined
  > = useMemo(
    () => ({
      username: (props: any) => (
        <CustomFormItem.UserName
          validateFirst={true}
          className="authing-g2-input-form"
          name="username"
          key={props.key}
          label={props.label ?? i18n.t('common.username')}
          required={props.required}
          checkRepeat={true}
        >
          <Input
            className="authing-g2-input"
            autoComplete="username"
            key="internal-username:asdf"
            size="large"
            maxLength={11}
            placeholder={t('login.inputUsername') as string}
          />
        </CustomFormItem.UserName>
      ),
      phone: (props: { required?: boolean; label?: string }) => (
        <>
          <CustomFormItem.Phone
            validateFirst={true}
            className={
              isInternationSms
                ? 'authing-g2-input-form remove-padding'
                : 'authing-g2-input-form'
            }
            name="phone"
            key="internal-phone:phone"
            label={props.label ?? i18n.t('common.phoneLabel')}
            required={props.required}
            checkRepeat={true}
            areaCode={areaCode}
          >
            <PhoneAccount name="phone" />
          </CustomFormItem.Phone>
          <CommonFormItem
            validateTrigger={['onBlur', 'onChange']}
            className="authing-g2-input-form"
            name="phoneCode"
            key="internal-phone:code"
            rules={
              props.required
                ? fieldRequiredRule(t('common.captchaCode'))
                : undefined
            }
          >
            <SendCodeByPhone
              name="phoneCode"
              isInternationSms={isInternationSms}
              areaCode={areaCode}
              className="authing-g2-input g2-send-code-input"
              autoComplete="one-time-code"
              size="large"
              placeholder={
                t('common.inputFourVerifyCode', {
                  length: verifyCodeLength
                }) as string
              }
              scene={SceneType.SCENE_TYPE_COMPLETE_PHONE}
              maxLength={verifyCodeLength}
              fieldName="phone"
              form={form}
              onSendCodeBefore={() => form.validateFields(['phone'])}
            />
          </CommonFormItem>
        </>
      ),
      email: (props: { required?: boolean; label?: string }) => (
        <>
          <CustomFormItem.Email
            className="authing-g2-input-form"
            name="email"
            checkRepeat={true}
            label={props.label ?? i18n.t('common.email')}
            required={props.required}
            key="internal email:email13"
            validateFirst={true}
          >
            <CommonInput
              name="email"
              className="authing-g2-input"
              autoComplete="email"
              size="large"
              placeholder={t('login.inputEmail') as string}
            />
          </CustomFormItem.Email>
          <CommonFormItem
            validateTrigger={['onBlur', 'onChange']}
            className="authing-g2-input-form"
            name="emailCode"
            key="internal email:code1432"
            rules={
              props.required
                ? fieldRequiredRule(t('common.captchaCode'))
                : undefined
            }
          >
            <SendCodeByEmail
              name="emailCode"
              className="authing-g2-input g2-send-code-input"
              autoComplete="one-time-code"
              size="large"
              placeholder={
                t('common.inputFourVerifyCode', {
                  length: verifyCodeLength
                }) as string
              }
              maxLength={verifyCodeLength}
              data={''}
              scene={EmailScene.INFORMATION_COMPLETION_VERIFY_CODE}
              fieldName="email"
              form={form}
              onSendCodeBefore={() => form.validateFields(['email'])}
            />
          </CommonFormItem>
        </>
      )
    }),
    [PhoneAccount, areaCode, form, isInternationSms, t, verifyCodeLength]
  )

  const getMetaDateLabel = useCallback(
    (metaData: CompleteInfoMetaData) => {
      let label = ''

      const fieldsI18n = config.extendsFieldsI18n?.[metaData.name]

      const currentLng = getCurrentLng()

      if (fieldsI18n?.[currentLng]?.enabled && fieldsI18n?.[currentLng].value) {
        label = fieldsI18n?.[currentLng].value
      } else {
        label = metaData.label || metaData.name
      }

      return label
    },
    [config.extendsFieldsI18n]
  )

  const generateRules = useCallback(
    (metaData: CompleteInfoMetaData) => {
      const formRules = []

      const label = getMetaDateLabel(metaData)

      const rules = metaData.validateRules ?? []

      const required = metaData.required ?? false

      if (required) {
        formRules.push({
          type:
            metaData.type === CompleteInfoExtendsControls.DATE_TIME
              ? ('object' as const)
              : undefined,
          required: true,
          validateTrigger: 'onChange',
          message: t('login.noEmpty', { label: label })
        })
      }

      // TODO 后端的 rule Type 有很多 前端目前只做了两种的映射
      rules.forEach(rule => {
        if (rule.type === 'isNumber') {
          return formRules.push({
            type: 'number',
            validateTrigger: 'onBlur',
            message: rule.errorMessage || '请填写数字'
          })
        }

        if (rule.type === 'regExp') {
          return formRules.push({
            validateTrigger: 'onBlur',
            pattern: new RegExp((rule.content as any).replaceAll('/', '')),
            message: rule.errorMessage
          })
        }
      })

      return formRules
    },
    [getMetaDateLabel, t]
  )

  const inputElement = useCallback(
    (metaData: CompleteInfoMetaData) => {
      // const label =
      //   i18n.language === 'zh-CN'
      //     ? metaData.label || metaData.name
      //     : metaData.name
      const label = getMetaDateLabel(metaData)

      // 这部分的控件分两种 一个集成控件（手机号 + 验证码）一种是基础控件 分开处理
      if (
        (
          Object.values(CompleteInfoBaseControls) as (
            | CompleteInfoBaseControls
            | CompleteInfoExtendsControls
          )[]
        ).includes(metaData.type)
      ) {
        return internalControlMap[metaData.name]({
          required: metaData.required,
          label: label
        })
      } else {
        const userFormItem = (children: React.ReactNode) => (
          <Form.Item
            validateTrigger={['onBlur', 'onChange']}
            className="authing-g2-input-form"
            rules={generateRules(metaData)}
            key={metaData.name}
            name={metaData.name}
            label={label}
            style={{ marginBottom: 24 }}
          >
            {children}
          </Form.Item>
        )
        // 国家名和性别的控件需要单独和name匹配
        if (['country', 'gender'].includes(metaData.name)) {
          return userFormItem(
            baseControlMap[metaData.name]({
              options: metaData.options,
              key: metaData.name
            })
          )
        } else if (Object.keys(baseControlMap).includes(metaData.type)) {
          return userFormItem(
            baseControlMap[metaData.type]({
              options: metaData.options,
              key: metaData.name
            })
          )
        }
        return userFormItem(
          <Input type="text" className="authing-g2-input" autoComplete="off" />
        )
      }
    },
    [baseControlMap, generateRules, getMetaDateLabel, internalControlMap]
  )

  const formFieldsV2 = useMemo(() => {
    return metaData.map(data => inputElement(data))
  }, [inputElement, metaData])

  const [, onFinish] = useAsyncFn(
    async (values: any) => {
      const fieldKeys = Object.keys(values)
        // 先过滤掉 为空的字段
        .filter(key => values[key] !== undefined && values[key] !== '')

      submitButtonRef.current?.onSpin(true)

      const fieldValues = fieldKeys
        // 再过滤掉 两个验证码的字段
        .filter(key => !['phoneCode', 'emailCode'].includes(key))
        .map(key => {
          const baseData = {
            name: key,
            value: values[key]
          }
          // 给这两个字段添加一个验证码
          // 国际化短信 需要携带区号
          // TODO 默认这里手机号与邮箱 都是有验证码的
          if (key === 'phone') {
            if (isInternationSms) {
              const { countryCode } = parsePhone(
                isInternationSms,
                values[key],
                areaCode
              )
              return {
                ...baseData,
                code: values.phoneCode,
                phoneCountryCode: countryCode
              }
            }

            return { ...baseData, code: values.phoneCode }
          }
          if (key === 'email') return { ...baseData, code: values.emailCode }
          return baseData
        })

      try {
        // 对特殊字段提前进行 precheck 不然直接调用注册接口失败也会导致上一步验证码失效
        // 用户名 check
        if (fieldKeys.includes('username')) {
          const { data: checkResult, code: checkCode } = await get(
            '/api/v2/users/is-user-exists',
            {
              username: values.username
            }
          )
          // checkResult 为 true 时 代表用户名已存在 直接报message 并且不调用注册接口
          if (checkCode === 200 && checkResult) {
            message.error(t('common.userNameIsExists'))
            return
          }
        }
        // 手机验证码check
        if (fieldKeys.includes('phone')) {
          const options: any = {
            phone: values.phone,
            phoneCode: values.phoneCode
          }
          if (isInternationSms) {
            const { countryCode } = parsePhone(
              isInternationSms,
              values.phone,
              areaCode
            )
            options.phoneCountryCode = countryCode
          }
          const {
            statusCode: checkCode,
            data: { valid, message: checkMessage }
          } = await post('/api/v2/sms/preCheckCode', options)
          if (checkCode !== 200 || !valid) {
            message.error(checkMessage)
            return
          }
        }
        // 邮箱验证码check
        if (fieldKeys.includes('email')) {
          const {
            statusCode: checkCode,
            data: { valid, message: checkMessage }
          } = await post('/api/v2/email/preCheckCode', {
            email: values.email,
            emailCode: values.emailCode
          })
          if (checkCode !== 200 || !valid) {
            message.error(checkMessage)
            return
          }
        }

        await businessRequest?.({ fieldValues })
      } catch (error) {
        // TODO
        // throw new Error(error)
      } finally {
        submitButtonRef.current?.onSpin(false)
      }
    },
    [areaCode]
  )

  const [requiredNames, setRequiredNames] = useState<string[]>([])

  useEffect(() => {
    let names: string[] = []
    metaData.forEach(item => {
      if (item.required) {
        names.push(item.name)
      }
    })
    setRequiredNames(names)
  }, [metaData])

  const [btnDisabled, setDisabled] = useState<boolean>(true)

  const onValuesChange = (
    _: Record<string, any>,
    allValues: Record<string, any>
  ) => {
    setDisabled(isDisabled(allValues, requiredNames))
  }

  useEffect(() => {
    setDisabled(isDisabled({}, requiredNames))
  }, [])

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={onFinish}
      onSubmitCapture={() => submitButtonRef.current.onSpin(true)}
      onFinishFailed={() => submitButtonRef.current.onError()}
      onValuesChange={onValuesChange}
      className="authing-g2-completeInfo-form authing-g2-form-required-item-icon-after"
    >
      <div className="authing-g2-completeInfo-form-content">{formFieldsV2}</div>

      <Form.Item className="authing-g2-sumbit-form">
        <SubmitButton
          disabled={btnDisabled}
          text={t('common.problem.form.submit') as string}
          ref={submitButtonRef}
          className="password g2-completeInfo-submit"
        />
      </Form.Item>
    </Form>
  )
}
