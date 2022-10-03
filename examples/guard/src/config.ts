import { GuardOptions, GuardMode } from '@authing/guard'

import * as facePlugin from 'face-api.js'

export const guardOptions: GuardOptions = {
  appId: '62e22721c889dd44bad1dda2',
  // host: 'https://ipehegkanbpgkdho-demo.authing.cn',
  align: 'center',
  config: {
    mode: GuardMode.Normal
  },
  facePlugin
}
