import { GuardOptions } from '@authing/guard-react18'

export const guardOptions: GuardOptions = {
  appId: "AUTHING_APP_ID",
  config: {
    socialConnectionList: ['github']
  }
  // 如果你使用的是私有化部署的 Authing 服务，需要传入自定义 host，如 
  // host: 'https://my-authing-app.example.com'
}
