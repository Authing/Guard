import { GuardOptions, GuardMode } from '@authing/guard'

import * as facePlugin from 'face-api.js'

export const guardOptions: GuardOptions = {
  appId: 'Your Authing application ID',
  config: {
    mode: GuardMode.Normal
  },
  facePlugin
}
