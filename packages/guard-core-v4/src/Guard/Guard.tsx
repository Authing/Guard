import { React, render } from 'shim-react'

import { GuardEvents } from './event'

import { GuardAppendConfig, IG2FCProps } from '../Type'

import { GuardLocalConfig } from './config'

import { GuardModuleType } from './module'

import 'moment/locale/zh-cn'

import { GuardCore } from './core/index'

import { getDocumentNode, GuardPropsFilter } from '../_utils'

import { initGuardDocument } from '../_utils/guardDocument'

const { memo, useEffect, useRef, useState } = React

export interface GuardProps extends GuardEvents, IG2FCProps {
  config?: Partial<GuardLocalConfig>
  appendConfig?: GuardAppendConfig
}

interface ModuleState {
  moduleName: GuardModuleType
  initData: any
}

const propsAreEqual = (pre: GuardProps, current: GuardProps) => {
  return GuardPropsFilter(pre, current)
}

export const Guard = memo((props: GuardProps) => {
  const { config } = props

  const ref = useRef<HTMLDivElement>(null)

  const [guardWindowMount, mounted] = useState<boolean>(false)

  // 锁定 Guard 中 window 指向
  useEffect(() => {
    if (!ref?.current) return

    const guardDocument = getDocumentNode(ref.current)

    initGuardDocument(guardDocument)

    mounted(true)
  }, [])

  // 首页 init 数据
  const initState: ModuleState = {
    moduleName: config?.defaultScenes ?? GuardModuleType.LOGIN,
    initData: config?.defaultInitData ?? {}
  }

  return (
    <div ref={ref}>
      {guardWindowMount && (
        <GuardCore guardProps={props} initState={initState} />
      )}
    </div>
  )
}, propsAreEqual)
