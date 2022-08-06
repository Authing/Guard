import React from 'react'
import { GuardProvider } from '@authing/guard-react'
import '@authing/guard-react/dist/esm/guard.min.css'

import RouterComponent from './router'

function App() {
  return (
    <GuardProvider
      appId="62e22721c889dd44bad1dda2"
      host="https://guard-test-2022.authing.cn"
      redirectUri="http://localhost:3000/callback"
      config={{
        target: '#root'
      }}
    >
      <RouterComponent></RouterComponent>
    </GuardProvider>
  )
}

export default App
