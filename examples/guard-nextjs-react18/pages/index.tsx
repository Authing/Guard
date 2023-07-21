import Head from 'next/head'

import { useEffect } from 'react'

import { Guard } from '@authing/guard-react18'

import { guardOptions } from '../config'

export default function Home () {
  const guard = new Guard(guardOptions)
  const toEmbed = () => window.location.href = '/login'
  const toJump = () => window.location.href = '/jump'

  useEffect(() => {
    guard.trackSession().then(userInfo => {
      console.log('userInfo in index trackSession: ', userInfo)
    })
  }, [])

  return <div>
    <div style={{marginBottom: '20px'}} onClick={toEmbed}><button>嵌入模式</button></div>
    <div><button onClick={toJump}>跳转模式</button></div>
  </div>
}

