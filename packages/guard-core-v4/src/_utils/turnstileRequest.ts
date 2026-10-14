const requestPath = (url: string) => {
  let path = url.split('?')[0]
  if (/^https?:\/\//.test(path)) path = new URL(path).pathname
  return path
}

/** Preserve a token already supplied by the caller or another transport. */
export const hasTurnstileToken = (url: string, data?: any) =>
  !!data &&
  (Object.prototype.hasOwnProperty.call(data, 'turnstileToken') ||
    (['/graphql', '/graphql/v2', '/v2/graphql'].includes(requestPath(url)) &&
      !!data.extensions &&
      Object.prototype.hasOwnProperty.call(data.extensions, 'turnstileToken')))

/** Business errors consume a raw token; MFA/next-step responses do not retry. */
export const turnstileSubmissionFailed = (data: any) => {
  if (Array.isArray(data?.errors) && data.errors.length) return true
  const status = data?.statusCode
  if (typeof status === 'number' && status >= 300 && status < 400) return false
  if (typeof status === 'number' && (status >= 400 || status < 0)) return true
  const code = data?.code
  return (
    typeof code === 'number' && code !== 2000 && !(code >= 200 && code < 300)
  )
}

/** Only normal registration/login submissions carry the raw human token. */
export const needsTurnstileProof = (url: string, data?: any) => {
  const path = requestPath(url)
  if (['/graphql', '/graphql/v2', '/v2/graphql'].includes(path))
    return (
      typeof data?.query === 'string' &&
      /\bmutation\b/.test(data.query) &&
      /\b(?:login|loginByEmail|loginByUsername|loginByPhonePassword|loginByPhoneCode|loginBySubAccount|register|registerByEmail|registerByUsername|registerByPhoneCode)\s*\(/.test(
        data.query
      )
    )
  return (
    /^\/api\/v2\/(?:login\/|register[-/])/.test(path) ||
    [
      '/api/v3/signin',
      '/api/v3/frontend-signin',
      '/api/v3/signup',
      '/api/v3/signup-by-invitation'
    ].includes(path)
  )
}
