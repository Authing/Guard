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
    <GuardComponent appId='630ed3137dd6f2fd7001da24' onLogin={onLogin}></GuardComponent>
  </div>
}

