export const mock = {
  code: 1636,
  statusCode: 301,
  apiCode: 1636,
  message: '需要进行二次认证',
  data: {
    mfaToken:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJQb29sSWQiOiI2NWIwYTVkODc1OGNlYWQ3NDM2OGI2YmYiLCJ1c2VySWQiOiI2NWQ0NGFiMzllNzhmNDJhY2U3MGY5Y2EiLCJhcm4iOiJhcm46Y246YXV0aGluZzo2NWIwYTVkODc1OGNlYWQ3NDM2OGI2YmY6dXNlcjo2NWQ0NGFiMzllNzhmNDJhY2U3MGY5Y2EiLCJzdGFnZSI6MX0sImlhdCI6MTcxNzAzOTk2NSwiZXhwIjoxNzE3MDQwMzI1fQ.yr5PprYssJxJhdQi_0kYpQtHXrK7DX4l0R-858p6he8',
    nickname: null,
    email: null,
    phoneCountryCode: null,
    mfaPhone: '18513110679',
    mfaEmail: null,
    mfaPhoneCountryCode: '+86',
    username: 'dft',
    avatar: 'https://files.authing.co/authing-console/default-user-avatar.png',
    passkeyEnabled: false,
    faceMfaEnabled: false,
    totpMfaEnabled: false,
    ningDonMfaEnable: true,
    applicationMfa: [
      {
        mfaPolicy: 'EMAIL',
        status: 1,
        sort: 0
      },
      {
        mfaPolicy: 'FACE',
        status: 1,
        sort: 0
      },
      {
        mfaPolicy: 'OTP',
        status: 1,
        sort: 0
      },
      {
        mfaPolicy: 'PASSKEY',
        status: 1,
        sort: 0
      },
      {
        mfaPolicy: 'SMS',
        status: 1,
        sort: 0
      },
      {
        mfaPolicy: 'NINGDON',
        status: 1,
        sort: 0
      }
    ],
    customPasswordStrength: {
      enabled: false,
      zhMessageOpen: false,
      enMessageOpen: false,
      twMessageOpen: false,
      jpMessageOpen: false
    },
    passwordStrength: 0,
    customPasswordRuleConfig: {
      passwordLength: 6,
      passwordMaxLength: 35,
      passwordRuleConfig: {
        number: false,
        uppercaseLetter: false,
        lowercaseLetter: false,
        commonSymbol: false,
        consecutiveCharacter: false,
        singleCharacter: false,
        accountUsername: false,
        commonPassword: false,
        passwordStrengthTypeDigit: 0
      },
      specificPassword: [],
      specificPasswordEnable: false
    },
    forcedCycleUnit: 'MONTH',
    enableFirstLoginResetPasswordVerifyPhone: false
  },
  flowHandle: '56d2dc23-c02f-475d-b640-e1f3acfb4e7f'
}
export default mock
