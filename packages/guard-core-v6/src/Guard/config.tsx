import { React, ReactNode } from 'shim-react'

import { GuardModuleType } from './module'

import { ForgetPasswordConfig } from '../ForgetPassword/interface'

import { getDefaultLoginConfig, LoginConfig } from '../Login/interface'

import { getDefaultRegisterConfig, RegisterConfig } from '../Register/interface'

import { ShieldSpin } from '../ShieldSpin'

export interface GuardLocalConfig
  extends RegisterConfig,
    LoginConfig,
    ForgetPasswordConfig {
  isSSO?: boolean
  defaultScenes?: GuardModuleType
  defaultInitData?: any
  showLoading?: boolean
  loadingComponent?: ReactNode
  /**
   * @description 是否调用 eventsMapping 中的事件
   */
  openEventsMapping?: boolean
}

const defaultConfig: GuardLocalConfig = {
  ...getDefaultLoginConfig(),
  ...getDefaultRegisterConfig(),
  isSSO: false,
  defaultInitData: {},
  showLoading: true,
  openEventsMapping: true,
  _closeLoopCheckQrcode: false,
  loadingComponent: (
    <div className="g2-init-setting-loading">
      <ShieldSpin size={100} />
    </div>
  )
}

export const getDefaultGuardLocalConfig = (): GuardLocalConfig => {
  return defaultConfig
}
