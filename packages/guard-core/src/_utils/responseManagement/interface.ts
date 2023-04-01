import { GuardModuleType } from '../../Guard'

export enum CodeAction {
  // 切换 Module
  CHANGE_MODULE = 'changeModule',
  // 渲染 错误信息
  RENDER_MESSAGE = 'renderMessage',
  // 流程 结束
  FLOW_END = 'flowEnd'
}

export enum ApiCode {
  IDENTITY_BINDING_ASK = 1641,

  IDENTITY_BINDING = 1640,

  IDENTITY_BINDING_NO_ASK = 1666,

  APP_MFA = 1636,

  MFA = 1635,

  ABORT_FLOW = 1699,

  COMPLETE_INFO = 1642,

  UNLOCK = 1643,

  FLOW_END = 1600,

  FIRST_LOGIN_PASSWORD = 1639,

  FORCED_PASSWORD_RESET = 2058,

  UNSAFE_PASSWORD_TIP = 2061,

  UNSAFE_PASSWORD_RESET = 2071,

  FLOW_SELECT_ACCOUNT = 2921,

  TENANT_PORTAL = 1644,

  RESET_ACCOUNT_NAME = 1108 // 用户名重复
}

export const ChangeModuleApiCodeMapping: Record<string, GuardModuleType> = {
  [ApiCode.IDENTITY_BINDING]: GuardModuleType.IDENTITY_BINDING,
  [ApiCode.IDENTITY_BINDING_ASK]: GuardModuleType.IDENTITY_BINDING_ASK,
  [ApiCode.IDENTITY_BINDING_NO_ASK]: GuardModuleType.IDENTITY_BINDING_NO_ASK,
  [ApiCode.RESET_ACCOUNT_NAME]: GuardModuleType.RESET_ACCOUNT_NAME,
  [ApiCode.APP_MFA]: GuardModuleType.MFA,
  [ApiCode.MFA]: GuardModuleType.MFA,
  [ApiCode.ABORT_FLOW]: GuardModuleType.LOGIN,
  [ApiCode.COMPLETE_INFO]: GuardModuleType.LOGIN_COMPLETE_INFO,
  [ApiCode.FIRST_LOGIN_PASSWORD]: GuardModuleType.FIRST_LOGIN_PASSWORD,
  [ApiCode.FORCED_PASSWORD_RESET]: GuardModuleType.FORCED_PASSWORD_RESET,
  [ApiCode.UNLOCK]: GuardModuleType.SELF_UNLOCK,
  [ApiCode.UNSAFE_PASSWORD_RESET]: GuardModuleType.UNSAFE_PASSWORD_RESET,
  [ApiCode.FLOW_SELECT_ACCOUNT]: GuardModuleType.FLOW_SELECT_ACCOUNT,
  [ApiCode.TENANT_PORTAL]: GuardModuleType.TENANT_PORTAL
}
