import React from 'react'

import ReactDOM from 'react-dom'

import {
  GuardOptions,
  GuardMode,
  GuardEventsCamelToKebabMapping,
  GuardLocalConfig,
  GuardEventListeners,
  GuardEvents,
  Guard as ReactAuthingGuard,
  GuardEventsKebabToCamelType,
  StartWithRedirectOptions,
  AuthenticationClient,
  AuthenticationClientOptions,
  JwtTokenStatus,
  RefreshToken,
  User,
  GuardModuleType,
  Lang,
  IGuardConfig
} from './types'

import '@authing/react-ui-components/lib/index.min.css'

export * from './types'

const isDef = (value: unknown) => value !== undefined

export class Guard {
  public options: GuardOptions

  private visible = false

  private then: () => Promise<any | never>

  private publicConfig?: Record<string, unknown>

  constructor(options: GuardOptions) {
    if (!options.appId) {
      throw new Error('appId is required')
    }

    options.host = options.host || ''
    options.align = options.align || 'center'
    options.justify = options.justify || 'center'

    const config = {
      ...options.config
    }

    this.options = this.adaptOptions(options, config)

    const init = (async () => {
      if (this.publicConfig) {
        return this.publicConfig
      }

      const publicConfigRes = await this.getPublicConfig()

      return (this.publicConfig = publicConfigRes.data)
    })()

    this.then = init.then.bind(init)

    this.visible = !!(options.mode === GuardMode.Modal)
  }

  private adaptOptions(options: GuardOptions, config: Partial<IGuardConfig>) {
    if (isDef(options.isSSO)) {
      config.isSSO = options.isSSO
    }

    if (isDef(options.defaultScene)) {
      // @ts-ignore
      config.defaultScenes = options.defaultScene
    }

    if (isDef(options.lang)) {
      config.lang = options.lang
    }

    if (isDef(options.host)) {
      config.host = options.host
    }

    if (isDef(options.mode)) {
      // @ts-ignore
      config.mode = options.mode
    }

    options.config = config

    if (isDef(options.config.socialConnectionList)) {
      // @ts-ignore
      options.config.socialConnections = options.config.socialConnectionList
    }

    if (isDef(options.config.loginMethod)) {
      // @ts-ignore
      options.config.defaultLoginMethod = options.config.loginMethod
    }

    if (isDef(options.config.loginMethodList)) {
      // @ts-ignore
      options.config.loginMethods = options.config.loginMethodList
    }

    if (isDef(options.config.registerMethodList)) {
      // @ts-ignore
      options.config.registerMethods = options.config.registerMethodList
    }

    if (isDef(options.config.registerMethod)) {
      // @ts-ignore
      options.config.defaultRegisterMethod = options.config.registerMethod
    }

    if (isDef(options.config.contentCSS)) {
      options.config.contentCss = options.config.contentCSS
    }

    return options
  }

  private async getPublicConfig(): Promise<{
    [prop: string]: any
  }> {
    const host = `${this.options.host}` || 'https://core.authing.cn'

    const options: RequestInit = {
      method: 'GET',
      credentials: 'include'
    }

    const fetchRes = await fetch(
      `${host}/api/v2/applications/${this.options.appId}/public-config`,
      options
    )

    const publicConfig = await fetchRes.text()

    return JSON.parse(publicConfig)
  }

  async getAuthClient(): Promise<AuthenticationClient> {
    let publicConfig = {} as any

    try {
      publicConfig = await this.then()
    } catch (e) {
      console.error('publicConfig error: ', e)
    }

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
      const res = document.querySelector(selector)
      if (!res) {
        console.warn(
          `Failed to start guard: target selector "${selector}" returned null.`
        )
      }
      return res
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
  async start(el?: string): Promise<User> {
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

  async checkLoginStatus(): Promise<JwtTokenStatus | undefined> {
    const authClient = await this.getAuthClient()
    const user = await authClient.getCurrentUser()

    if (!user) {
      return
    }

    const token = user.token

    if (!token) {
      return
    }

    const loginStatus: JwtTokenStatus = await authClient.checkLoginStatus(token)

    if (loginStatus.status) {
      return loginStatus
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
   */
  async startWithRedirect(options: StartWithRedirectOptions = {}) {
    const getRandom = () => Math.random().toString().slice(2)

    const {
      codeChallengeMethod = 'S256',
      scope = 'openid profile email phone address',
      redirectUri,
      state = getRandom(),
      nonce = getRandom(),
      responseMode = 'query',
      responseType = 'code'
    } = options

    const authClient = await this.getAuthClient()

    // 生成一个 code_verifier
    const codeChallenge = authClient.generateCodeChallenge()

    localStorage.setItem('codeChallenge', codeChallenge)

    // 计算 code_verifier 的 SHA256 摘要
    const codeChallengeDigest = authClient.getCodeChallengeDigest({
      codeChallenge,
      method: codeChallengeMethod
    })

    // 构造 OIDC 授权码 + PKCE 模式登录 URL
    const url = authClient.buildAuthorizeUrl({
      codeChallenge: codeChallengeDigest,
      codeChallengeMethod,
      scope,
      redirectUri,
      state,
      nonce,
      responseMode,
      responseType
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

    let queryString = ''

    try {
      queryString = window.location.search.split('?')[1]
    } catch (e) {
      queryString = window.location.hash.split('#')[1]
    }

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
  async trackSession(): Promise<User | null> {
    const authClient = await this.getAuthClient()

    return authClient.getCurrentUser()
  }

  async logout() {
    const publicConfig = await this.then()

    let redirectUri = ''

    const origin = window.location.origin

    try {
      redirectUri = publicConfig.logoutRedirectUris[0]
    } catch (e) {
      redirectUri = origin
    } finally {
      if (!redirectUri) {
        redirectUri = origin
      }
    }

    const idToken = localStorage.getItem('idToken')
    let logoutUrl = ''
    const authClient = await this.getAuthClient()

    authClient.logout()

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

  async updateIdToken(): Promise<RefreshToken> {
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
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
          display: 'flex',
          alignItems: this.options.align,
          justifyContent: this.options.justify
        }}
      >
        <ReactAuthingGuard
          {...(evts as GuardEvents)}
          appId={this.options.appId}
          tenantId={this.options.tenantId}
          config={this.options.config}
          facePlugin={this.options.facePlugin}
          appendConfig={this.options.appendConfig}
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
