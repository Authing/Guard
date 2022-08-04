import React, { useEffect } from 'react'
import { useAuthing } from '@authing/react-guard'

export default function Login() {
  const guard = useAuthing()

  useEffect(() => {
    guard.start()
  }, [])
  return <div id="guard">this is login Page</div>
}
