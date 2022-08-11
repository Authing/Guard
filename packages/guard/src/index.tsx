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

import { ajax, AjaxRequest, AjaxResponse } from './ajax'

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
  host?: string
  redirectUri?: string
  mode?: 'normal' | 'modal'
  defaultScene?: GuardModuleType
  tenantId?: string
  lang?: Lang
  isSSO?: boolean
  scope?: string // OIDC scope
  state?: string // OIDC 状态
  config?: Partial<GuardLocalConfig> // 兼容之前的 config，新用户可不传
  authClientOptions?: AuthenticationClientOptions
  align?: Align
}

export class Guard {
  private options: GuardOptions
  private visible = false
  private then: () => Promise<any | never>

  constructor(options: GuardOptions) {
    this.options = Object.assign(
      {},
      {
        host: 'https://core.authing.cn',
        mode: 'normal',
        tanentId: '',
        align: 'none',
        config: Object.assign({}, options.config || {}, {
          // 向后兼容
          isSSO: options.isSSO,
          defaultScenes: options.defaultScene,
          lang: options.lang,
          host: options.host,
          mode: options.mode
        })
      },
      options
    )

    const init = (async () => {
      const publicConfigRes = await this.getPublicConfig()
      return publicConfigRes.data
    })()
    this.then = init.then.bind(init)

    this.visible = !!!(options.mode === GuardMode.Modal)
  }

  private getPublicConfig(): Promise<AjaxResponse> {
    const _options: AjaxRequest = {
      method: 'GET',
      url: `${this.options.host}/api/v2/applications/${this.options.appId}/public-config`
    }
    return ajax(_options)
  }

  async getAuthClient() {
    const publicConfig = await this.then()

    const _authClientOptions = Object.assign(
      {},
      this.options.authClientOptions || {},
      {
        appId: this.options.appId,
        appHost: this.options.host,
        redirectUri:
          this.options.redirectUri || publicConfig.oidcConfig.redirect_uris[0],
        tokenEndPointAuthMethod:
          publicConfig.oidcConfig.token_endpoint_auth_method || 'none',
        introspectionEndPointAuthMethod:
          publicConfig.oidcConfig.introspection_endpoint_auth_method || 'none'
      } as AuthenticationClientOptions
    )

    return new AuthenticationClient(_authClientOptions)
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
  async start(el: string) {
    ;(this.options.config as Partial<GuardLocalConfig>).target = el

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
  async startWithRedirect(
    codeChallengeDigestMethod: CodeMethod = 'S256',
    codeChallengeMethod: CodeMethod = 'S256'
  ) {
    const authClient = await this.getAuthClient()

    // 生成一个 code_verifier
    const codeChallenge = authClient.generateCodeChallenge()

    localStorage.setItem('codeChallenge', codeChallenge)

    // 计算 code_verifier 的 SHA256 摘要
    const codeChallengeDigest = authClient.getCodeChallengeDigest({
      codeChallenge,
      method: codeChallengeDigestMethod
    })

    // 构造 OIDC 授权码 + PKCE 模式登录 URL
    const url = authClient.buildAuthorizeUrl({
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

    const authClient = await this.getAuthClient()

    const userInfo = await authClient.getUserInfoByAccessToken(access_token)

    this.setStorageCache(access_token, id_token, userInfo)
  }

  private async getAccessTokenByCode(code: string, codeChallenge: string) {
    const authClient = await this.getAuthClient()

    return await authClient.getAccessTokenByCode(code, {
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
  async trackSession() {
    const authClient = await this.getAuthClient()

    return authClient.getCurrentUser()
  }

  async logout() {
    const redirectUri = window.location.origin
    const idToken = localStorage.getItem('idToken')
    let logoutUrl = ''

    const authClient = await this.getAuthClient()

    if (idToken) {
      logoutUrl = authClient.buildLogoutUrl({
        expert: true,
        redirectUri,
        idToken
      })
    }

    localStorage.clear()

    window.location.href = logoutUrl || redirectUri
  }

  async updateIdToken() {
    const authClient = await this.getAuthClient()

    return authClient.refreshToken()
  }

  async render(cb?: () => void) {
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

    const authClient = await this.getAuthClient()

    return ReactDOM.render(
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: this.options.align
        }}
      >
        <ReactAuthingGuard
          {...(evts as GuardEvents)}
          appId={this.options.appId}
          tenantId={this.options.tenantId}
          config={this.options.config}
          visible={this.visible}
          authClient={authClient}
        />
      </div>,
      Guard.getGuardContainer(this.options.config?.target),
      cb
    )
  }

  on<T extends keyof GuardEventsKebabToCamelType>(
    evt: T,
    handler: Exclude<GuardEventsKebabToCamelType[T], undefined>
  ) {
    ;(this.eventListeners as any)[evt].push(handler as any)
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
    const node = Guard.getGuardContainer(this.options.config?.target)

    if (node) {
      ReactDOM.unmountComponentAtNode(node)
    }
  }
}
