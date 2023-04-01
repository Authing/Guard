import { GuardLocalConfig } from '../config'

import { GuardModuleType } from '../module'

import isEqual from 'lodash/isEqual'

import { getGuardWindow } from '../core/useAppendConfig'

export interface ModuleState {
  moduleName: GuardModuleType
  initData?: any
}

export enum ActionType {
  ChangeModule = 'ChangeModule',
  Back = 'Back',
  Init = 'Init'
}

export interface StateMachineLog {
  action: ActionType
  date: number
  dataSource: ModuleState
}

export type ChangeModuleEvent = (nextModule: GuardModuleType, initData?: any) => void

let guardStateMachine: GuardStateMachine

export class GuardStateMachine {
  // 计数器
  private order = 0

  // 总体的配置信息
  private config: Partial<GuardLocalConfig> = {}

  // 历史记录
  private moduleStateHistory: ModuleState[] = []

  private changeModuleEvent: ChangeModuleEvent

  // Log
  private stateMachineLog: Record<number, StateMachineLog> = {}

  constructor(changeModuleEvent: ChangeModuleEvent, initData: ModuleState) {
    this.changeModuleEvent = changeModuleEvent

    this.globalWindow()?.addEventListener('popstate', this.onPopstate)

    this.historyPush(initData, ActionType.Init)
  }

  uninstallPopstate = () => {
    this.globalWindow()?.removeEventListener('popstate', this.onPopstate)
  }

  globalWindow = (): Window | undefined => {
    const guardWindow = getGuardWindow()

    return guardWindow ?? undefined
  }

  next = (nextModule: GuardModuleType, initData: any) => {
    const globalWindow = this.globalWindow()

    const moduleData: ModuleState = {
      moduleName: nextModule,
      initData
    }
    this.changeModuleEvent(nextModule, initData)

    const prevModuleData = this.moduleStateHistory.slice(1, 2)[0]

    if (this.isUseHistoryHijack()) {
      globalWindow?.history.pushState(nextModule, '', globalWindow?.location.href)
    }

    // 快照history
    if (prevModuleData && isEqual(prevModuleData, moduleData)) {
      this.back()
    } else {
      this.historyPush(moduleData)
    }

    // console.log('next Log', this.stateMachineLog)
    // console.log('next History', this.moduleStateHistory)
  }

  back = (initData: any = {}) => {
    if (this.moduleStateHistory.length <= 1) return
    const backModule = this.moduleStateHistory[1]

    this.changeModuleEvent(backModule.moduleName, {
      ...initData,
      ...backModule.initData
    })
    this.moduleStateHistory.splice(0, 1)

    // console.log('back Log', this.stateMachineLog)
  }

  // 业务终点 Log 发送
  end = () => {
    // console.log('业务终点 Log', this.stateMachineLog)
    // TODO 请求
  }

  historyPush = (data: ModuleState, actionType: ActionType = ActionType.ChangeModule) => {
    this.moduleStateHistory.unshift(data)

    this.stateMachineLog[this.order++] = {
      action: actionType,
      date: new Date().getTime(),
      dataSource: data
    }

    if (this.moduleStateHistory.length > 10)
      this.moduleStateHistory.splice(10, this.moduleStateHistory.length - 10)
  }

  historyBack = (data: ModuleState) => {
    if (this.moduleStateHistory.length <= 1) return

    this.moduleStateHistory.splice(0, 1)

    this.stateMachineLog[this.order++] = {
      action: ActionType.Back,
      date: new Date().getTime(),
      dataSource: data
    }
  }

  setConfig = (config: Partial<GuardLocalConfig>) => {
    this.config = config
  }

  isUseHistoryHijack = () => {
    return this.globalWindow()?.location.href !== 'about:blank'
  }

  onPopstate = () => {
    this.back()
  }
}

// export const useHistoryHijack = (back?: () => void) => {
//   const globalWindow = getGuardWindow()

//   const isUseHistoryHijack = useMemo(
//     () => globalWindow?.location.href !== 'about:blank',

//     [globalWindow?.location.href]
//   )

//   const next = (state: any = {}) => {
//     if (!isUseHistoryHijack) {
//       return
//     }

//     globalWindow?.history.pushState(state, '', globalWindow?.location.href)
//   }

//   useEffect(() => {
//     if (!isUseHistoryHijack) {
//       return () => {}
//     }

//     const onPopstate = () => {
//       back?.()
//     }

//     back && globalWindow?.addEventListener('popstate', onPopstate)

//     return () => {
//       back && globalWindow?.removeEventListener('popstate', onPopstate)
//     }
//   }, [back, globalWindow, isUseHistoryHijack])

//   return [next]
// }

export const initGuardStateMachine = (
  changeMouleEvent: ChangeModuleEvent,
  initData: ModuleState
) => {
  guardStateMachine = new GuardStateMachine(changeMouleEvent, initData)
  return guardStateMachine
}

export const getGuardStateMachine = () => {
  if (!guardStateMachine) throw new Error('Please initialize GuardStateMachine')

  return guardStateMachine
}

export const useGuardStateMachine = () => getGuardStateMachine()
