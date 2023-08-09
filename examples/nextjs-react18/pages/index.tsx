import Head from 'next/head'

import '@authing/react18-ui-components/lib/index.min.css'

import { Guard, User } from '@authing/react18-ui-components'

export default function Home () {
  const onLogin = (userInfo: User) => {
    console.log('userInfo: ', userInfo)
  }

  return <div>
    <Guard appId="AUTHING_APP_ID" onLogin={onLogin}></Guard>
  </div>
}

