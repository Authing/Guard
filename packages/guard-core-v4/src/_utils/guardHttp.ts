import { getVersion } from './getVersion'

import { getFlowHandle, getTriggerId, getWorkflowId } from './flowHandleStorage'

import { AuthingGuardResponse, AuthingResponse, requestClient } from './http'

import { errorCodeInterceptor } from './responseManagement'

import { CodeAction } from './responseManagement/interface'

let httpClient: GuardHttp

const version = getVersion()

enum InterceptorName {
  ERROR_CODE = 'errorCode'
}

type ResponseInterceptor = (res: AuthingResponse) => AuthingResponse

export class GuardHttp {
  private requestClient: any
  private headers: Record<string, string> = {
    'x-authing-userpool-id': '',
    'x-authing-app-id': '',
    'x-authing-sdk-version': version,
    'x-authing-request-from': `Guard@${version}`
  }

  private responseInterceptorMap: Map<InterceptorName, ResponseInterceptor> =
    new Map()

  constructor(baseUrl?: string) {
    if (!baseUrl) return
    this.getRequestClient().setBaseUrl(baseUrl)
  }

  private getRequestClient() {
    if (!this.requestClient) {
      this.requestClient = requestClient
    }

    return this.requestClient
  }

  setUserpoolId(userpoolId: string) {
    this.headers['x-authing-userpool-id'] = userpoolId
    return this
  }

  setAppId(appId: string) {
    this.headers['x-authing-app-id'] = appId
    return this
  }

  setTenantId(tenantId: string) {
    this.headers['x-authing-app-tenant-id'] = tenantId
    return this
  }

  setDeviceId(deviceId: string) {
    this.headers['x-authing-device-id'] = deviceId
    return this
  }

  setBaseUrl(baseUrl: string) {
    this.getRequestClient().setBaseUrl(baseUrl)
    return this
  }

  public getHeaders = () => this.headers

  public get = async <T = any>(
    path: string,
    query: Record<string, any> = {},
    config?: any
  ): Promise<AuthingGuardResponse<T>> => {
    const res = await requestClient.get<T>(path, query, {
      ...config,
      headers: { ...this.headers, ...config?.headers }
    })
    return this.responseIntercept(res)
  }

  public post = async <T = any>(
    path: string,
    data: any,
    config?: {
      headers: any
    }
  ): Promise<AuthingGuardResponse<T>> => {
    const res = await requestClient.post<T>(path, data, {
      headers: {
        ...this.headers,
        ...config?.headers
      }
    })
    return this.responseIntercept(res)
  }

  public postForm = async <T = any>(
    path: string,
    formData: any,
    config?: {
      headers: any
    }
  ): Promise<AuthingGuardResponse<T>> => {
    const res = await requestClient.postForm<T>(path, formData, {
      headers: {
        ...this.headers,
        ...config?.headers
      }
    })

    return this.responseIntercept(res)
  }

  public authFlow = async <T = any>(
    action: string,
    data?: any
  ): Promise<AuthingGuardResponse<T>> => {
    let flowPath = '/interaction/authFlow'

    const flowHandle = getFlowHandle()
    const triggerId = getTriggerId()
    const workflowId = getWorkflowId()

    const requestData = {
      action,
      data,
      flowHandle
    }
    if (workflowId && triggerId) {
      flowPath = '/interaction/authFlow-process'
      Object.assign(requestData, {
        workflowId,
        triggerId
      })
    }

    const res = await requestClient.post<T>(flowPath, requestData, {
      headers: {
        ...this.headers
      }
    })

    return this.responseIntercept(res)
  }

  // 初始化 Error code 拦截器
  public initErrorCodeInterceptor = (
    callBack: (code: CodeAction, res: AuthingResponse) => AuthingGuardResponse
  ) => {
    // 初始化 errorCode 响应拦截器
    if (this.responseInterceptorMap.has(InterceptorName.ERROR_CODE)) return

    this.responseInterceptorMap.set(
      InterceptorName.ERROR_CODE,
      res => errorCodeInterceptor(res, callBack) // 传入调度拦截器回调
    )

    return this
  }

  public responseIntercept: (res: AuthingResponse) => AuthingGuardResponse = (
    res: AuthingGuardResponse
  ) => {
    if (this.responseInterceptorMap.size === 0) return res

    const interceptors = Array.from(this.responseInterceptorMap.values())

    return interceptors.reduce((acc, cur) => cur(acc), res)
  }
}

export const initGuardHttp = (baseUrl: string) => {
  if (!httpClient) {
    const guardHttp = new GuardHttp(baseUrl)
    httpClient = guardHttp
  }

  return httpClient
}

export const getGuardHttp = () => {
  if (!httpClient) {
    throw new Error('Please initialize Http Client')
  }

  return httpClient
}

export const useGuardHttp = () => getGuardHttp()
