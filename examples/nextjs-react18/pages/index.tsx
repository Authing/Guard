import Head from 'next/head'

import dynamic from 'next/dynamic'

import '@authing/react18-ui-components/dist/esm/guard.min.css'

import { User } from '@authing/react18-ui-components'

const GuardComponent = dynamic(() => import('@authing/react18-ui-components').then(res => res.Guard), {
  ssr: false
})

export default function Home () {
  const onLogin = (userInfo: User) => {
    console.log('userInfo: ', userInfo)
  }

  return <div>
    <GuardComponent appId='AUTHING_APP_ID' onLogin={onLogin}></GuardComponent>
  </div>
}

