import { useGuardHttpClient } from '../../_utils/context'

import { AuthingResponse } from '../../_utils/http'

// 处理所有使用 postMessage 方式的登录
export const usePostMessage = () => {
  // 借用一下 GuardHttpClient 的方法
  const { responseIntercept } = useGuardHttpClient()

  const onMessage = (evt: MessageEvent) => {
    const { message, data, event, code } = evt.data

    const { source } = event || {}
    // 社会化登录是用 authing-js-sdk 实现的，不用再在这里回调了
    // if (source === 'authing' && eventType === 'socialLogin') {
    //   return
    // }

    if (source !== 'authing') {
      return
    }

    // 如果直接为 200 代表成功了
    if (code === 200) {
      return { code, data, onGuardHandling: undefined }
    }

    // TODO 完整的登陆信息 在 message 中 以 Json 的形式返回 待优化
    let parsedMessage: any
    try {
      parsedMessage = JSON.parse(message)
    } catch (error) {
      console.error('Json parse error in postMessage')
      console.error(`message: ${message}, code: ${code}`)
      return
    }

    const {
      code: authingCode,
      statusCode,
      apiCode,
      message: authingMessage,
      data: authingResData,
      flowHandle
    } = parsedMessage

    const res = responseIntercept({
      statusCode,
      apiCode,
      data: authingResData,
      message: authingMessage,
      code: authingCode,
      flowHandle
    })

    return res
  }

  return onMessage
}

export const useErrorHandling = () => {
  // 借用一下 GuardHttpClient 的方法
  const { responseIntercept } = useGuardHttpClient()

  const errorHandling = (res: AuthingResponse) => {
    const { message } = res

    const parsedMsg = JSON.parse(message!)

    const {
      code: authingCode,
      statusCode,
      apiCode,
      message: authingMessage,
      data: authingResData
    } = parsedMsg

    const response = responseIntercept({
      statusCode,
      apiCode,
      data: authingResData,
      message: authingMessage,
      code: authingCode
    })

    return response
  }

  return errorHandling
}
