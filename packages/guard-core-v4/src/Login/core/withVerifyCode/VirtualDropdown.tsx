import { React } from 'shim-react'

import { Select, Tooltip } from 'shim-antd'

import { internationalPhoneOptions } from '../../../_utils/internationalPhone'

import './styles.less'

import { IconFont } from '../../../IconFont'

import { i18n } from '../../../_utils/locales'

export interface VirtualDropdownProps {
  /**
   * 回填的国际化区号
   */
  regionCode?: string
  value?: string
  onChange?: (value: string) => void
  style?: React.CSSProperties
}
export const VirtualDropdown: React.FC<VirtualDropdownProps> = props => {
  const { value, onChange } = props

  const resolvedLanguage = i18n.resolvedLanguage ?? i18n.language

  // 只能单次遍历了

  // const [open, setOpen] = useState(false)
  const options = internationalPhoneOptions.map(info => {
    const countryName = resolvedLanguage.startsWith('zh')
      ? info.regions
      : info.regions_en
    return {
      value: info.selection,
      key: info.selection,
      children: info.dialPrefix,
      label: (
        <div className="select-option-item">
          <span>{info.dialPrefix}</span>
          <div className="country">
            <Tooltip title={`${countryName} (${info.dialPrefix})`}>
              {countryName}
            </Tooltip>
          </div>
        </div>
      ),
      region: info.regions,
      region_en: info.regions_en,
      dialPrefixes: [info.dialPrefix]
    }
  })

  // 现在需要回填国际化短信

  return (
    <Select
      showSearch
      popupClassName="areacode-virtual-dropdown"
      bordered={false}
      listHeight={258}
      options={options}
      value={value}
      onChange={onChange}
      onClick={e => {
        e.preventDefault()
        e.stopPropagation()
      }}
      optionLabelProp="children"
      dropdownMatchSelectWidth={190}
      filterOption={(input, option: any) => {
        const query = input.replace(/\s/g, '').toLowerCase()
        if (option.value.toLowerCase().includes(query)) return true
        if (option.dialPrefixes?.some((code: string) => code.includes(query))) {
          return true
        }
        if (option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0) {
          return true
        }
        if (option.region.toLowerCase().indexOf(input.toLowerCase()) >= 0) {
          return true
        }
        if (option.region_en.toLowerCase().indexOf(input.toLowerCase()) >= 0) {
          return true
        }
        return false
        // return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }}
      suffixIcon={
        <>
          <IconFont
            className={'areacode-virtual-dropdown-icon'}
            type={'authing-arrow-down-s-fill'}
            style={{ width: 20, height: 20 }}
          />
        </>
      }
    />
  )
}
