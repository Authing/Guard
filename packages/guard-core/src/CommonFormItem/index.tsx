import { React } from 'shim-react'

import { Form, FormItemProps } from 'shim-antd'

import { FieldContext } from './context'

type Status = 'blur' | 'focus'

const { cloneElement, isValidElement, useContext, useState, useMemo } = React

export const CommonFormItem = (props: FormItemProps) => {
  const [status, setStatus] = useState<Status>('blur')

  return (
    <FieldContext.Provider
      value={{
        setStatus: val => {
          if (val !== status) {
            setStatus(val)
          }
        }
      }}
    >
      <Item {...props} inputstatus={status} />
    </FieldContext.Provider>
  )
}

interface ItemProps extends FormItemProps {
  inputstatus: Status
}

export const Item = (props: ItemProps) => {
  const context = useContext(FieldContext)
  const child = props.children

  let returnChildNode = null

  if (isValidElement(child)) {
    returnChildNode = cloneElement(child, {
      // @ts-ignore
      ...child.props,
      fieldcontext: context
    })
  }

  // const handleItemChange = (itemValue: string) => {
  //   console.log(`value:`, itemValue)
  //   // 处理当前表单项的值
  //   setCurrent(itemValue)
  // }

  const status = useMemo<Status>(() => {
    console.log('inputStatus: ', props.inputstatus)
    if (props.initialValue) {
      return 'focus'
    }
    return props.inputstatus
  }, [props.inputstatus, props.initialValue])

  return (
    <Form.Item
      {...props}
      colon={false}
      className={`authing-g2-input-form-new authing-g2-input-form-new--${status} ${props.className}`}
    >
      {returnChildNode}
    </Form.Item>
  )
}
