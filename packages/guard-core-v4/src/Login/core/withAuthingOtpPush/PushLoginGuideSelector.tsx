import { Select } from 'shim-antd'

import '@antd-es-style/select/style/index.less'

import { React } from 'shim-react'

import { SelectorOptions, Selector } from './types'

interface PushLoginGuideSelectorProps {
  defaultValue: Selector
  onChange: (value: Selector) => void
  options: SelectorOptions
}

export function PushLoginGuideSelector(props: PushLoginGuideSelectorProps) {
  const { defaultValue, onChange, options } = props

  return (
    <Select
      defaultValue={defaultValue}
      onChange={onChange}
      options={options}
      dropdownMatchSelectWidth={false}
      showArrow={true}
    />
  )
}
