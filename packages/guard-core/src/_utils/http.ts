import qs from 'qs'

import { i18n } from './locales'

import { CodeAction } from './responseManagement/interface'

import Axios, { AxiosRequestConfig, CancelTokenSource } from 'axios'

import { getCurrentLng } from '.'

export const requestClient = async (...rest: Parameters<typeof fetch>) => {
  const res = await fetch(...rest)
  return res.json()
}

export interface AuthingResponse<T = any> {
  code?: number
  statusCode?: number
  apiCode?: number
  data?: T
  messages?: string
  message?: string
  flowHandle?: string
}

export interface AuthingGuardResponse<T = any> extends AuthingResponse<T> {
  onGuardHandling?: () => CodeAction
  isFlowEnd?: boolean
}

const timeoutAction = (cancel: CancelTokenSource['cancel']) => {
  const timer = 10
  return new Promise(resolve => {
    setTimeout(() => {
      const response = {
        data: {
          code: -1
        }
      }
      resolve(response)

      cancel() // 发送终止信号
    }, timer * 1000)
  })
}

requestClient.get = async <T>(
  path: string,
  query: Record<string, any> = {},
  init?: AxiosRequestConfig
): Promise<AuthingResponse<T>> => {
  // let controller = new AbortController()
  // let signal = controller.signal

  const headers: Record<string, any> = {
    ...init?.headers,
    'Content-Type': 'application/json',
    [requestClient.langHeader]: getCurrentLng()
  }

  if (requestClient.tenantId !== '')
    headers[requestClient.tenantHeader] = requestClient.tenantId
  try {
    const CancelToken = Axios.CancelToken
    const source = CancelToken.source()

    const res: any = await Promise.race([
      timeoutAction(source.cancel),
      Axios(
        `${requestClient.baseUrl}${path}${qs.stringify(query, {
          addQueryPrefix: true
        })}`,
        {
          method: 'GET',
          ...init,
          withCredentials: true,
          headers,
          cancelToken: source.token
        }
      )
    ])
    return res?.data
  } catch (e) {
    return Promise.resolve({
      code: -2
    })
  }
}

requestClient.post = async <T>(
  path: string,
  data: any,
  config?: {
    headers: any
  }
): Promise<AuthingResponse<T>> => {
  // let controller = new AbortController()
  // let signal = controller.signal

  const headers: Record<string, any> = {
    ...config?.headers,
    'Content-Type': 'application/json',
    [requestClient.langHeader]: i18n.language
  }

  if (requestClient.tenantId !== '')
    headers[requestClient.tenantHeader] = requestClient.tenantId

  try {
    const CancelToken = Axios.CancelToken
    const source = CancelToken.source()

    const res: any = await Promise.race([
      timeoutAction(source.cancel),
      Axios(`${requestClient.baseUrl}${path}`, {
        data,
        method: 'POST',
        withCredentials: true,
        cancelToken: source.token,
        headers: {
          'Content-Type': 'application/json',
          ...config?.headers,
          [requestClient.langHeader]: getCurrentLng()
        }
      })
    ])
    return res?.data
  } catch (e) {
    return Promise.resolve({
      code: -2
    })
  }

  // const res = await fetch(`${requestClient.baseUrl}${path}`, {
  //   method: 'POST',
  //   body: JSON.stringify(data),
  //   credentials: 'include',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     ...config?.headers,
  //     [requestClient.langHeader]: i18n.language,
  //   },
  // })
}

requestClient.postForm = async <T>(
  path: string,
  formData: any,
  config?: {
    headers: any
  }
): Promise<AuthingResponse<T>> => {
  // let controller = new AbortController()
  // let signal = controller.signal
  try {
    const CancelToken = Axios.CancelToken
    const source = CancelToken.source()

    const res: any = await Promise.race([
      timeoutAction(source.cancel),
      Axios(`${requestClient.baseUrl}${path}`, {
        method: 'POST',
        data: formData,
        withCredentials: true,
        cancelToken: source.token,
        headers: {
          ...config?.headers,
          [requestClient.langHeader]: getCurrentLng()
        }
      })
    ])

    return res?.data
  } catch (e) {
    return Promise.resolve({
      code: -2
    })
  }
}

requestClient.baseUrl = ''
requestClient.setBaseUrl = (base: string) => {
  requestClient.baseUrl = base.replace(/\/$/, '')
}

const DEFAULT_LANG_HEADER = 'x-authing-lang'
const DEFAULT_TENANT_HEADER = 'x-authing-app-tenant-idåå'
requestClient.langHeader = DEFAULT_LANG_HEADER
requestClient.tenantHeader = DEFAULT_TENANT_HEADER
requestClient.tenantId = ''

requestClient.setLangHeader = (key: string | undefined) => {
  requestClient.langHeader = key || DEFAULT_LANG_HEADER
}

requestClient.setTenantHeader = (key: string | undefined) => {
  requestClient.tenantHeader = key || DEFAULT_LANG_HEADER
}

requestClient.setTenantId = (tenantId: string) => {
  requestClient.tenantId = tenantId
}
