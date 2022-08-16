import React from 'react'
import ReactDOM from 'react-dom'

import {
  GuardOptions,
  GuardMode,
  GuardEventsCamelToKebabMapping,
  CodeMethod,
  GuardLocalConfig,
  GuardEventListeners,
  GuardEvents,
  ReactAuthingGuard,
  GuardEventsKebabToCamelType
} from './types'

import {
  AuthenticationClient,
  AuthenticationClientOptions
} from 'authing-js-sdk'

import { ajax, AjaxRequest, AjaxResponse } from './ajax'
import { GuardModuleType, Lang } from '@authing/react-ui-components'

export * from './types'

export { AuthenticationClient, AuthenticationClientOptions }

export class Guard {
  private options: GuardOptions

  private visible = false

  private then: () => Promise<any | never>

  private publicConfig?: Record<string, unknown>

  constructor(options: GuardOptions) {
    this.options = Object.assign(
      {},
      {
        host: '',
        mode: 'normal',
        tanentId: '',
        align: 'none',
        config: {
          ...options.config,
          // 向后兼容
          isSSO: options.isSSO || false,
          defaultScenes: options.defaultScene || 'login',
          lang: options.lang || 'zh-CN',
          host: options.host || '',
          mode: options.mode || 'normal'
        }
      },
      options
    )

    const init = (async () => {
      if (this.publicConfig) {
        return this.publicConfig
      }

      const publicConfigRes = await this.getPublicConfig()

      return (this.publicConfig = publicConfigRes.data)
    })()

    this.then = init.then.bind(init)

    this.visible = !!!(options.mode === GuardMode.Modal)
  }

  private getPublicConfig(): Promise<AjaxResponse> {
    const host = `${this.options.host}` || 'https://core.authing.cn'

    const _options: AjaxRequest = {
      method: 'GET',
      url: `${host}/api/v2/applications/${this.options.appId}/public-config`
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
        appHost: this.options.host || `https://${publicConfig.requestHostname}`,
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

  startRegister() {
    this.options.defaultScene = GuardModuleType.REGISTER

    this.options.config = Object.assign({}, this.options.config, {
      defaultScenes: GuardModuleType.REGISTER
    })

    this.unmount()
    this.render()
  }

  async checkLoginStatus() {
    const authClient = await this.getAuthClient()
    const user = await authClient.getCurrentUser()

    if (!user) {
      return
    }

    const token = user.token

    if (!token) {
      return
    }

    const { status } = await authClient.checkLoginStatus(token)

    if (status) {
      return user
    }
  }

  changeLang(lang: Lang) {
    this.options.lang = lang

    this.options.config = Object.assign({}, this.options.config, {
      lang
    })

    this.unmount()
    this.render()
  }

  changeContentCSS(contentCSS: string) {
    this.options.config = Object.assign({}, this.options.config, {
      contentCss: contentCSS
    })

    this.unmount()
    this.render()
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

    const publicConfig = await this.then()
    const authClient = await this.getAuthClient()

    if (this.options.config) {
      this.options.config.host =
        this.options.host || `https://${publicConfig.requestHostname}`
    }

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
