import { ErrorCode } from '../_utils/GuardErrorCode'

import { GuardModuleAction } from '../Guard/module'

export const codeMap: Record<number, GuardModuleAction> = {
  [ErrorCode.USER_EXISTENCE]: {
    action: 'message'
  },
  // 频繁注册
  1002: {
    action: 'message'
  },
  500: {
    action: 'message'
  },
  2001: {
    action: 'message'
  },
  // 01 02 03 计量计费相关
  3720001: {
    action: 'message'
  },
  3720002: {
    action: 'message'
  },
  3720003: {
    action: 'message'
  }
}
