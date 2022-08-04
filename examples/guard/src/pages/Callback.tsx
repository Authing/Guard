import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import { Guard } from '@authing/guard'

export default function Callback() {
  const history = useHistory()

  const handleCallback = async () => {
    const guard = new Guard({
      appId: '62e752f0d8c681db4ed3f743',
      host: 'https://test0123456.authing.cn',
      redirectUri: 'http://localhost:3000/callback'
    })

    await guard.handleRedirectCallback()
    history.push('/personal')
  }

  useEffect(() => {
    handleCallback()
  })

  return <div>This is Callback page</div>
}
