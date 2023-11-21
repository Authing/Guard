import { FormInstance } from 'shim-antd/lib/form'

import { Form, FormItemProps } from 'shim-antd'

import '@antd-lib-style/form/style/index.less'

import { PasswordFormItem } from './PasswordFormItem'

import {
  EmailFormItem,
  PhoneFormItem,
  UserNameFormItem,
  CustomNameFormItem
} from './ValidatorFormItem'

export * from './PasswordFormItem'

export * from './ValidatorFormItem'

export * from './useCheckRepeat'

export interface ValidatorFormItemProps extends FormItemProps {
  form?: FormInstance
  checkRepeat?: boolean
  checkExist?: boolean
  areaCode?: string //国际化区号
  /**
   * 控制内部FormItem组件关于pattern的校验规则
   */
  isCheckPattern?: boolean
}

export interface ValidatorFormItemMetaProps extends ValidatorFormItemProps {
  method: 'email' | 'phone' | 'username' | string
}

export interface ICheckProps {
  check: (values: any) => void
}

type InternalFormItemType = typeof Form.Item

interface FormItemInterface extends InternalFormItemType {
  Password: typeof PasswordFormItem
  Email: typeof EmailFormItem
  Phone: typeof PhoneFormItem
  UserName: typeof UserNameFormItem
  CustomName: typeof CustomNameFormItem
}

const CustomFormItem = Form.Item as FormItemInterface

CustomFormItem.Password = PasswordFormItem
CustomFormItem.Email = EmailFormItem
CustomFormItem.Phone = PhoneFormItem
CustomFormItem.UserName = UserNameFormItem
CustomFormItem.CustomName = CustomNameFormItem
export default CustomFormItem
