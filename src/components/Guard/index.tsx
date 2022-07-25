import React from "react"
import ReactDOM from "react-dom"
import { Guard as ReactAuthingGuard } from "@authing/react-ui-components"
import {
  GuardMode,
  GuardEvents,
  GuardEventsKebabToCamelType,
  GuardEventsCamelToKebabMapping,
  GuardModuleType,
  Lang
} from "@authing/react-ui-components"
import "@authing/react-ui-components/lib/index.min.css"
import { GuardComponentConfig, GuardLocalConfig } from "@authing/react-ui-components/components/Guard/config"
import { AuthenticationClient } from 'authing-js-sdk'

export interface NativeGuardProps {
  appId?: string
  config?: Partial<GuardLocalConfig>
  tenantId?: string
  authClient?: AuthenticationClient
}

export interface NativeGuardConstructor {
  (
    appId?: string | NativeGuardProps,
    config?: Partial<GuardLocalConfig>,
    tenantId?: string,
    authClient?: AuthenticationClient
  ): void

  (props: NativeGuardProps): void
}

export type GuardEventListeners = {
  [key in keyof GuardEventsKebabToCamelType]: Exclude<Required<GuardEventsKebabToCamelType>[key], undefined>[]
}

type CodeMethod = 'S256' | 'plain'

interface GuardOptions {
  appId: string,
  mode?: GuardMode,
  defaultScene?: GuardModuleType,
  lang?: Lang,
  isSSO?: boolean,
  appHost: string, // 私有化部署时的 IP 地址
  scope?: string, // OIDC scope
  redirectUri: string,
  state?: string // OIDC 状态
}

export class Guard {
  private appId?: string
  private visible?: boolean
  private el?: string
  public authClient: AuthenticationClient

  constructor(options: GuardOptions) {
    const { appId, mode = 'normal', appHost, redirectUri } = options

    this.appId = appId
    this.visible = !!!(mode === GuardMode.Modal)

    this.authClient = new AuthenticationClient({
      appId,
      appHost,
      redirectUri,
      tokenEndPointAuthMethod: 'none',
      introspectionEndPointAuthMethod: 'none'
    })
  }

  static getGuardContainer(selector?: string | HTMLElement) {
    const defaultId = "authing_guard_container"

    if (!selector) {
      let container = document.querySelector(`#${defaultId}`)
      if (!container) {
        container = document.createElement("div")
        container.id = defaultId
        document.body.appendChild(container)
      }

      return container
    }

    if (typeof selector === "string") {
      return document.querySelector(selector)
    }

    return selector
  }

  private eventListeners = Object.values(GuardEventsCamelToKebabMapping).reduce((acc, evtName) => {
    return Object.assign({}, acc, {
      [evtName as string]: [],
    })
  }, {} as GuardEventListeners)

  /**
   * 启动嵌入模式
   * @param el String
   * @returns Promise
   */
  async start (el: string) {
    this.el = el

    this.render()

    const userInfo = await this.trackSession()

    if (userInfo) {
      return Promise.resolve(userInfo)
    }

    return new Promise((resolve) => {
      this.on('login', userInfo => {
        resolve(userInfo)
      })
    })
  }

  /**
   * 启动跳转模式
   * @param {String} codeChallengeDigestMethod 'S256' | 'plain'
   * @param {String} codeChallengeMethod 'S256' | 'plain'
   */
  startWithRedirect (codeChallengeDigestMethod: CodeMethod = 'S256', codeChallengeMethod: CodeMethod = 'S256') {
    // 生成一个 code_verifier
    const codeChallenge = this.authClient.generateCodeChallenge()

    localStorage.setItem('codeChallenge', codeChallenge)
    
    // 计算 code_verifier 的 SHA256 摘要
    const codeChallengeDigest = this.authClient.getCodeChallengeDigest({
      codeChallenge,
      method: codeChallengeDigestMethod
    })

    // 构造 OIDC 授权码 + PKCE 模式登录 URL
    const url = this.authClient.buildAuthorizeUrl({
      codeChallenge: codeChallengeDigest, 
      codeChallengeMethod: codeChallengeMethod
    })

    window.location.href = url
  }

  async handleRedirectCallback () {
    const { code, codeChallenge } = this.getCodeAndCodeChallenge()

    const { id_token, access_token } = await this.getAccessTokenByCode(code, codeChallenge)

    const userInfo = await this.authClient.getUserInfoByAccessToken(access_token)

    this.setStorageCache(access_token, id_token, userInfo)
  }

  private async getAccessTokenByCode (code: string, codeChallenge: string) {
    return await this.authClient.getAccessTokenByCode(code, {
      codeVerifier: codeChallenge
    })
  }

  private getCodeAndCodeChallenge () {
    const query = this.parseUrlQuery()
    const { code = '' } = query
    const codeChallenge = localStorage.getItem('codeChallenge') || ''
  
    return {
      code,
      codeChallenge
    }
  }

  private setStorageCache (accessToken: string, idToken: string, userInfo: string) {
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('idToken', idToken)
    localStorage.setItem('userInfo', JSON.stringify(userInfo))
  }

  private parseUrlQuery () {
    const query: Record<string, string> = {}
  
    const queryString = window.location.search.split('?')[1]
    
    if (!queryString) {
      return query
    }
  
    queryString.split('&').forEach(item => {
      const [key, value] = item.split('=')
      query[key] = value
    })
  
    return query
  }

  /**
   * 获取当前用户信息
   */
  async trackSession () {
    return await this.authClient.getCurrentUser()
  }

  logout () {
    const redirectUri = window.location.origin
    const idToken = localStorage.getItem('idToken')

    if (idToken) {
      this.authClient.buildLogoutUrl({
        expert: true,
        redirectUri,
        idToken
      })
    }

    localStorage.clear()

    window.location.href = redirectUri
  }

  updateIdToken () {
    return this.authClient.refreshToken()
  }

  private render(cb?: () => void) {
    const evts: GuardEvents = Object.entries(GuardEventsCamelToKebabMapping).reduce((acc, [reactEvt, nativeEvt]) => {
      return Object.assign({}, acc, {
        [reactEvt]: (...rest: any) => {
          if (nativeEvt === "close") {
            this.hide()
          }

          // TODO 返回最后一个执行函数的值，实际应该只让监听一次
          return (
            (this.eventListeners as any)[nativeEvt as string]
              // @ts-ignore
              .map((item: any) => {
                return item(...rest)
              })
              .slice(-1)[0] ?? true
          )
        },
      })
    }, {} as GuardEvents)

    return ReactDOM.render(
      <ReactAuthingGuard
        {...(evts as GuardEvents)}
        appId={this.appId}
        visible={this.visible}
      />,
      Guard.getGuardContainer(this.el),
      cb
    )
  }

  on<T extends keyof GuardEventsKebabToCamelType>(evt: T, handler: Exclude<GuardEventsKebabToCamelType[T], undefined>) {
    (this.eventListeners as any)[evt]!.push(handler as any)
  }

  show() {
    this.visible = true
    this.render()
  }

  hide() {
    this.visible = false
    this.render()
  }

  unmountComponent() {
    const node = Guard.getGuardContainer(this.el)

    if (node) {
      ReactDOM.unmountComponentAtNode(node)
    }
  }
}
