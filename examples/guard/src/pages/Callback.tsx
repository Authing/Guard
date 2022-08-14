import React, { useEffect } from 'react'

import { Guard } from '@authing/guard'

import { guardOptions } from '../config'

export default function Callback() {
  const guard = new Guard(guardOptions)

  console.log('guard: ', guard)
  
  const handleCallback = async () => {
    await guard.handleRedirectCallback()
    // ******** 使用 replace ********
    window.location.replace('/personal')
  }

  useEffect(() => {
    handleCallback()
  })

  return <div>This is Callback page</div>
}
