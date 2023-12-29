export enum GuardModuleType {
  ERROR = 'error', //错误页
  LOGIN = 'login', //登录页
  REGISTER = 'register', //注册页
  MFA = 'mfa', // 二次 mfa 认证页
  FORGET_PWD = 'forgetPassword', // 忘记密码页
  FORCED_PASSWORD_RESET = 'forcedPasswordReset', // 登陆安全策略 密码轮换页
  NOTICE_PASSWORD_RESET = 'noticePasswordReset', //提示修改密码页
  FIRST_LOGIN_PASSWORD = 'firstLoginPassword', //首次登录修改密码页
  UNSAFE_PASSWORD_RESET = 'unsafePasswordReset', // 密码强度不符合要求修改密码页
  DOWNLOAD_AT = 'downloadAT', //下载 Authenticator 页
  BIND_TOTP = 'bindTotp', // 绑定 TOTP页
  ANY_QUESTIONS = 'anyQuestions', // 问题反馈页
  LOGIN_COMPLETE_INFO = 'loginCompleteInfo', // 登录信息补全
  REGISTER_PASSWORD = 'registerPassword', // 验证码注册拉起密码补全页
  REGISTER_COMPLETE_INFO = 'registerCompleteInfo', //注册信息补全页
  RECOVERY_CODE = 'recoveryCode', // MFA 恢复码展示页
  SUBMIT_SUCCESS = 'submitSuccess', // 提交成功展示页
  IDENTITY_BINDING_ASK = 'identityBindingAsk', // 身份源绑定 问询页
  IDENTITY_BINDING = 'identityBinding', // 身份源绑定页
  IDENTITY_BINDING_NO_ASK = 'identityBindingNoAsk', // 身份源绑定页不问询
  SELF_UNLOCK = 'selfUnlock', // 自助解锁页
  FLOW_SELECT_ACCOUNT = 'flowSelectAccount', // 选择登录账号
  /** 多租户门户选择页 */
  TENANT_PORTAL = 'tenant-portal',
  New_SUBMIT_SUCCESS = 'newSubmitSuccess', // 提交成功展示页
  SELECT_ACCOUNT_2_LOGIN = 'selectAccout2Login', // 选择登录身份
  RESET_ACCOUNT_NAME = 'resetAccountName'
  // JOIN_TENANT = 'joinTenant' // 加入租户
}
export interface GuardModuleAction {
  action: string
  module?: GuardModuleType
  message?: string
  initData?: any
}
