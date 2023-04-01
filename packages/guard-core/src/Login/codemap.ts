import { ErrorCode } from '../_utils/GuardErrorCode'

import { GuardModuleAction, GuardModuleType } from '../Guard/module'

import { MFAType } from '../MFA/interface'

export const codeMap: Record<number, GuardModuleAction> = {
  [ErrorCode.APP_MFA_CODE]: {
    // 跳转去 mfa 验证
    action: 'changeModule',
    module: GuardModuleType.MFA
  },
  [ErrorCode.OTP_MFA_CODE]: {
    // 跳转去 mfa 验证
    action: 'changeModule',
    module: GuardModuleType.MFA,
    initData: {
      current: MFAType.TOTP,
      totpMfaEnabled: true
    }
  },
  [ErrorCode.INPUT_CAPTCHACODE]: {
    // 需要输入图形验证码
    action: 'message'
  },
  500: {
    action: 'message'
  },
  1002: {
    // 登录太频繁
    action: 'message'
  },
  2820002: {
    // ldap url报错信息
    action: 'message'
  },
  2333: {
    // 密码错误
    action: 'message'
  },
  2057: {
    // 多次错误登录导致账号锁定
    action: 'accountLock'
  },
  2005: {
    // 账号锁定
    action: 'accountLock'
  },
  2042: {
    // 禁止未验证邮箱注册
    action: 'message'
  },
  2001: {
    // 验证码过期
    action: 'message'
  },
  1576: {
    action: 'message'
  },
  2029: {
    action: 'message'
  },
  3720001: {
    // 01 02 03 计量计费相关
    action: 'message'
  },
  3720002: {
    action: 'message'
  },
  3720003: {
    action: 'message'
  },
  2130010: {
    // 无权登录此应用
    action: 'message'
  },
  2120008: {
    action: 'message'
  },
  2031: {
    // 禁止注册
    action: 'message'
  },
  1640: {
    action: 'changeModule',
    module: GuardModuleType.IDENTITY_BINDING
  },
  1641: {
    action: 'changeModule',
    module: GuardModuleType.IDENTITY_BINDING_ASK
  },
  1642: {
    action: 'changeModule',
    module: GuardModuleType.LOGIN_COMPLETE_INFO
  },
  1666: {
    action: 'changeModule',
    module: GuardModuleType.IDENTITY_BINDING_NO_ASK
  },
  1108: {
    action: 'changeModule',
    module: GuardModuleType.RESET_ACCOUNT_NAME
  },
  // 1643: {},
  408: {
    action: 'message'
  }
}
