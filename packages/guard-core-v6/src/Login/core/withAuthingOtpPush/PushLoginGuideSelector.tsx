import { Select } from 'shim-antd'

import { React } from 'shim-react'
import { IconFont } from '../../../IconFont'

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
      className="authing-ant-select-selector-new-box"
      menuItemSelectedIcon={
        <IconFont
          type="authing-check-fill"
          style={{ fontSize: 16, color: '#4E5969' }}
        />
      }
    />
  )
}
