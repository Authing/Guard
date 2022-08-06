import React, { useEffect } from 'react'
import { useGuard } from '@authing/guard-react'

export default function Login() {
  const guard = useGuard()

  useEffect(() => {
    guard.start('#root')
  }, [])
  return <div id="guard">this is login Page</div>
}
