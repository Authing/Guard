import Head from 'next/head'

import '@authing/react-ui-components/dist/esm/guard.min.css'

import { Guard } from '@authing/react-ui-components'

export default function Home () {
  const onLogin = (userInfo) => {
    console.log('userInfo: ', userInfo)
  }

  return <div>
    <Guard appId='630ed3137dd6f2fd7001da24' onLogin={onLogin}></Guard>
  </div>
}

