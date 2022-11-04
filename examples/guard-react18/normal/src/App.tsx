import React from 'react'

import { GuardProvider } from '@authing/guard-react18'

import RouterComponent from './router'

import * as facePlugin from 'face-api.js'

import './App.css'

import '@authing/guard-react18/dist/esm/guard.min.css'

// import { message, Dropdown, Button } from 'antd'
// import 'antd/dist/antd.css'
// import type { MenuProps } from 'antd';

// const items: MenuProps['items'] = [
//   {
//     key: '1',
//     label: (
//       <div>1</div>
//     ),
//   },
//   {
//     key: '2',
//     label: (
//       <div>2</div>
//     ),
//   },
//   {
//     key: '3',
//     label: (
//       <div>3</div>
//     ),
//   },
// ];

// message.success('登录成功...')

export default function App() {
  return (
    <>
      <GuardProvider
        appId="AUTHING_APP_ID"
        
        // 如果你使用的是私有化部署的 Authing 服务，需要传入自定义 host，如:
        // host="https://my-authing-app.example.com"

        // 默认情况下，会使用你在 Authing 控制台中配置的第一个回调地址为此次认证使用的回调地址。
        // 如果你配置了多个回调地址，也可以手动指定（此地址也需要加入到应用的「登录回调 URL」中）：
        // redirectUri="YOUR_REDIRECT_URI"
        
        isSSO={true}
        facePlugin={facePlugin}
      >
        <RouterComponent></RouterComponent>
      </GuardProvider>

      {/* <RouterComponent></RouterComponent> */}

      {/* <Dropdown menu={{ items }} placement="bottomRight">
        <Button>bottomRight</Button>
      </Dropdown> */}
    </>
  )
}
