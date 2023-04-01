import { React } from 'shim-react'

const { useCallback, useState } = React

export const useCheckRepeat = (
  checkFn: (value: any, resolve: (value: unknown) => void, reject: (reason?: any) => void) => void
) => {
  const [timer, setTimer] = useState<NodeJS.Timeout>()

  const checkRepeat = useCallback(
    async (_: any, value: any) => {
      if (timer) {
        clearTimeout(timer)
      }

      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          checkFn(value, resolve, reject)
        }, 500)

        setTimer(timeout)
      })
    },
    [checkFn, timer]
  )

  return checkRepeat
}
