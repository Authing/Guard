/** Only normal registration/login submissions carry the page human proof. */
export const needsTurnstileProof = (url: string, data?: any) => {
  let path = url.split('?')[0]
  if (/^https?:\/\//.test(path)) path = new URL(path).pathname
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
