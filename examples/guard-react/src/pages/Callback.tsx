import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import { useGuard } from '@authing/guard-react'

export default function Callback() {
  const history = useHistory()
  const guard = useGuard()

  const handleCallback = async () => {
    await guard.handleRedirectCallback()
    history.replace('/personal')
  }

  useEffect(() => {
    handleCallback()
  })

  return <div>This is Callback page</div>
}
