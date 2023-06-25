import Head from 'next/head'

import '@authing/react-ui-components/dist/esm/guard.min.css'

import { Guard } from '@authing/react-ui-components'

export default function Home () {
  const onLogin = (userInfo) => {
    console.log('userInfo: ', userInfo)
  }

  return <div>
    <Guard appId='AUTHING_APP_ID' onLogin={onLogin}></Guard>
  </div>
}

