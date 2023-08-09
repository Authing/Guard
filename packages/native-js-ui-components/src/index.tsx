import React from 'react'
import ReactDOM from 'react-dom'

import {
  Guard as ReactAuthingGuard,
  GuardLocalConfig,
  AuthenticationClient,
  GuardEventsKebabToCamelType,
  GuardMode,
  GuardEventsCamelToKebabMapping,
  GuardEvents,
  GuardProps
} from '@authing/guard-shim-react'

import '@authing/guard-shim-react/dist/guard.min.css'

export * from '@authing/guard-shim-react'

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
  [key in keyof GuardEventsKebabToCamelType]: Exclude<
    Required<GuardEventsKebabToCamelType>[key],
    undefined
  >[]
}

export class Guard {
  public appId?: string
  public config?: Partial<GuardLocalConfig>
  public tenantId?: string
  public authClient?: AuthenticationClient

  public visible?: boolean
  constructor(props?: NativeGuardProps)
  constructor(
    appId?: string,
    config?: Partial<GuardLocalConfig>,
    tenantId?: string,
    authClient?: AuthenticationClient
  )

  constructor(
    appIdOrProps?: string | NativeGuardProps,
    config?: Partial<GuardLocalConfig>,
    tenantId?: string,
    authClient?: AuthenticationClient
  ) {
    if (appIdOrProps && typeof appIdOrProps !== 'string') {
      const {
        appId,
        config: configProps,
        tenantId: tenantIdProps,
        authClient: authClientProps
      } = appIdOrProps
      this.appId = appId
      this.config = configProps
      this.tenantId = tenantIdProps
      this.authClient = authClientProps
    } else {
      this.appId = appIdOrProps
      this.config = config
      this.tenantId = tenantId
      this.authClient = authClient
    }

    this.visible = this.config?.mode === GuardMode.Modal ? false : true

    this.render()
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

  public render(): void
  public render(aliginOrCb: () => void): void
  public render(aliginOrCb: 'none' | 'center' | 'left' | 'right'): void
  public render(
    aliginOrCb: 'none' | 'center' | 'left' | 'right',
    callback: () => void
  ): void
  public render(aliginOrCb?: any, cb?: any) {
    const l = arguments.length
    let align: 'none' | 'center' | 'left' | 'right'

    let callback: (() => void) | undefined
    if (l === 0) {
      align = 'none'
    } else if (l === 1) {
      if (typeof aliginOrCb === 'function') {
        align = 'none'
        callback = aliginOrCb
      } else {
        align = aliginOrCb
      }
    } else if (l === 2) {
      align = aliginOrCb
      callback = cb
    } else {
      throw new Error('参数格式错误')
    }

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
              // @ts-ignore
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
          justifyContent: align
        }}
      >
        <ReactAuthingGuard
          {...(evts as GuardEvents)}
          appId={this.appId}
          config={this.config as GuardProps['config']}
          visible={this.visible}
          tenantId={this.tenantId}
          authClient={this.authClient}
        />
      </div>,
      Guard.getGuardContainer(this.config?.target),
      callback
    )
  }

  on<T extends keyof GuardEventsKebabToCamelType>(
    evt: T,
    handler: Exclude<GuardEventsKebabToCamelType[T], undefined>
  ) {
    ;(this.eventListeners as any)[evt]!.push(handler as any)
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
    const node = Guard.getGuardContainer(this.config?.target)

    if (node) {
      ReactDOM.unmountComponentAtNode(node)
    }
  }
}
