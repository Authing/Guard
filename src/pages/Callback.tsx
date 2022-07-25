import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import { Guard } from '../components'

export default function Callback () {
  const history = useHistory()

  const handleCallback = async () => {
    const guard = new Guard({
      appId: '62de1209719e5be69d3449e0',
      appHost: 'https://guard-demo-2022.authing.cn',
      redirectUri: 'http://localhost:3000/callback'
    })
    
    await guard.handleRedirectCallback()
    history.replace('/personal')
  }

  useEffect(() => {
    handleCallback()
  }, [])

  return <div>This is Callback page</div>
}
