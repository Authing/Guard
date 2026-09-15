export const getCaptchaUrl = (host: string, userPoolId?: string) => {
  const url = new URL(host)
  url.pathname = '/api/v2/security/captcha'
  url.search = `?r=${+new Date()}`
  if (userPoolId) url.searchParams.set('userpool_id', userPoolId)
  return url.href
}
