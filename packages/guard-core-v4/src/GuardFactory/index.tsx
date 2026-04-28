import { React, render, unmount, ReactElement } from 'shim-react'

import {
  Guard as ReactAuthingGuard,
  GuardProps,
  GuardEvents,
  GuardEventsCamelToKebabMapping,
  GuardEventsKebabToCamelType,
  GuardModuleType,
  GuardMode,
  IG2FCProps,
  IG2Config,
  User,
  Lang,
  AuthenticationClient
} from '../'

export * from '../'

const isDef = (value: unknown) => value !== undefined

export interface GuardFactoryOptions extends IG2FCProps {
  appId: string
  host?: string
  redirectUri?: string
  mode?: GuardMode
  defaultScene?: GuardModuleType
  tenantId?: string
  lang?: Lang
  isSSO?: boolean
  config?: Partial<IG2Config>
  style?: React.CSSProperties
}

export interface GuardEventListeners {
  [key: string]: Function[]
}

export interface StartWithRedirectOptions {
  codeChallengeMethod?: 'S256' | 'plain'
  scope?: string
  state?: string
  responseType?:
    | 'code'
    | 'code id_token token'
    | 'code id_token'
    | 'code token'
    | 'id_token token'
    | 'id_token'
    | 'none'
  responseMode?: 'query' | 'fragment' | 'form_post'
  nonce?: string
}

export interface LogoutParams {
  redirectUri?: string
  quitCurrentDevice?: boolean
}

export class GuardFactory {
  public options: GuardFactoryOptions

  private visible = false

  private then: () => Promise<any | never>

  private publicConfig?: Record<string, unknown>

  constructor(options: GuardFactoryOptions) {
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

  private adaptOptions(
    options: GuardFactoryOptions,
    config: Partial<IG2Config>
  ) {
    options.host = options.host || ''

    if (isDef(options.isSSO)) {
      ;(config as any).isSSO = options.isSSO
    }

    if (isDef(options.defaultScene)) {
      ;(config as any).defaultScenes = options.defaultScene
    }

    if (isDef(options.lang)) {
      config.lang = options.lang
    }

    if (isDef(options.host)) {
      config.host = options.host
    }

    if (isDef(options.mode)) {
      config.mode = options.mode
    }

    options.config = config

    const normalizedConfig = options.config as any

    if (isDef(normalizedConfig.socialConnectionList)) {
      normalizedConfig.socialConnections = normalizedConfig.socialConnectionList
    }

    if (isDef(normalizedConfig.loginMethod)) {
      normalizedConfig.defaultLoginMethod = normalizedConfig.loginMethod
    }

    if (isDef(normalizedConfig.loginMethodList)) {
      normalizedConfig.loginMethods = normalizedConfig.loginMethodList
    }

    if (isDef(normalizedConfig.registerMethodList)) {
      normalizedConfig.registerMethods = normalizedConfig.registerMethodList
    }

    if (isDef(normalizedConfig.registerMethod)) {
      normalizedConfig.defaultRegisterMethod = normalizedConfig.registerMethod
    }

    if (isDef((normalizedConfig as any).contentCSS)) {
      normalizedConfig.contentCss = normalizedConfig.contentCSS
    }

    return options
  }

  private async getRequestHost() {
    if (this.options.host) {
      return this.options.host
    }

    const publicConfig = await this.then()
    if ((publicConfig as any).requestHostname) {
      return `https://${(publicConfig as any).requestHostname}`
    }

    return 'https://core.authing.cn'
  }

  private async getPublicConfig(): Promise<{
    [prop: string]: any
  }> {
    const host = this.options.host || 'https://core.authing.cn'

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

    const requestHostname = await this.getRequestHost()

    const _authClientOptions = Object.assign(
      {},
      {
        appId: this.options.appId,
        appHost: requestHostname,
        tenantId: this.options.tenantId,
        redirectUri:
          this.options.redirectUri ||
          publicConfig.oidcConfig?.redirect_uris?.[0],
        tokenEndPointAuthMethod:
          publicConfig.oidcConfig?.token_endpoint_auth_method || 'none',
        introspectionEndPointAuthMethod:
          publicConfig.oidcConfig?.introspection_endpoint_auth_method || 'none'
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

  private eventListeners: GuardEventListeners = Object.values(
    GuardEventsCamelToKebabMapping
  ).reduce((acc: GuardEventListeners, evtName: string) => {
    acc[evtName] = []
    return acc
  }, {} as GuardEventListeners)

  /**
   * 启动嵌入模式
   * @param el String
   * @returns Promise
   */
  async start(el?: string): Promise<User> {
    ;(this.options.config as Partial<IG2Config>).target = el

    this.render()

    const userInfo = await this.trackSession()

    if (userInfo) {
      return Promise.resolve(userInfo)
    }

    return new Promise(resolve => {
      this.on('login', (userInfo: User) => {
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

  async checkLoginStatus(): Promise<any | undefined> {
    const authClient = await this.getAuthClient()

    const userInfo = await this.trackSession()

    if (!userInfo) {
      return
    }

    authClient.tokenProvider.setUser(userInfo)

    const accessToken = localStorage.getItem('accessToken')

    if (!accessToken) {
      return
    }

    const requestHostname = await this.getRequestHost()

    const options: RequestInit = {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: accessToken
      })
    }

    try {
      const fetchRes = await fetch(
        `${requestHostname}/api/v2/users/login/check-status`,
        options
      )

      const loginStatusText = await fetchRes.text()

      const loginStatus = JSON.parse(loginStatusText)

      if (loginStatus.code === 200 && loginStatus.status === true) {
        return loginStatus
      }
    } catch (e) {
      return
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

    const codeChallenge = authClient.generateCodeChallenge()

    localStorage.setItem('codeChallenge', codeChallenge)

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

    const url = authClient.buildAuthorizeUrl({
      codeChallenge: codeChallengeDigest,
      codeChallengeMethod,
      scope,
      redirectUri:
        this.options.redirectUri || publicConfig.oidcConfig?.redirect_uris?.[0],
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

    this.setTokenCache(access_token, id_token)
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

  private setTokenCache(accessToken: string, idToken: string) {
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('idToken', idToken)
  }

  private clearTokenCache() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('idToken')
  }

  private async clearLoginCache() {
    const authClient = await this.getAuthClient()
    localStorage.removeItem('codeChallenge')
    authClient.tokenProvider.clearUser()
    this.clearTokenCache()
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

    const idToken =
      authClient.tokenProvider.getToken() || localStorage.getItem('idToken')

    if (!idToken) {
      return null
    }

    const publicConfig = await this.then()

    const requestHostname = await this.getRequestHost()

    const options: RequestInit = {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'x-authing-userpool-id': (publicConfig as any).userPoolId,
        Authorization: idToken
      }
    }

    try {
      const fetchRes = await fetch(
        `${requestHostname}/api/v2/users/me`,
        options
      )

      const userInfoText = await fetchRes.text()

      const { code, data } = JSON.parse(userInfoText)

      if (code === 200) {
        return data
      }

      return null
    } catch (e) {
      return null
    }
  }

  async logout(params: LogoutParams = {}) {
    let logoutRedirectUri = ''
    const { redirectUri, quitCurrentDevice } = params
    const publicConfig: any = await this.then()
    const logoutRedirectUris = publicConfig?.logoutRedirectUris || []
    const origin = window.location.origin

    try {
      logoutRedirectUri =
        redirectUri && logoutRedirectUris.indexOf(redirectUri) > -1
          ? redirectUri
          : logoutRedirectUris[0] || origin
    } catch (e) {
      logoutRedirectUri = origin
    }

    const authClient = await this.getAuthClient()

    try {
      if (quitCurrentDevice) {
        await authClient.logoutCurrent()
      } else {
        await authClient.logout()
      }
    } catch (error) {
      const idToken =
        authClient.tokenProvider.getToken() || localStorage.getItem('idToken')
      if (idToken) {
        logoutRedirectUri = authClient.buildLogoutUrl({
          expert: true,
          redirectUri: logoutRedirectUri,
          idToken
        })
      }
    } finally {
      await this.clearLoginCache()
      window.location.href = logoutRedirectUri
    }
  }

  async render() {
    const evts: GuardEvents = Object.entries(
      GuardEventsCamelToKebabMapping
    ).reduce((acc: GuardEvents, [reactEvt, nativeEvt]: [string, string]) => {
      ;(acc as any)[reactEvt] = (...rest: any) => {
        if (nativeEvt === 'close') {
          this.hide()
        }

        return (
          (this.eventListeners as any)[nativeEvt]
            .map((item: any) => {
              return item(...rest)
            })
            .slice(-1)[0] ?? true
        )
      }
      return acc
    }, {} as GuardEvents)

    const publicConfig = await this.then()
    const authClient = await this.getAuthClient()

    if (this.options.config) {
      this.options.config.host =
        this.options.host || `https://${(publicConfig as any).requestHostname}`
    }

    const guardProps: GuardProps = {
      ...(evts as GuardEvents),
      appId: this.options.appId,
      tenantId: this.options.tenantId,
      config: {
        ...this.options.config,
        style: this.options.style ?? this.options.config?.style ?? {}
      },
      visible: this.visible,
      authClient
    }

    const element: ReactElement = <ReactAuthingGuard {...guardProps} />

    const container = GuardFactory.getGuardContainer(
      this.options.config?.target
    )
    if (!container) {
      throw new Error('Failed to find or create guard container')
    }
    return render({ container, element })
  }

  on<T extends keyof GuardEventsKebabToCamelType>(
    evt: T,
    handler: (userInfo: User) => void
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
    const node = GuardFactory.getGuardContainer(this.options.config?.target)

    if (node) {
      unmount(node)
    }
  }

  getCurrentView() {
    return {
      currentModule: (window as any).$$guard?.viewContext?.currentModule,
      currentTab: (window as any).$$guard?.viewContext?.currentTab
    }
  }

  async changeView(currentView: string) {
    const [moduleName, tabName] = currentView.split(':')

    if (
      !(window as any).$$guard?.viewContext ||
      !(window as any).$$guard?.viewContext?.changeModule
    ) {
      return
    }

    await (window as any).$$guard?.viewContext?.changeModule(moduleName)

    if (!tabName) {
      return
    }

    requestIdleCallback(() => {
      ;(window as any).$$guard?.viewContext?.changeTab(tabName)
    })
  }

  private getAgreementsContext() {
    return (window as any).$$guard?.agreementsContext
  }

  checkAllAgreements() {
    this.getAgreementsContext()?.checkAllAgreements()
  }

  unCheckAllAgreements() {
    this.getAgreementsContext()?.unCheckAllAgreements()
  }
}

export default GuardFactory
