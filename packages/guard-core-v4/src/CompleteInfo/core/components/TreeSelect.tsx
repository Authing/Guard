import { Select } from 'shim-antd'
import { React } from 'shim-react'
const { useState } = React
// !! 高教社专用
export type OptionType = {
  id: string
  name: string
  children: OptionType[]
}
interface TreeSelectProps {
  options: OptionType[]
}
/**
 * description: 查询返回条件 当前为 模糊查询 只要路径中存在包含的项即返回
 * @param options 树状结构的数据
 * @param search 当前查询的key
 */
const filter = (options: OptionType[], search: string) => {
  return options.some(option =>
    option.name.toLowerCase().includes(search.toLowerCase())
  )
}
/**
 * description: label 生成器
 * @param pathOptions 树状结构的数据
 */
const render = (pathOptions: OptionType[]) => {
  return pathOptions.map(option => option.name).join(' / ')
}
/**
 *
 * @param options 树状结构的数据
 * @param searchValue 查询key
 * @param limit 显示的条数
 */
const useSearchOptions = (
  options: OptionType[],
  searchValue: string,
  limit = 10
) => {
  return React.useMemo(() => {
    const filterOptions: any[] = []

    if (!searchValue) {
      return []
    }
    /**
     *
     * @param list 数据列表
     * @param prePath 前置路径
     */
    function dig(list: OptionType[], preOption: OptionType[]) {
      list.forEach(option => {
        // 限制过长的查询
        if (limit && filterOptions.length >= limit) {
          return
        }
        const nextoption = [...preOption, option]
        // 最深子节点
        if (!option.children || option.children.length === 0) {
          if (filter(nextoption, searchValue)) {
            filterOptions.push({
              label: render(nextoption),
              value: option.id
            })
          }
        }
        if (option.children) {
          dig(option.children, nextoption)
        }
      })
    }

    dig(options, [])

    return limit > 0 ? filterOptions.slice(0, limit as number) : filterOptions
  }, [limit, options, searchValue])
}

const TreeSelect: React.FC<TreeSelectProps> = ({
  options,
  ...selectOptions
}) => {
  const [searchValue, setSearchValue] = useState<string>('')
  const filterOptions = useSearchOptions(options, searchValue)
  return (
    <Select
      className="authing-g2-select"
      filterOption={false}
      showSearch
      notFoundContent={null}
      showArrow={false}
      onSearch={value => setSearchValue(value)}
      options={filterOptions}
      {...selectOptions}
    />
  )
}

export default TreeSelect
