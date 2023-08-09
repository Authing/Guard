import { GuardModuleAction, GuardModuleType } from '../Guard/module'

export const codeMap: Record<number, GuardModuleAction> = {
  // 待添加
  2021: {
    action: 'changeModule',
    module: GuardModuleType.LOGIN
  },
  1700: {
    action: 'insideFix',
    message: 'verification failed, let components inside fix is fine.'
  },
  1701: {
    action: 'insideFix',
    message: 'verification failed, let components inside fix is fine.'
  },
  1702: {
    action: 'insideFix',
    message: 'verification failed, let components inside fix is fine.'
  },
  500: {
    action: 'message'
  },
  6001: {
    action: 'message'
  },
  602: {
    action: 'message'
  }
}
