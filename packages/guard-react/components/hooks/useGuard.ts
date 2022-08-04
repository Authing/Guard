import { useRef } from 'react'
import { Guard, GuardOptions } from '@authing/guard'

const useGuard = (options: GuardOptions): Guard => {
  const instance = useRef<Guard>()

  if (!instance.current) {
    instance.current = new Guard(options)
  }

  return instance.current
}

export { useGuard }
