import Head from 'next/head'

import { useEffect } from 'react'
import { Guard } from '@authing/guard'
import '@authing/guard/dist/esm/guard.min.css'

import { guardOptions } from '../config'

export default function Home() {
  const guard = new Guard(guardOptions)

  const handleCallback = async () => {
    await guard.handleRedirectCallback()
    // ******** 使用 replace ********
    window.location.replace('/personal')
  }

  useEffect(() => {
    handleCallback()
  })

  return (
    <div>This is Callback page</div>
  )
}
