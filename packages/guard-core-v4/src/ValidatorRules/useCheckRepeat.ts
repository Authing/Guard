import { React } from 'shim-react'

const { useCallback, useRef } = React

export const useCheckRepeat = (
  checkFn: (
    value: any,
    resolve: (value: unknown) => void,
    reject: (reason?: any) => void
  ) => void,
  scope = ''
) => {
  const latestCheck = useRef(checkFn)
  latestCheck.current = checkFn
  const pending = useRef(new Map<any, Promise<unknown>>())

  // Submit and send-code validation can overlap. Share an in-flight check for
  // the same value; never cache results or reuse a consumed captcha.
  return useCallback(
    (_: any, value: any) => {
      const key = JSON.stringify([scope, value])
      const existing = pending.current.get(key)
      if (existing) return existing
      const result = new Promise((resolve, reject) => {
        latestCheck.current(value, resolve, reject)
      })
      pending.current.set(key, result)
      const clear = () => pending.current.delete(key)
      result.then(clear, clear)
      return result
    },
    [scope]
  )
}
