import { useGuardPublicConfig } from '../_utils/context'

import omit from 'lodash/omit'

// 是否进行注册信息补全
export const useIsChangeComplete = (currentMode: 'phone' | 'email') => {
  const { extendsFields } = useGuardPublicConfig()

  const { complateFiledsPlace } = useGuardPublicConfig()

  // 开关控制 如果没有 register 就不开启了
  if (!complateFiledsPlace.includes('register')) {
    return false
  }
  // 排除掉已有的字段
  if (!Boolean(omit(extendsFields, currentMode)) || extendsFields.length === 0) {
    // 为空就不补了～
    return false
  }

  // 字段唯一 切 与注册的方式相同 就不补了
  if (extendsFields.length === 1 && extendsFields[0].name === currentMode) {
    return false
  }

  // 其他的补
  return true
}
