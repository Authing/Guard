import { AuthenticationClient, CommonMessage, SceneType } from 'authing-js-sdk'

import { EmailScene, IG2Config, IG2Events, IG2FCProps, IG2FCViewProps } from '../Type'

export interface ForgetPasswordEvents extends IG2Events {
  onEmailSend?: (authClient: AuthenticationClient, sence?: EmailScene) => void
  onEmailSendError?: (
    error?: CommonMessage,
    authClient?: AuthenticationClient,
    sence?: EmailScene
  ) => void
  onPhoneSend?: (authClient: AuthenticationClient, sence?: SceneType) => void
  onPhoneSendError?: (
    error: CommonMessage,
    authClient: AuthenticationClient,
    sence?: SceneType
  ) => void
  onPwdReset?: (authClient: AuthenticationClient) => void
  onPwdResetError?: (error: CommonMessage, authClient: AuthenticationClient) => void
}

export interface ForgetPasswordConfig extends IG2Config {
  goBack?: null | (() => void)
}

export interface ForgetPasswordProps extends IG2FCProps, ForgetPasswordEvents {
  config: Partial<IG2Config>
}

export interface ForgetPasswordViewProps extends ForgetPasswordProps, IG2FCViewProps {
  config: IG2Config
}
