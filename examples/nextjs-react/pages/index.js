import Head from 'next/head'

import dynamic from 'next/dynamic'

import '@authing/react-ui-components/dist/esm/guard.min.css'

import { Guard } from '@authing/react-ui-components'

// const GuardComponent = dynamic(() => import('@authing/react-ui-components').then(res => res.Guard), {
//   ssr: false
// })

export default function Home () {
  const onLogin = (userInfo) => {
    console.log('userInfo: ', userInfo)
  }

  return <div>
    {/* <GuardComponent appId='630ed3137dd6f2fd7001da24' onLogin={onLogin}></GuardComponent> */}
    <Guard appId='630ed3137dd6f2fd7001da24' onLogin={onLogin}></Guard>
  </div>
}

