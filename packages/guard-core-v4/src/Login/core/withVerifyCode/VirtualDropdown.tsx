import { React } from 'shim-react'

import { Select, Tooltip } from 'shim-antd'

import '@antd-lib-style/select/style/index.less'

import '@antd-lib-style/tooltip/style/index.less'

import { isoInfo, IsoType } from '../../../_utils/countryList'

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

  // 只能单次遍历了

  // const [open, setOpen] = useState(false)
  const options = isoInfo.map((info: IsoType) => {
    return {
      value: info.iso,
      key: info.iso,
      children: info.phoneCountryCode,
      label: (
        <div className="select-option-item">
          <span>{info.phoneCountryCode}</span>
          <div className="country">
            <Tooltip
              title={i18n.language === 'zh-CN' ? info.regions : info.regions_en}
            >
              {i18n.language === 'zh-CN' ? info.regions : info.regions_en}
            </Tooltip>
          </div>
        </div>
      ),
      region: info.regions,
      region_en: info.regions_en
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
      dropdownMatchSelectWidth={138}
      filterOption={(input, option: any) => {
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
