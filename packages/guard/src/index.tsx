import React from 'react'
import ReactDOM from 'react-dom'

import {
  Guard as ReactAuthingGuard,
  GuardMode,
  GuardEvents,
  GuardEventsKebabToCamelType,
  GuardEventsCamelToKebabMapping,
  GuardModuleType,
  Lang,
  User,
  UserConfig,
  GuardScenes,
  LoginMethods,
  getAuthClient,
  CommonMessage,
  initAuthClient,
  RegisterMethods,
  GuardEventsHandler,
  GuardEventsHandlerKebab,
  GuardEventsCamelToKebabMap,
  GuardConfig
} from '@authing/react-ui-components'

import '@authing/react-ui-components/lib/index.min.css'

import { GuardLocalConfig } from '@authing/react-ui-components/components/Guard/config'

import {
  AuthenticationClient,
  AuthenticationClientOptions
} from 'authing-js-sdk'

export {
  GuardMode,
  GuardScenes,
  LoginMethods,
  getAuthClient,
  initAuthClient,
  RegisterMethods,
  GuardEventsCamelToKebabMap,
  GuardEventsCamelToKebabMapping
}

export type {
  GuardConfig,
  GuardLocalConfig,
  GuardEvents,
  User,
  UserConfig,
  CommonMessage,
  GuardEventsHandler,
  AuthenticationClient,
  GuardEventsHandlerKebab,
  GuardEventsKebabToCamelType
}

export type GuardEventListeners = {
  [key in keyof GuardEventsKebabToCamelType]: Exclude<
    Required<GuardEventsKebabToCamelType>[key],
    undefined
  >[]
}

export type CodeMethod = 'S256' | 'plain'

export type Align = 'none' | 'left' | 'center' | 'right'

export interface GuardOptions {
  appId: string
  mode?: 'normal' | 'modal'
  defaultScene?: GuardModuleType
  tenantId?: string
  lang?: Lang
  isSSO?: boolean
  host: string // 私有化部署时的 IP 地址
  scope?: string // OIDC scope
  redirectUri: string
  state?: string // OIDC 状态
  config?: Partial<GuardLocalConfig> // 兼容之前的 config，新用户可不传
  authClientOptions?: AuthenticationClientOptions
  align?: Align
}

export class Guard {
  private appId?: string
  private tenantId?: string
  private config?: Partial<GuardLocalConfig>
  private visible?: boolean
  private el?: string
  public authClient: AuthenticationClient
  private align?: Align

  constructor(options: GuardOptions) {
    const {
      appId,
      mode = 'normal',
      redirectUri,
      isSSO,
      defaultScene,
      lang,
      host,
      tenantId,
      align = 'none',
      config,
      authClientOptions
    } = options

    this.appId = appId
    this.tenantId = tenantId
    this.align = align

    this.config = Object.assign({}, config || {}, {
      isSSO,
      // 向后兼容
      defaultScenes: defaultScene,
      lang,
      host,
      mode
    })

    this.visible = !!!(mode === GuardMode.Modal)

    const _authClientOptions = Object.assign({}, authClientOptions || {}, {
      appId,
      appHost: host,
      redirectUri,
      tokenEndPointAuthMethod: 'none',
      introspectionEndPointAuthMethod: 'none'
    } as AuthenticationClientOptions)

    this.authClient = new AuthenticationClient(_authClientOptions)
  }

  static getGuardContainer(selector?: string | HTMLElement) {
    const defaultId = 'authing_guard_container'

    if (!selector) {
      let container = document.querySelector(`#${defaultId}`)
      if (!container) {
        container = document.createElement('div')
        container.id = defaultId
        document.body.appendChild(container)
      }

      return container
    }

    if (typeof selector === 'string') {
      return document.querySelector(selector)
    }

    return selector
  }

  private eventListeners = Object.values(GuardEventsCamelToKebabMapping).reduce(
    (acc, evtName) => {
      return Object.assign({}, acc, {
        [evtName as string]: []
      })
    },
    {} as GuardEventListeners
  )

  /**
   * 启动嵌入模式
   * @param el String
   * @returns Promise
   */
  async start(el?: string) {
    this.el = el

    this.render()

    const userInfo = await this.trackSession()

    if (userInfo) {
      return Promise.resolve(userInfo)
    }

    return new Promise(resolve => {
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
  startWithRedirect(
    codeChallengeDigestMethod: CodeMethod = 'S256',
    codeChallengeMethod: CodeMethod = 'S256'
  ) {
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

  async handleRedirectCallback() {
    const { code, codeChallenge } = this.getCodeAndCodeChallenge()

    const { id_token, access_token } = await this.getAccessTokenByCode(
      code,
      codeChallenge
    )

    const userInfo = await this.authClient.getUserInfoByAccessToken(
      access_token
    )

    this.setStorageCache(access_token, id_token, userInfo)
  }

  private async getAccessTokenByCode(code: string, codeChallenge: string) {
    return await this.authClient.getAccessTokenByCode(code, {
      codeVerifier: codeChallenge
    })
  }

  private getCodeAndCodeChallenge() {
    const query = this.parseUrlQuery()
    const { code = '' } = query
    const codeChallenge = localStorage.getItem('codeChallenge') || ''

    return {
      code,
      codeChallenge
    }
  }

  private setStorageCache(
    accessToken: string,
    idToken: string,
    userInfo: string
  ) {
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('idToken', idToken)
    localStorage.setItem('userInfo', JSON.stringify(userInfo))
  }

  private parseUrlQuery() {
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
  trackSession() {
    return this.authClient.getCurrentUser()
  }

  logout() {
    const redirectUri = window.location.origin
    const idToken = localStorage.getItem('idToken')
    let logoutUrl = ''

    if (idToken) {
      logoutUrl = this.authClient.buildLogoutUrl({
        expert: true,
        redirectUri,
        idToken
      })
    }

    localStorage.clear()

    window.location.href = logoutUrl || redirectUri
  }

  updateIdToken() {
    return this.authClient.refreshToken()
  }

  render(cb?: () => void) {
    const evts: GuardEvents = Object.entries(
      GuardEventsCamelToKebabMapping
    ).reduce((acc, [reactEvt, nativeEvt]) => {
      return Object.assign({}, acc, {
        [reactEvt]: (...rest: any) => {
          if (nativeEvt === 'close') {
            this.hide()
          }

          // TODO 返回最后一个执行函数的值，实际应该只让监听一次
          return (
            (this.eventListeners as any)[nativeEvt as string]
              .map((item: any) => {
                return item(...rest)
              })
              .slice(-1)[0] ?? true
          )
        }
      })
    }, {} as GuardEvents)

    return ReactDOM.render(
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: this.align
        }}
      >
        <ReactAuthingGuard
          {...(evts as GuardEvents)}
          appId={this.appId}
          tenantId={this.tenantId}
          config={this.config}
          visible={this.visible}
          authClient={this.authClient}
        />
      </div>,
      Guard.getGuardContainer(this.config?.target),
      cb
    )
  }

  on<T extends keyof GuardEventsKebabToCamelType>(
    evt: T,
    handler: Exclude<GuardEventsKebabToCamelType[T], undefined>
  ) {
    ; (this.eventListeners as any)[evt].push(handler as any)
  }

  show() {
    this.visible = true
    this.render()
  }

  hide() {
    this.visible = false
    this.render()
  }

  unmount() {
    const node = Guard.getGuardContainer(this.config?.target)

    if (node) {
      ReactDOM.unmountComponentAtNode(node)
    }
  }
}
