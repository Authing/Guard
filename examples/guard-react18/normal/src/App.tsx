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
        // host="https://my-authing-app.example.com"
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
