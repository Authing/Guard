import { React } from 'shim-react'

import { Guard } from './src'

const guard = new Guard({
  appId: '630ed3137dd6f2fd7001da24'
})

guard.start('#root').then(userInfo => {
  console.log('user info in start: ', userInfo)
})
