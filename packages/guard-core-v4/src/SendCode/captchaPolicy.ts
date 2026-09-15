import { ApplicationConfig } from '../Type/application'

// Sending codes and finding users consume separate captchas. When the new
// policy is enabled, move existing send-code challenges into the same inline verification queue.
export const needsSendCodeCaptcha = (
  config: ApplicationConfig,
  channel: 'phone' | 'email',
  scene: string
): boolean => {
  if (!config.enableUserExistenceCheckCaptcha) return false
  const policy =
    channel === 'phone'
      ? (
          {
            login: config.loginSmsConfig,
            register: config.registerSmsConfig,
            reset: config.forgetPasswordSmsConfig
          } as Record<string, typeof config.loginSmsConfig>
        )[scene]
      : (
          {
            LOGIN_VERIFY_CODE: config.loginEmailConfig,
            REGISTER_VERIFY_CODE: config.registerEmailConfig,
            RESET_PASSWORD_VERIFY_CODE: config.forgetPasswordEmailConfig
          } as Record<string, typeof config.loginEmailConfig>
        )[scene]
  return policy?.robot?.switch === 'ON'
}
