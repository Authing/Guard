import { React, ForwardRefRenderFunction } from 'shim-react'

import Axios from 'axios'

import { ShieldSpin } from '../ShieldSpin'

import { useGuardHttpClient } from '../_utils/context'

import { usePreQrCode } from './hooks/usePreQrCode'

import { QrCodeResponse, useQrCode } from './hooks/usePostQrCode'

import { CodeStatus, UiQrCode, LinkQrcode, UiQrProps } from './UiQrCode'

const { forwardRef, useCallback, useImperativeHandle, useMemo } = React

/**
 * 二维码不同状态下的底部描述文字
 */
export type CodeStatusDescriptions = Partial<
  Record<
    Exclude<CodeStatus, 'loading'>,
    React.ReactNode | ((referQrCode?: () => void) => React.ReactNode)
  >
>

export interface WorkQrCodeRef {
  referQrCode: () => Promise<
    | {
        random: string
        url: string
      }
    | undefined
  >
}

interface WorkQrCodeProps extends Omit<UiQrProps, 'description' | 'status'> {
  /**
   * 二维码场景
   */
  scene: 'WXAPP_AUTH' | 'APP_AUTH' | 'WECHATMP_AUTH' | 'ZJ_AUTH'
  /**
   * 不同状态请求文字
   */
  descriptions: CodeStatusDescriptions
  /**
   * 睡眠时间 默认 1000
   */
  sleepTime?: number
  /**
   * 每当状态变化时，触发的 callback 。
   */
  onStatusChange?: (status: CodeStatus, data: QrCodeResponse) => void
  /**
   * 不同状态下点击遮罩中间区域方法
   */
  onClickMaskContent?: (status: CodeStatus) => void
  /**
   * 不同二维码下生成配置
   */
  qrCodeScanOptions?: any
}

const WorkQrCodeComponent: ForwardRefRenderFunction<any, WorkQrCodeProps> = (
  props,
  ref
) => {
  const {
    scene,
    descriptions,
    sleepTime = 1000,
    onStatusChange,
    onClickMaskContent,
    qrCodeScanOptions = {},
    ...rest
  } = props

  const { context, customData, withCustomData, extIdpConnId } =
    qrCodeScanOptions

  const { get, post } = useGuardHttpClient()

  /**
   * 生成图片
   */
  const genCodeRequest = useCallback(
    () =>
      post<{ random: string; url: string }>('/api/v2/qrcode/gene', {
        autoMergeQrCode: false,
        scene,
        /**
         * 请求上下文，将会传递到 Pipeline 中
         */
        context,
        /**
         * 是否获取用户自定义数据
         */
        params: customData,
        /**
         * 是否获取用户自定义数据
         */
        withCustomData,
        /**
         * 多租户用的额外的 Idp Id。
         */
        extIdpConnId
      }),
    [scene, post, context, customData, extIdpConnId, withCustomData]
  )

  const { state, dispatch } = usePreQrCode()

  /**
   * 状态检查方法
   */
  const checkedRequest = useCallback(
    async () => get(`/api/v2/qrcode/check?random=${state.random}`),
    [state.random, get]
  )

  /**
   * 交换用户信息方法
   */
  const exchangeUserInfo = useCallback(
    async (ticket: string) =>
      post('/api/v2/qrcode/userinfo', {
        ticket
      }),
    [post]
  )

  useQrCode(
    {
      state,
      dispatch,
      sleepTime,
      descriptions,
      onStatusChange
    },

    {
      genCodeRequest,
      exchangeUserInfo,
      readyCheckedRequest: checkedRequest,
      alreadyCheckedRequest: checkedRequest
    }
  )

  /**
   * 二维码渲染完成后重置状态
   */
  const onLoadQrcCode = () => {
    dispatch({
      type: 'changeStatus',
      payload: {
        status: 'ready'
      }
    })
  }

  /**
   * 刷新二维码方法
   */
  const referQrCode = useCallback(() => {
    dispatch({
      type: 'changeStatus',
      payload: {
        status: 'loading'
      }
    })
  }, [dispatch])

  /**
   * 内置的默认遮罩点击事件
   */
  const processDefaultMaskClick = (status: CodeStatus) => {
    switch (status) {
      case 'cancel':
      case 'expired':
      case 'error':
        referQrCode()
        break
      default:
        break
    }
  }

  /**
   * 点击遮罩触发
   * @param status
   */
  const handlerMaskClick = (status: CodeStatus) => {
    if (onClickMaskContent) {
      onClickMaskContent(status)
    } else {
      processDefaultMaskClick(status)
    }
  }

  useImperativeHandle(
    ref,
    () => {
      return {
        referQrCode
      }
    },
    [referQrCode]
  )

  /**
   * 渲染时进行格式化描述
   */
  const formatterDescriptions = useMemo(() => {
    let formatDescriptions: CodeStatusDescriptions = {}
    descriptions &&
      Object.keys(descriptions).forEach(key => {
        const parseKey = key as keyof CodeStatusDescriptions
        const value = descriptions[parseKey]
        if (typeof value === 'function') {
          formatDescriptions[parseKey] = value(referQrCode)
        } else {
          formatDescriptions[parseKey] = value
        }
      })
    return formatDescriptions
  }, [descriptions, referQrCode])

  return (
    <UiQrCode
      src={state.src}
      descriptions={formatterDescriptions}
      status={state.status}
      loadingComponent={<ShieldSpin />}
      onLoad={onLoadQrcCode}
      onMaskContent={handlerMaskClick}
      {...rest}
    ></UiQrCode>
  )
}

const WorkQrCode = forwardRef(WorkQrCodeComponent)

const WorkGeneQrCodeComponent: ForwardRefRenderFunction<
  any,
  WorkQrCodeProps & {
    authorizationUrl?: string
  }
> = (props, ref) => {
  const {
    descriptions,
    sleepTime = 1000,
    onStatusChange,
    onClickMaskContent,
    qrCodeScanOptions = {},
    authorizationUrl,
    ...rest
  } = props

  const { extIdpConnId } = qrCodeScanOptions

  const { get } = useGuardHttpClient()
  /**
   * 生成图片
   */
  const getAuthUrlRequest = useCallback(() => {
    if (authorizationUrl) {
      // todo 🫵 注意 没有响应的错误拦截
      return Axios.get<{ authCode: string; authUrl: string }>(authorizationUrl)
    } else {
      return new Promise((_, reject) => reject('no redirectUrl'))
    }
  }, [authorizationUrl])

  const { state, dispatch } = usePreQrCode()

  /**
   * 状态检查方法
   */
  const checkedRequest = useCallback(
    async () =>
      get('/connections/zjzwfw/check-auth-code', {
        authCode: state.authCode,
        extIdpConnId
      }),
    [state.authCode, get, extIdpConnId]
  )

  useQrCode(
    {
      state,
      dispatch,
      sleepTime,
      descriptions,
      onStatusChange
    },

    {
      getAuthUrlRequest,
      readyCheckedRequest: checkedRequest,
      alreadyCheckedRequest: checkedRequest
    }
  )

  /**
   * 二维码渲染完成后重置状态
   */
  const onLoadQrcCode = () => {
    dispatch({
      type: 'changeStatus',
      payload: {
        status: 'ready'
      }
    })
  }

  /**
   * 刷新二维码方法
   */
  const referQrCode = useCallback(() => {
    dispatch({
      type: 'changeStatus',
      payload: {
        status: 'loading'
      }
    })
  }, [dispatch])

  /**
   * 内置的默认遮罩点击事件
   */
  const processDefaultMaskClick = (status: CodeStatus) => {
    switch (status) {
      case 'cancel':
      case 'expired':
      case 'error':
        referQrCode()
        break
      default:
        break
    }
  }

  /**
   * 点击遮罩触发
   * @param status
   */
  const handlerMaskClick = (status: CodeStatus) => {
    if (onClickMaskContent) {
      onClickMaskContent(status)
    } else {
      processDefaultMaskClick(status)
    }
  }

  useImperativeHandle(
    ref,
    () => {
      return {
        referQrCode
      }
    },
    [referQrCode]
  )

  /**
   * 渲染时进行格式化描述
   */
  const formatterDescriptions = useMemo(() => {
    let formatDescriptions: CodeStatusDescriptions = {}
    descriptions &&
      Object.keys(descriptions).forEach(key => {
        const parseKey = key as keyof CodeStatusDescriptions
        const value = descriptions[parseKey]
        if (typeof value === 'function') {
          formatDescriptions[parseKey] = value(referQrCode)
        } else {
          formatDescriptions[parseKey] = value
        }
      })
    return formatDescriptions
  }, [descriptions, referQrCode])
  console.log(state.authUrl)

  return (
    <LinkQrcode
      src={state.authUrl}
      descriptions={formatterDescriptions}
      status={state.status}
      loadingComponent={<ShieldSpin />}
      onLoad={onLoadQrcCode}
      onMaskContent={handlerMaskClick}
      {...rest}
    ></LinkQrcode>
  )
}

const WorkGeneQrCode = forwardRef(WorkGeneQrCodeComponent)

export { WorkQrCode, WorkGeneQrCode }
