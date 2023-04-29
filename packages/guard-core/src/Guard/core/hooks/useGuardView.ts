import { React } from 'shim-react'

import {
  useGuardEvents,
  useGuardModule,
  useGuardMultipleInstance
} from '../../../_utils/context'

interface Options {
  changeTab?: React.Dispatch<any>
  currentTab?: string
}

const { useEffect } = React

export function useGuardView(options: Options = {}) {
  const { currentTab, changeTab } = options

  const { changeModule, currentModule } = useGuardModule()

  const events = useGuardEvents()

  const { isMultipleAccount } = useGuardMultipleInstance()

  // 修改 View 的方式：changeModule、changeTab
  // 为避免 Guard 组件多次渲染及复杂的依赖创建及销毁判断
  // 直接将其挂载到 window 上最方便
  useEffect(() => {
    window.$$guard = Object.assign({}, window.$$guard, {
      viewContext: {
        ...window.$$guard?.viewContext,
        changeModule,
        changeTab
      }
    })
  }, [changeModule, changeTab])

  useEffect(() => {
    let currentView: string = currentModule.moduleName

    if (currentTab) {
      currentView += `:${currentTab}`
    }

    window.$$guard = Object.assign({}, window.$$guard, {
      viewContext: {
        ...window.$$guard?.viewContext,
        currentModule: currentModule.moduleName,
        currentTab,
        currentView
      }
    })

    if (events?.onAfterChangeModule && !isMultipleAccount && currentModule) {
      events.onAfterChangeModule({
        currentView,
        currentModule: currentModule.moduleName,
        currentTab: currentTab,
        data: currentModule.initData
      })
    }
  }, [currentModule, currentTab, events, isMultipleAccount])
}
