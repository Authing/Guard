import { GuardOptions, SocialConnectionProvider, GuardMode } from '@authing/guard'

export const guardOptions: GuardOptions = {
  appId: '633cff70bf717c9ba0d604a4',
  mode: GuardMode.Modal,
  config: {
    socialConnections: [SocialConnectionProvider.GITHUB]
  }
  // 如果你使用的是私有化部署的 Authing 服务，需要传入自定义 host，如 
  // host: 'https://my-authing-app.example.com'
}
