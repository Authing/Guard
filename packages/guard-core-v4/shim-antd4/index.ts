import './index.less'
export * from 'antd'

export * from '@ant-design/icons'
/**
 * optimize bundle locale
 */
import zhCN from 'antd/lib/locale/zh_CN'
import enUS from 'antd/lib/locale/en_US'
import jaJP from 'antd/lib/locale/ja_JP'
import zhTW from 'antd/lib/locale/zh_TW'

export const antdLocales = {
  zhCN,
  enUS,
  jaJP,
  zhTW
}
