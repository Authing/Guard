import { Guard } from './src'

import * as facePlugin from 'face-api.js'

const decodedUrl = decodeURIComponent(window.location.href)
const queryString = decodedUrl.split('?')[1]
const params: Record<string, any> = {}
if (queryString) {
  queryString.split('&').forEach(item => {
    const [key, value] = item.split('=')
    params[key] = value
  })
}

const guard = new Guard({
  appId: params.appId || '64196bdaa5b19f2a6e4316d0',
  // mode: 'modal',
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