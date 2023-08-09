import Head from 'next/head'

import '@authing/react18-ui-components/lib/index.min.css'

import { Guard, User } from '@authing/react18-ui-components'

import { guardOptions } from '../config'

export default function Home () {
  const onLogin = (userInfo: User) => {
    console.log('userInfo: ', userInfo)
  }

  return <div>
    <Guard appId={guardOptions.appId} onLogin={onLogin}></Guard>
  </div>
}

