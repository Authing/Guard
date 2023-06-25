import Head from 'next/head'

import '@authing/react18-ui-components/dist/esm/guard.min.css'

import { Guard, User } from '@authing/react18-ui-components'

export default function Home () {
  const onLogin = (userInfo: User) => {
    console.log('userInfo: ', userInfo)
  }

  return <div>
    <Guard appId='630ed3137dd6f2fd7001da24' onLogin={onLogin}></Guard>
  </div>
}

