import { React } from 'shim-react'

import { sleep } from '../../_utils'

import { useGuardFinallyConfig } from '../../_utils/context'

import { AuthingGuardResponse, AuthingResponse } from '../../_utils/http'

import { CodeStatus } from '../UiQrCode'

import { CodeStatusDescriptions } from '../WorkQrCode'

import { ReducerType, RootState } from './usePreQrCode'

const { useCallback, useEffect } = React

export interface QrCodeResponse {
  /**
   * 根据状态确定不同的流程
   */
  status: number
  /**
   * 返回的随机值
   */
  random: number
  /**
   * 返回的用户信息
   */
  userInfo?: any
  /**
   * 扫码成功后 Tick 换取用户信息
   */
  ticket?: string
  /**
   * MFA 状态下的返回
   */
  scannedResult?: AuthingResponse
}

/**
 * 二维码请求相关
 */
interface QrCodeRequest {
  genCodeRequest?: () => Promise<
    AuthingGuardResponse<{
      random: string
      url: string
    }>
  >
  /**
   * 未扫码下的请求方法
   */
  readyCheckedRequest?: () => Promise<AuthingGuardResponse<QrCodeResponse>>
  /**
   * 已经扫码下的请求方法（待确认）
   */
  alreadyCheckedRequest?: () => Promise<AuthingGuardResponse<QrCodeResponse>>
  /**
   * 使用 ticket 交换用户信息
   */
  exchangeUserInfo?: (ticket: string) => Promise<any>
}

interface QrCodeOptions {
  state: RootState
  dispatch: React.Dispatch<{
    type: ReducerType
    payload: Partial<RootState>
  }>
  descriptions: CodeStatusDescriptions
  /**
   * check 轮询间隔时间
   */
  sleepTime?: number
  /**
   * 状态改变时触发事件，仅在 Server 返回的二维码状态改变时进行触发
   */
  onStatusChange?: (status: CodeStatus, data: QrCodeResponse) => void
}

/**
 * 二维码处理阶段
 * 二维码处理阶段分为两个主要流程
 * 1. 同一状态下的轮询逻辑处理
 * 2. 根据不同返回状态码进行处理
 */
export const useQrCode = (options: QrCodeOptions, request: QrCodeRequest) => {
  let destroy = false

  const { state, dispatch, sleepTime, onStatusChange } = options

  const finallyConfig = useGuardFinallyConfig()

  const {
    readyCheckedRequest,
    alreadyCheckedRequest,
    exchangeUserInfo,
    genCodeRequest
  } = request

  /**
   * 根据 Server 返回的状态码决定对应的二维码展示状态
   * @param res
   * @returns
   */
  const getStatusByRes = useCallback((res: QrCodeResponse) => {
    const lists: CodeStatus[] = [
      'expired',
      'ready',
      'already',
      'success',
      'cancel',
      'MFA',
      'error'
    ]
    const index = res.status + 1
    return lists[index]
  }, [])

  // 根据响应
  const processReady = async () => {
    if (
      state.status === 'ready' &&
      readyCheckedRequest &&
      !finallyConfig?._closeLoopCheckQrcode
    ) {
      sleepTime && (await sleep(sleepTime))
      // 再次发起请求
      uniteRequestHandler(readyCheckedRequest)
    }
  }

  // already 待确认状态的请求方法
  const processAReady = async () => {
    if (
      state.status === 'already' &&
      alreadyCheckedRequest &&
      !finallyConfig?._closeLoopCheckQrcode
    ) {
      sleepTime && (await sleep(sleepTime))
      uniteRequestHandler(alreadyCheckedRequest)
    }
  }

  // TODO: 方法留着，以后业务扩充。当状态改变时，内部需要处理的状态
  // success 下的处理
  const processSuccess = () => {
    if (state.status === 'success') {
      // changeDesc(descriptions.success)
    }
  }

  // 处理过期
  const processExpired = () => {
    if (state.status === 'expired') {
      // changeDesc(descriptions.expired)
    }
  }

  // 处理用户取消确认
  const processCancel = () => {
    if (state.status === 'cancel') {
      // changeDesc(descriptions.cancel)
    }
  }

  // 处理 MFA 状态的函数
  const processMFA = () => {
    if (state.status === 'MFA') {
      // changeDesc(descriptions.MFA)
    }
  }

  // Server 返回未知错误
  const processError = () => {
    // 修改 status 同时修改
    if (state.status === 'error') {
      // changeDesc(descriptions.error)
    }
  }

  /**
   * 触发事件
   * @param status
   * @param data
   */
  const emitEvents = async (status: CodeStatus, data: QrCodeResponse) => {
    if (data.ticket && exchangeUserInfo) {
      const { data: user } = await exchangeUserInfo(data.ticket)
      onStatusChange && onStatusChange(status, { ...user, ticket: data.ticket })
    } else {
      onStatusChange && onStatusChange(status, data)
    }
  }

  /**
   * Server 接口返回才会进入：根据不同返回码进行流转
   */
  const processFlowByResponse: (res: QrCodeResponse) => void = (
    res: QrCodeResponse
  ) => {
    if (destroy) {
      return
    }
    const prev = state.status
    const next = getStatusByRes(res)
    const statusWillChange = prev !== next
    // 状态已经改变 交给状态的 Handler 来改变
    if (statusWillChange) {
      // 改变状态
      changeStatus(next)
      // 触发改变状态的用户事件
      emitEvents(next, res)
      return
    }
    // 状态未改变 交给 ResponseFlow 处理
    processResponseFlow(res)
  }

  /**
   * Loading 状态的处理函数
   */
  const processLoading = async () => {
    // 重新切换为 Loading 时，重新调用生成二维码的方式
    if (genCodeRequest) {
      const { data } = await genCodeRequest()
      if (data) {
        const { url, random } = data
        dispatch({
          type: 'change',
          payload: {
            src: url,
            random
          }
        })
      }
    }
  }

  /**
   * 响应状态未改变下的 Flow 处理
   * @param res
   */
  const processResponseFlow = (res: QrCodeResponse) => {
    // 未改变状态 进入处理流程
    switch (res.status) {
      // 过期
      case -1:
        processExpired()
        break
      // 未扫码状态
      case 0:
        processReady()
        break
      // 已经扫码
      case 1:
        processAReady()
        break
      // 成功状态
      case 2:
        processSuccess()
        break
      // 取消状态
      case 3:
        processCancel()
        break
      // mfa 状态
      case 4:
        processMFA()
        break
      // 未知错误
      case 5:
        processError()
        break
      default:
        throw new Error(`不满足的Server Code:${res.status}`)
    }
  }

  /**
   * 更改状态
   * @param status
   * @returns
   */
  const changeStatus = (status: CodeStatus) =>
    dispatch({
      type: 'changeStatus',
      payload: {
        status
      }
    })

  /**
   * 更改描述
   * @param description
   * @returns
   */
  // const changeDesc = (description?: ReactNode) =>
  //   dispatch({
  //     type: 'changeDesc',
  //     payload: {
  //       description,
  //     },
  //   })

  /**
   * 共用的统一的请求处理
   */
  const uniteRequestHandler = async (
    request: () => Promise<AuthingGuardResponse<QrCodeResponse>>
  ) => {
    try {
      // 状态切换时 请求还在请求中，所以状态切换完毕后
      const { data } = await request()
      if (data) {
        await processFlowByResponse(data)
      } else {
        throw new Error('返回数据不匹配')
      }
    } catch (e: any) {
      changeStatus('error')
    }
  }

  // 每个状态下的处理函数
  const flowHandlers = {
    loading: processLoading,
    ready: processReady,
    already: processAReady,
    success: processSuccess,
    error: processError,
    expired: processExpired,
    cancel: processCancel,
    MFA: processMFA
  }

  // 每次状态变化流转下一个 flowHandler
  useEffect(() => {
    const handler = flowHandlers[state.status]
    handler()
    return () => {
      // 阻止上一次 Render 内的作用域方法
      destroy = true
    }
  }, [state.status])
}
