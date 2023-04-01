import { AuthenticationClient, CommonMessage } from 'authing-js-sdk'

import { IG2Config, IG2Events, IG2FCProps } from '../Type'

export interface ForgetPasswordEvents extends IG2Events {
  onPwdEmailSend?: (authClient: AuthenticationClient) => void
  onPwdEmailSendError?: (error: CommonMessage, authClient: AuthenticationClient) => void
  onPwdPhoneSend?: (authClient: AuthenticationClient) => void
  onPwdPhoneSendError?: (error: CommonMessage, authClient: AuthenticationClient) => void
  onPwdReset?: (authClient: AuthenticationClient) => void
  onPwdResetError?: (error: CommonMessage, authClient: AuthenticationClient) => void
}

export interface ForgetPasswordConfig extends IG2Config {}

export interface ForgetPasswordProps extends IG2FCProps, ForgetPasswordEvents {
  config: Partial<IG2Config>
}
