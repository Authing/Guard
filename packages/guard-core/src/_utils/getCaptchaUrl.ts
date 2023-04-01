export const getCaptchaUrl = (host: string) => {
  const url = new URL(host)
  url.pathname = '/api/v2/security/captcha'
  url.search = `?r=${+new Date()}`
  return url.href
}
