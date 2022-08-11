import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import { Guard } from '@authing/guard'

export default function Callback() {
  const history = useHistory()

  const handleCallback = async () => {
    const guard = new Guard({
      appId: '62e8d32e4feac0ba0a75edf5',
      host: 'https://ipehegkanbpgkdho-demo.authing.cn',
      // redirectUri: 'http://localhost:3000/callback'
    })

    console.log('guard: ', guard)

    await guard.handleRedirectCallback()
    history.replace('/personal')
  }

  useEffect(() => {
    handleCallback()
  })

  return <div>This is Callback page</div>
}
