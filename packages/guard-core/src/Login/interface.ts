import { getDefaultG2Config, IG2Config, IG2Events, IG2FCProps, IG2FCViewProps } from '../Type'

import { AuthenticationClient, User } from 'authing-js-sdk'

import { QrCodeAuthenticationClient } from 'authing-js-sdk/build/main/lib/authentication/QrCodeAuthenticationClient'

import { Agreement, LoginMethods, SocialConnectionProvider } from '../Type/application'

export interface LoginConfig extends IG2Config {
  autoRegister?: boolean
  disableResetPwd?: boolean
  disableRegister?: boolean
  defaultLoginMethod?: LoginMethods
  loginMethods?: LoginMethods[]
  passwordLoginMethods?: string[]
  socialConnections?: SocialConnectionProvider[]
  socialConnectionsBtnShape?: 'default' | 'button' | 'icon'
  enterpriseConnections?: string[]
  qrCodeScanOptions?: Parameters<QrCodeAuthenticationClient['startScanning']>[1]
  publicKey?: string
  agreementEnabled?: boolean
  agreements?: Agreement[]
  /**
   * 关闭二维码状态check轮询(console上使用)
   */
  _closeLoopCheckQrcode?: boolean
}

export interface LoginEvents extends IG2Events {
  onLogin?: (user: User, authClient: AuthenticationClient) => void
  onLoginError?: (errorMessages: any) => void
  onLoginTabChange?: (activeTab: LoginMethods) => void
  onBeforeLogin?: (
    // TODO 具体的类型定义
    loginInfo: any,
    authClient: AuthenticationClient
  ) => boolean | Promise<boolean>
}

export interface GuardLoginProps extends IG2FCProps, LoginEvents {
  config?: Partial<LoginConfig>
}
export interface GuardLoginViewProps extends GuardLoginProps, IG2FCViewProps {
  config: LoginConfig
}

export interface GuardLoginInitData {
  specifyDefaultLoginMethod?: LoginMethods //指定登录页默认登录方式
  _firstItemInitialValue?: string //第一个输入框的回填值
  _lockMethod?: string //锁定登录方式
}

export const getDefaultLoginConfig = (): LoginConfig => ({
  ...getDefaultG2Config()
})
