import React, { useEffect } from 'react'

import { useGuard } from '@authing/guard-react'

export default function Login() {
  const guard = useGuard()

  useEffect(() => {
    guard.start('#root').then(userInfo => {
      console.log('userInfo from guard.start: ', userInfo)
    })
  }, [])

  return <div id="guard">this is login Page</div>
}
