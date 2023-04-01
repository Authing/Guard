import { GuardAppendConfig } from '..'

let appendConfigMapping: GuardAppendConfig

export const getAppendConfig = (): GuardAppendConfig => {
  return appendConfigMapping
}

export const useAppendConfig = getAppendConfig

export const initAppendConfig = (appendConfig: GuardAppendConfig = {}) => {
  appendConfigMapping = appendConfig
}
