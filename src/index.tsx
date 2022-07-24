import React from 'react'
import ReactDOM from 'react-dom'

import { AuthenticationClient } from 'authing-js-sdk'

import { Guard as ReactAuthingGuard } from '@authing/react-ui-components'

import {
  GuardMode,
  GuardEvents,
  GuardEventsKebabToCamelType,
  GuardEventsCamelToKebabMapping,
  GuardComponentConfig,
  GuardLocalConfig
} from '@authing/react-ui-components'

// import '@authing/react-ui-components/lib/index.min.css'

export interface IGuardOptions {
  appId: string
  config?: Partial<GuardLocalConfig>
  tenantId?: string
  authClient?: AuthenticationClient
}

export type GuardEventListeners = {
  [key in keyof GuardEventsKebabToCamelType]: Exclude<
    Required<GuardEventsKebabToCamelType>[key],
    undefined
  >[]
}

export class Guard {
  private appId = ''
  private config?: Partial<GuardLocalConfig>
  private tenantId?: string
  private authClient?: AuthenticationClient

  private visible?: boolean

  constructor(options: IGuardOptions) {
    const { appId, config, tenantId } = options

    this.appId = appId
    this.config = config
    this.tenantId = tenantId

    this.visible = !!!(config?.mode === GuardMode.Modal)

    this.authClient = new AuthenticationClient({
      appId
    })

    this.render()
  }

  private render(cb?: () => void) {
    const evts: GuardEvents = Object.entries(
      GuardEventsCamelToKebabMapping
    ).reduce((acc, [reactEvt, nativeEvt]) => {
      return Object.assign(acc, {
        [reactEvt]: (...rest: unknown[]) => {
          if (nativeEvt === 'close') {
            this.hide()
          }

          return (
            this.eventListeners[nativeEvt]
              .map((item: any) => {
                return item(...rest)
              })
              .slice(-1)[0] ?? true
          )
        }
      })
    }, {} as GuardEvents)

    ReactDOM.render(
      <ReactAuthingGuard
        {...(evts as GuardEvents)}
        appId={this.appId}
        config={this.config as GuardComponentConfig}
        visible={this.visible}
        tenantId={this.tenantId}
        authClient={this.authClient}
      />,
      Guard.getGuardContainer(this.config?.target),
      cb
    )
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

  private eventListeners: GuardEventListeners = Object.values(
    GuardEventsCamelToKebabMapping
  ).reduce((acc, evtName) => {
    return Object.assign(acc, {
      [evtName as string]: []
    })
  }, {} as GuardEventListeners)

  on<T extends keyof GuardEventsKebabToCamelType>(
    evt: T,
    handler: Exclude<Required<GuardEventsKebabToCamelType>[T], undefined>
  ) {
    // this.eventListeners[evt].push(handler as any)
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
