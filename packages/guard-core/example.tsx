import { Guard } from './src'

import * as facePlugin from 'face-api.js'

const guard = new Guard({
  appId: '630ed3137dd6f2fd7001da24',
  facePlugin
})

guard.start('#root').then(userInfo => {
  console.log('user info in start: ', userInfo)
})

guard.on('lang-change', res => {
  console.log('on lang change: ', res)
})

guard.on('login', res => {
  console.log('on login success: ', res)
})

guard.on('login-error', res => {
  console.log('on login error: ', res)
})

guard.on('after-change-module', res => {
  console.log('on after change module: ', res)
})
