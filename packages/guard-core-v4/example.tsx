import { Guard, User, GuardLocalConfig, GuardModuleType } from './src/index'

import { React, render } from 'shim-react'

import * as facePlugin from 'face-api.js'

const App = () => {
  const appId = '6a7d896b7c4b6307791ab555'
  // const deviceId = 'DEVICE_ID' //如要使用必须使用开启元数据对的 用户池 测试

//   const config: Partial<GuardLocalConfig> = {
//     host:'https://rhlfbq6ws2jb.authing.localhost',
//     defaultScenes: GuardModuleType.INVITE_AUTH,
//     defaultInitData:{
//       "enabledIdentifierVerify": true,
//       "sendVerifyCodeMethod": "priorityEmail",
//       "enabledInfoFill": true,
//       "registerInfoFillMsg": null,
//       "extendsFields": [
//           {
//               "type": "internal",
//               "name": "email",
//               "inputType": "email",
//               "show": true,
//               "required": true,
//               "allowRewrite": false,
//               "source": "preset",
//               "validateRules": [
//                   {
//                       "type": "email",
//                       "content": "",
//                       "errorMessage": "",
//                       "i18n": {}
//                   }
//               ]
//           },
//           {
//               "type": "internal",
//               "name": "phone",
//               "inputType": "phone",
//               "show": true,
//               "required": false,
//               "allowRewrite": false,
//               "source": "preset",
//               "validateRules": [
//                   {
//                       "type": "phone",
//                       "content": "",
//                       "errorMessage": "",
//                       "i18n": {}
//                   }
//               ]
//           }
//       ],
//       "extendsFieldsI18n": {
//           "phone": {
//               "en-US": {
//                   "enabled": true,
//                   "value": "Phone"
//               },
//               "zh-CN": {
//                   "enabled": true,
//                   "value": "手机号"
//               },
//               "zh-TW": {
//                   "enabled": true,
//                   "value": "手機號碼"
//               },
//               "ja-JP": {
//                   "enabled": true,
//                   "value": "携帯電話番号"
//               }
//           },
//           "email": {
//               "en-US": {
//                   "enabled": true,
//                   "value": "Email"
//               },
//               "zh-CN": {
//                   "enabled": true,
//                   "value": "邮箱"
//               },
//               "zh-TW": {
//                   "enabled": true,
//                   "value": "電子郵件"
//               },
//               "ja-JP": {
//                   "enabled": true,
//                   "value": "メール"
//               }
//           }
//       },
//       "extendsFieldsOptions": [],
//       "email": "dongfengtao@authing.com",
//       "phone": null,
//       "phoneCountryCode": "",
//       "inviteeName": "董峰涛3",
//       "verifyCodeMaxErrCount": 5,
//       "token": "nSahhKXTcKPaxXItxCV",
//       "identifier": "zpvnnga4gvv0ucafe5w6"
//   }
//   }


    const config: Partial<GuardLocalConfig> = {
        host:'https://zlmo8lf6huhi.authing.demo',
    
    }
  const onLogin = (userInfo: User) => {
    console.log(userInfo)
  }

  return (
    <Guard
      // deviceId={deviceId}
      appId={appId}
      onLogin={onLogin}
      onLoginError={error => {
        console.log(error, 'loginerror')
      }}
      visible={true}
      config={config}
      facePlugin={facePlugin}
    />
  )
}

render({
  container: document.querySelector('#root') as Element,
  element: <App />
})
