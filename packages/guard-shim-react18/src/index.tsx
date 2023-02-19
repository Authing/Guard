import React from 'react'

import { createRoot, Root } from 'react-dom/client'

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
  JwtTokenStatus,
  User,
  GuardModuleType,
  Lang,
  IGuardConfig,
  LogoutParams
} from './types'

import '@authing/react18-ui-components/lib/index.min.css'

export * from './types'

const isDef = (value: unknown) => value !== undefined

export class Guard {
  public options: GuardOptions

  private visible = false

  private then: () => Promise<any | never>

  private publicConfig?: Record<string, unknown>

  private root?: Root

  constructor(options: GuardOptions) {
    if (!options.appId) {
      throw new Error('appId is required')
    }

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
    options.host = options.host || ''

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
      throw new Error(JSON.stringify(e))
    }

    const _authClientOptions = Object.assign(
      {},
      {
        appId: this.options.appId,
        appHost: this.options.host || `https://${publicConfig.requestHostname}`,
        tenantId: this.options.tenantId,
        redirectUri:
          this.options.redirectUri || publicConfig.oidcConfig.redirect_uris[0],
        tokenEndPointAuthMethod:
          publicConfig.oidcConfig.token_endpoint_auth_method || 'none',
        introspectionEndPointAuthMethod:
          publicConfig.oidcConfig.introspection_endpoint_auth_method || 'none'
      }
    )

    return new AuthenticationClient(_authClientOptions)
  }

  static getGuardContainer(selector?: string | HTMLElement): Element | null {
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

    let publicConfig = {} as any

    try {
      publicConfig = await this.then()
    } catch (e) {
      throw new Error(JSON.stringify(e))
    }

    // 构造 OIDC 授权码 + PKCE 模式登录 URL
    const url = authClient.buildAuthorizeUrl({
      codeChallenge: codeChallengeDigest,
      codeChallengeMethod,
      scope,
      redirectUri:
        this.options.redirectUri || publicConfig.oidcConfig.redirect_uris[0],
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

  async logout(params: LogoutParams = {}) {
    let logoutRedirectUri = ''
    const { redirectUri } = params
    const { logoutRedirectUris } = await this.then()
    const origin = window.location.origin

    try {
      logoutRedirectUri =
        redirectUri && logoutRedirectUris.indexOf(redirectUri) > -1
          ? redirectUri
          : logoutRedirectUris[0] || origin
    } catch (e) {
      logoutRedirectUri = origin
    }

    let logoutUri = ''
    const idToken = localStorage.getItem('idToken')
    const authClient = await this.getAuthClient()

    await authClient.logout()

    if (idToken) {
      logoutUri = authClient.buildLogoutUrl({
        expert: true,
        redirectUri: logoutRedirectUri,
        idToken
      })
    }

    window.location.href = logoutUri || logoutRedirectUri
  }

  async render() {
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

    const target = Guard.getGuardContainer(this.options.config?.target)

    if (!target) {
      return
    }

    const root = (this.root = createRoot(target))

    const style = this.options.style || {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    }

    return root.render(
      <div style={style}>
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
      </div>
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

    if (node && this.root) {
      this.root.unmount()
    }
  }

  getCurrentView() {
    return {
      currentModule: window.$$guard.viewContext?.currentModule,
      currentTab: window.$$guard.viewContext?.currentTab
    }
  }

  async changeView(currentView: string) {
    const [moduleName, tabName] = currentView.split(':')

    if (
      !window.$$guard.viewContext ||
      !window.$$guard.viewContext.changeModule
    ) {
      return
    }

    await window.$$guard.viewContext?.changeModule(moduleName)

    if (!tabName) {
      return
    }

    requestIdleCallback(() => {
      window.$$guard.viewContext?.changeTab(tabName)
    })
  }

  private getAgreementsContext() {
    return window.$$guard.agreementsContext
  }

  checkAllAgreements() {
    const agreementsContext = this.getAgreementsContext()
    agreementsContext?.checkAllAgreements()
  }

  unCheckAllAgreements() {
    const agreementsContext = this.getAgreementsContext()
    agreementsContext?.unCheckAllAgreements()
  }
}
