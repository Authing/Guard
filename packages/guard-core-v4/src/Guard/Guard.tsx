import { React, render } from 'shim-react'

import { GuardEvents } from './event'

import { GuardAppendConfig, IG2FCProps } from '../Type'

import { GuardLocalConfig } from './config'

import { GuardModuleType } from './module'

// import 'moment/locale/zh-cn'

import { GuardCore } from './core/index'

import { getDocumentNode, GuardPropsFilter } from '../_utils'

import { initGuardDocument } from '../_utils/guardDocument'

const { memo, useEffect, useMemo, useRef, useState } = React

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

export const GuardComponent = memo((props: GuardProps) => {
  const { config } = props

  const ref = useRef<HTMLDivElement>(null)

  const [guardWindowMount, mounted] = useState<boolean>(false)

  const guardPropsWithOnLoginInterceptor = useMemo(() => {
    const { onLogin, ...restProps } = props

    return {
      ...restProps,
      onLogin: (...args: Parameters<NonNullable<GuardProps['onLogin']>>) => {
        const [userInfo] = args
        const userId = (userInfo as { id?: string } | undefined)?.id
        userId && window.sensors_sw?.login?.('authing_' + userId)
        onLogin?.(...args)
      }
    } as GuardProps
  }, [props])

  // 锁定 Guard 中 window 指向
  useEffect(() => {
    if (!ref?.current) return

    const guardDocument = getDocumentNode(ref.current)

    initGuardDocument(guardDocument)

    mounted(true)
  }, [])

  useEffect(() => {
    if (!ref?.current) return
    // 如果 config.host 最后以斜杠结尾 则不拼接斜杠

    const AUTOTRACK_SCRIPT_URL =
      'https://files.id.zjedu.gov.cn/authing-fe-user-portal/sw.webjs.sdk/autotrack.js'
    const guardDocument = getDocumentNode(ref.current)
    const hasLoadedScript =
      guardDocument.querySelector(`script[src="${AUTOTRACK_SCRIPT_URL}"]`) ||
      window.sensors_sw

    if (hasLoadedScript) return

    const scriptNode = guardDocument.createElement('script')
    scriptNode.src = AUTOTRACK_SCRIPT_URL
    scriptNode.async = true
    guardDocument.head.appendChild(scriptNode)
  }, [])

  // 首页 init 数据
  const initState: ModuleState = {
    moduleName: config?.defaultScenes ?? GuardModuleType.LOGIN,
    initData: config?.defaultInitData ?? {}
  }

  return (
    <div ref={ref}>
      {guardWindowMount && (
        <GuardCore
          guardProps={guardPropsWithOnLoginInterceptor}
          initState={initState}
        />
      )}
    </div>
  )
}, propsAreEqual)

export function Guard(props: GuardProps) {
  useEffect(() => {
    render({
      container: document.querySelector(
        '#authing-guard-container-v4'
      ) as Element,
      element: <GuardComponent {...props}></GuardComponent>
    })
  }, [props])
  return <div id="authing-guard-container-v4"></div>
}
