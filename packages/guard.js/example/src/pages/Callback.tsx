import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import { Guard } from '../../../components'

export default function Callback () {
  const history = useHistory()

  const handleCallback = async () => {
    const guard = new Guard({
      appId: '62e22721c889dd44bad1dda2',
      host: 'https://guard-test-2022.authing.cn',
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
