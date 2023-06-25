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
    {/* <GuardComponent appId='AUTHING_APP_ID' onLogin={onLogin}></GuardComponent> */}
    <Guard appId='AUTHING_APP_ID' onLogin={onLogin}></Guard>
  </div>
}

