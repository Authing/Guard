// Captcha images replace a shared HttpOnly cookie. Keep image + request pairs
// sequential, including queries for different fields in the same form.
let tail: Promise<unknown> = Promise.resolve()

export const enqueueCaptchaRequest = <T>(
  request: () => Promise<T>
): Promise<T> => {
  const result = tail.then(request)
  tail = result.catch(() => undefined)
  return result
}
