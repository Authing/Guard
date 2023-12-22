import { GuardProps } from '../Guard'

import { React, ReactNode } from 'shim-react'

import { useInitGuardAuthClient } from '../authClient'

import { GuardEvents, guardEventsFilter } from '../event'

import { insertStyles, regexFromString, removeStyles } from '../../_utils'

import { getDefaultGuardLocalConfig } from '../config'

import { GuardModuleType } from '../module'

import {
  GuardStateMachine,
  initGuardStateMachine,
  ModuleState
} from '../GuardModule/stateMachine'

import { SessionData, trackSession } from '../sso'

import {
  getPublicConfig,
  useMergeDefaultConfig,
  useFetchConsoleConfig
} from '../../_utils/config'

import { GuardHttp, initGuardHttp } from '../../_utils/guardHttp'

import { initGuardI18n } from '../../_utils/locales'

import { useGuardXContext } from '../../_utils/context'

import { useGuardIconfont } from '../../IconFont/useGuardIconfont'

import { useInitGuardAppendConfig } from './useAppendConfig'

import { useInitAppId } from '../../_utils/initAppId'

import { updateFlowHandle } from '../../_utils/flowHandleStorage'

import { ApplicationConfig, LoginMethods } from '../../Type/application'

import { AuthenticationClient } from 'authing-js-sdk'

import { Lang } from '../../Type'

import { i18n } from '../../_utils/locales'

// hooks
import useMultipleAccounts from './hooks/useMultipleAccounts'

import { useMultipleTenant } from '../../_utils/tenant'

import Axios from 'axios'

import { getGuardDocument } from '../../_utils/guardDocument'

const { useCallback, useEffect, useMemo, useReducer, useState, useRef } = React

interface IBaseAction<T = string, P = any> {
  type: T & string
  payload?: Partial<P>
}

export const RenderContext: React.FC<{
  guardProps: GuardProps
  initState: ModuleState
  children: ReactNode
}> = ({ guardProps, initState, children }) => {
  const { tenantId, deviceId, config } = guardProps
  // 强制刷新
  const [forceUpdate, setForceUpdate] = useState(Date.now())

  const [events, setEvents] = useState<GuardEvents>()
  const [authClint, setAuthClint] = useState<AuthenticationClient>()
  const [httpClient, setHttpClient] = useState<GuardHttp>()
  const [publicConfig, setPublicConfig] = useState<ApplicationConfig>()
  const [cdnBase, setCdnBase] = useState<string>()
  const [error, setError] = useState()
  const [isAuthFlow, setIsAuthFlow] = useState(true)
  const [i18nInit, setI18nInit] = useState(false)
  const scriptNodes = useRef<Record<string, Element>>({})
  const appId = useInitAppId(guardProps.appId, guardProps.authClient, setError)

  const [defaultLanguageConfig, setDefaultLanguageConfig] = useState<Lang>()

  const [isForeignUserpool, setIsForeignUserpool] = useState(false)

  useInitGuardAppendConfig(setForceUpdate, appId, guardProps.appendConfig)

  // 状态机
  const [guardStateMachine, setGuardStateMachine] =
    useState<GuardStateMachine>()

  const { Provider } = useGuardXContext()

  // modules 定义
  const moduleReducer: (
    state: ModuleState,
    action: IBaseAction<GuardModuleType, ModuleState>
  ) => ModuleState = (state, { type, payload }) => {
    return {
      moduleName: type,
      initData: payload?.initData
    }
  }

  // Modules Reducer
  const [moduleState, changeModule] = useReducer(moduleReducer, initState)

  // Flow Handle init
  useEffect(() => {
    if (initState.initData?.flowHandle) {
      updateFlowHandle(initState.initData.flowHandle)
    }
  }, [initState.initData])

  // Change Module
  const onChangeModule = useCallback(
    async (moduleName: GuardModuleType, initData: any = {}) => {
      if (
        !events?.onBeforeChangeModule ||
        (await events.onBeforeChangeModule(moduleName, initData))
      ) {
        changeModule({
          type: moduleName,
          payload: {
            initData: initData ?? {}
          }
        })
      }
    },
    [events]
  )

  // 合并默认值
  const defaultMergedConfig = useMergeDefaultConfig(
    getDefaultGuardLocalConfig(),
    config
  )

  // HttpClient
  useEffect(() => {
    if (!appId || !defaultMergedConfig) return

    const httpClient = initGuardHttp(defaultMergedConfig.host)
    httpClient.setAppId(appId)
    tenantId && httpClient.setTenantId(tenantId)
    if (deviceId) {
      httpClient.setDeviceId(deviceId)
    } else if (publicConfig?.deviceFuncEnabled) {
      authClint?.browserFingerprint?.createDevice().then(() => {
        const browserId = localStorage.getItem('browserId')
        browserId && httpClient.setDeviceId(browserId)
      })
    }

    setHttpClient(httpClient)
  }, [appId, defaultMergedConfig, tenantId, deviceId, publicConfig, authClint])

  /**
   *
   */
  const { finallyConfig, guardPageConfig } = useFetchConsoleConfig(
    forceUpdate,
    appId,
    defaultMergedConfig,
    httpClient,
    setError
  )

  const multipleInstance = useMultipleAccounts({
    appId,
    finallyConfig
  })

  const tenantInstance = useMultipleTenant(tenantId!, publicConfig!)
  // // guardPageConfig
  // const guardPageConfig = useGuardPageConfig(
  //   forceUpdate,
  //   error,
  //   appId,
  //   httpClient,
  //   setError
  // )

  const sdkClient = useInitGuardAuthClient({
    config: finallyConfig,
    appId,
    tenantId,
    setError,
    authClient: guardProps.authClient
  })

  // iconfont
  const iconfontLoaded = useGuardIconfont(cdnBase)

  // SSO 登录
  useEffect(() => {
    if (!config?.isSSO || !authClint || !events || !httpClient) return

    trackSession().then(sessionData => {
      // 这个接口没有 code, data, 直接返回了数据
      let typedData = sessionData as unknown as SessionData
      if (typedData.userInfo) {
        events?.onLogin?.(typedData.userInfo, authClint!)
      }
    })
  }, [appId, authClint, config?.isSSO, events, httpClient])

  useEffect(() => {
    // 优先使用用户自定义 host
    if (httpClient && finallyConfig && !config?.host) {
      httpClient?.setBaseUrl(finallyConfig.host)
    }
  }, [finallyConfig, httpClient])

  useEffect(() => {
    if (!appId) return

    const publicConfig = getPublicConfig(appId)

    if (!publicConfig) return

    setPublicConfig(publicConfig)

    setCdnBase(publicConfig.cdnBase)
  }, [appId, finallyConfig])

  // 特殊脚本注入
  useEffect(() => {
    if (!publicConfig) {
      return
    }
    const guardDocument = getGuardDocument()
    // TODO: 脚本后续上传到 oss
    if (
      publicConfig.qrcodeTabsSettings?.[LoginMethods.DingTalkQrcode] &&
      !scriptNodes.current?.dingtalk
    ) {
      const dingdingScriptDom = document.createElement('script')
      dingdingScriptDom.innerHTML =
        '!function(e){var t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(n,o,function(t){return e[t]}.bind(null,o));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=1382)}({1382:function(e,t){var r=function(e,t){var r=e.match(new RegExp("[?&]"+t+"=([^&]+)"));return r?r[1]:null};window.DTFrameLogin=function(e,t,n,o){var i,u=e.id&&document.getElementById(e.id)||null,c=document.createElement("iframe");t.client_id&&t.redirect_uri&&t.response_type&&t.scope?u?(u.innerHTML="",u.appendChild(c),c&&c.contentWindow&&c.contentWindow.postMessage&&window.addEventListener?(c.src="https://"+((i=t).isPre?"pre-login":"login")+".dingtalk.com/oauth2/auth?iframe=true&redirect_uri="+i.redirect_uri+"&response_type="+i.response_type+"&client_id="+i.client_id+"&scope="+i.scope+(i.prompt?"&prompt="+i.prompt:"")+(i.state?"&state="+i.state:"")+(i.org_type?"&org_type="+i.org_type:"")+(i.corpId?"&corpId="+i.corpId:"")+(i.exclusiveLogin?"&exclusiveLogin="+i.exclusiveLogin:"")+(i.exclusiveCorpId?"&exclusiveCorpId="+i.exclusiveCorpId:""),c.width=""+(e.width||300),c.height=""+(e.height||300),c.frameBorder="0",c.scrolling="no",window.addEventListener("message",(function(e){var t=e.data,i=e.origin;if(/login.dingtalk.com/.test(i)&&t)if(t.success&&t.redirectUrl){var u=t.redirectUrl,c=r(u,"authCode")||"",d=r(u,"state")||"",s=r(u,"error")||"";c?n&&n({redirectUrl:u,authCode:c,state:d}):o&&o(s)}else o&&o(t.errorMsg)}))):o&&o("Browser not support")):o&&o("Element not found"):o&&o("Missing parameters");return c;}}});'
      guardDocument.body.appendChild(dingdingScriptDom)
      scriptNodes.current = Object.assign(scriptNodes.current, {
        dingtalk: dingdingScriptDom
      })
    }

    if (
      publicConfig.qrcodeTabsSettings?.[LoginMethods.WechatworkCorpQrconnect] &&
      !scriptNodes.current?.weCom
    ) {
      const weComScriptDom = document.createElement('script')
      // weComScriptDom.innerHTML = `!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e="undefined"!=typeof globalThis?globalThis:e||self).WwLogin=t()}(this,(function(){"use strict";var e=["work.weixin.qq.com","tencent.com"],t={sso:"/wwopen/sso/qrConnect",tww:"/login/wwLogin/sso/qrConnect",native:"/native/sso/qrConnect",twxg:"/login/wwLogin/sso/qrConnect"},n="1.2.7";return function(){function o(e){this.options=e,this.options=e,this.createFrame()}return o.prototype.destroyed=function(){console.log("WwLogin had destroyed."),window.removeEventListener("message",this.onPostMessage)},o.prototype.getUrl=function(e){var o=[];Object.keys(e).forEach((function(t){var n=e[t];[void 0,null].indexOf(n)>-1||-1!==["string","number","boolean"].indexOf(typeof n)&&"id"!==t&&o.push("".concat(t,"=").concat(n))})),o.push("version=".concat(n)),o.push("login_type=jssdk");var s=t[e.business_type||"sso"];if(!s)throw new Error("Argument business_type not match. Current version is ".concat(n,"."));var i="https://open.work.weixin.qq.com";return/tencent\.com$/.test(window.location.host)&&(i="https://open.wecom.tencent.com"),"".concat(i).concat(s,"?").concat(o.join("&"))},o.prototype.createFrame=function(){var e=this;if(this.options.is_mobile)window.location.href=this.getUrl(this.options);else{this.frame=document.createElement("iframe");var t=document.getElementById(this.options.id);this.frame.src=this.getUrl(this.options),this.frame.frameBorder="0",this.frame.allowTransparency="true",this.frame.scrolling="no",this.frame.width="158px",this.frame.height="158px",t.innerHTML="",t.appendChild(this.frame),this.frame.onload=function(){e.frame.contentWindow.postMessage&&window.addEventListener&&(window.addEventListener("message",e.onPostMessage),e.frame.contentWindow.postMessage("ask_usePostMessage","*"))}}},o.prototype.onPostMessage=function(t){if(e.filter((function(e){return new RegExp("".concat(e,"$")).test(t.origin)})).length){var n=t.data;if(n&&"string"==typeof n&&/^http/.test(n)){var b = document.createElement('iframe');b.src = n; b.style.display = 'none';document.body.appendChild(b)}}},o}()}));`
      weComScriptDom.innerHTML =
        '!(function(e,t){"object"==typeof exports&&"undefined"!=typeof module?(module.exports=t()):"function"==typeof define&&define.amd?define(t):((e="undefined"!=typeof globalThis?globalThis:e||self).WwLogin=t())})(this,function(){"use strict";var e=["work.weixin.qq.com","tencent.com"],t={sso:"/wwopen/sso/qrConnect",tww:"/login/wwLogin/sso/qrConnect",native:"/native/sso/qrConnect",twxg:"/login/wwLogin/sso/qrConnect"},n="1.2.7";return(function(){function o(e){(this.options=e),(this.options=e),this.createFrame()}return((o.prototype.destroyed=function(){console.log("WwLogin had destroyed."),window.removeEventListener("message",this.onPostMessage)}),(o.prototype.getUrl=function(e){var o=[];Object.keys(e).forEach(function(t){var n=e[t];[void 0,null].indexOf(n)>-1||(-1!==["string","number","boolean"].indexOf(typeof n)&&"id"!==t&&o.push("".concat(t,"=").concat(n)))}),o.push("version=".concat(n)),o.push("login_type=jssdk");var s=t[e.business_type||"sso"];if(!s)throw new Error("Argument business_type not match. Current version is ".concat(n,"."));var i="https://open.work.weixin.qq.com";return(/tencent.com$/.test(window.location.host)&&(i="https://open.wecom.tencent.com"),"".concat(i).concat(s,"?").concat(o.join("&")))}),(o.prototype.createFrame=function(){var e=this;if(this.options.is_mobile)window.location.href=this.getUrl(this.options);else{this.frame=document.createElement("iframe");var t=document.getElementById(this.options.id);(this.frame.src=this.getUrl(this.options)),(this.frame.frameBorder="0"),(this.frame.allowTransparency="true"),(this.frame.scrolling="no"),(this.frame.width="100%"),(this.frame.height="194px"),(t.innerHTML=""),t.appendChild(this.frame),(this.frame.onload=function(){e.frame.contentWindow.postMessage&&window.addEventListener&&e.frame.contentWindow.postMessage("ask_usePostMessage","*")})}}),o)})()});'
      guardDocument.body.appendChild(weComScriptDom)
      scriptNodes.current = Object.assign(scriptNodes.current, {
        weCom: weComScriptDom
      })
    }
  }, [publicConfig])

  // I18n
  useEffect(() => {
    if (guardPageConfig && publicConfig && defaultMergedConfig) {
      const { defaultLanguage } = guardPageConfig.global
      initGuardI18n(
        {
          defaultLanguage:
            (defaultMergedConfig?.lang as Lang) ?? defaultLanguage
        },
        setI18nInit
      )

      setDefaultLanguageConfig(i18n.language as Lang)
    }
  }, [defaultMergedConfig, guardPageConfig, publicConfig, setI18nInit])

  // AuthClient
  useEffect(() => {
    setAuthClint(sdkClient)
  }, [sdkClient])

  // initEvents
  useEffect(() => {
    if (!defaultMergedConfig) return

    const events = guardEventsFilter(
      {
        ...guardProps
      },
      multipleInstance.instance,
      defaultMergedConfig?.openEventsMapping
    )
    setEvents(events)
  }, [guardProps, multipleInstance, defaultMergedConfig])

  // 状态机相关
  useEffect(() => {
    const guardStateMachine = initGuardStateMachine(onChangeModule, initState)
    setGuardStateMachine(guardStateMachine)

    return () => {
      guardStateMachine.uninstallPopstate()
    }
  }, [initState, onChangeModule])

  // 自定义 CSS 处理
  useEffect(() => {
    if (finallyConfig && finallyConfig.contentCss)
      insertStyles(finallyConfig.contentCss, 'appConfig')

    return () => removeStyles('appConfig')
  }, [finallyConfig])

  // 是否使用 Guard auth flow
  useEffect(() => {
    if (!finallyConfig) return

    setIsAuthFlow(!Boolean(finallyConfig?.__unAuthFlow__))
  }, [finallyConfig])

  // 是否是国外用户池
  useEffect(() => {
    const baseUrl = finallyConfig?.host

    if (appId && baseUrl) {
      try {
        Axios.get<
          any,
          {
            data: {
              code: number
              data: boolean
              message: string
            }
          }
        >(`${baseUrl}/api/v2/application/${appId}/check-app-is-show-code`)
          .then(res => {
            const { code, data } = res?.data || {}
            if (code === 200) {
              setIsForeignUserpool(data)
            }
          })
          .catch(error => {
            console.log('error', error)
          })
      } catch (error) {
        console.log('error', error)
      }
    }
  }, [appId, finallyConfig?.host])

  const moduleEvents = useMemo(() => {
    if (!events && !guardStateMachine) return undefined
    return {
      changeModule: async (moduleName: GuardModuleType, initData?: any) => {
        guardStateMachine?.next(moduleName, initData)
      },
      backModule: () => {
        guardStateMachine?.back()
      }
    }
  }, [events, guardStateMachine])

  const contextLoaded = useMemo(() => {
    const list = [
      appId,
      events,
      defaultMergedConfig,
      finallyConfig,
      httpClient,
      moduleEvents,
      publicConfig,
      authClint,
      guardPageConfig,
      iconfontLoaded,
      // 保证 store 加载完成
      multipleInstance,
      // 保证 i18n 初始化完成
      i18nInit,
      defaultLanguageConfig,
      tenantInstance
    ]

    return !list.includes(undefined) && !list.includes(false)
  }, [
    appId,
    events,
    defaultMergedConfig,
    finallyConfig,
    httpClient,
    moduleEvents,
    publicConfig,
    authClint,
    guardPageConfig,
    iconfontLoaded,
    multipleInstance,
    i18nInit,
    defaultLanguageConfig,
    tenantInstance
  ])

  const phoneRegex = useMemo(() => {
    const str =
      publicConfig?.regexRules?.find(item => item.key === 'phone')
        ?.userpoolLevel ?? ''
    if (str) {
      try {
        const regex = regexFromString(str)
        return regex
      } catch (error) {}
    }
    return null
  }, [publicConfig?.regexRules])

  // TODO 触发 onLoad 事件
  useEffect(() => {
    if (!contextLoaded || error) return

    events?.onLoad?.(authClint!)
  }, [authClint, contextLoaded, error, events])

  const contextValues = useMemo(
    () =>
      contextLoaded
        ? {
            contextLoaded,
            isAuthFlow,
            defaultMergedConfig,
            finallyConfig,
            publicConfig,
            httpClient,
            appId,
            tenantId,
            events,
            ...moduleEvents,
            initData: moduleState.initData,
            currentModule: moduleState,
            guardPageConfig,
            // 多账号相关信息 store 实例
            multipleInstance,
            phoneRegex,
            defaultLanguageConfig,
            tenantInstance,
            isForeignUserpool
          }
        : {
            defaultMergedConfig
          },
    [
      appId,
      contextLoaded,
      defaultMergedConfig,
      events,
      finallyConfig,
      guardPageConfig,
      httpClient,
      isAuthFlow,
      moduleEvents,
      moduleState,
      publicConfig,
      tenantId,
      multipleInstance,
      phoneRegex,
      defaultLanguageConfig,
      tenantInstance,
      isForeignUserpool
    ]
  )

  const renderContext = useMemo(() => {
    if (!contextValues) return null
    return <Provider value={contextValues}>{children}</Provider>
  }, [Provider, children, contextValues])

  const RenderErrorContext = useCallback(() => {
    events?.onLoadError?.(error)
    return (
      <Provider
        value={{
          contextLoaded: true,
          defaultMergedConfig,
          initData: {
            error: error
          },
          currentModule: {
            moduleName: GuardModuleType.ERROR,
            initData: {
              error
            }
          }
        }}
      >
        {children}
      </Provider>
    )
  }, [Provider, children, defaultMergedConfig, error, events])

  const render = useMemo(() => {
    if (error) return <RenderErrorContext />

    if (contextLoaded || Boolean(defaultMergedConfig)) return renderContext

    return null
  }, [
    contextLoaded,
    defaultMergedConfig,
    error,
    renderContext,
    RenderErrorContext
  ])

  return render
}
