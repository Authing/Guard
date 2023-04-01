import { message } from 'shim-antd'

import { getHundreds } from '..'

import { AuthingGuardResponse, AuthingResponse } from '../http'

import { i18n } from '../locales'

import { ApiCode, CodeAction } from './interface'

export const errorCodeInterceptor: (
  res: AuthingResponse<any>,
  callBack: (code: CodeAction, res: AuthingResponse) => AuthingGuardResponse
) => AuthingResponse<any> = (res, callBack) => {
  if (res.code === -1) {
    message.error(i18n.t('common.timeout'))

    return res
  }
  if (res.code === -2) {
    message.error(i18n.t('common.fetchError'))

    return res
  }

  if (!res.statusCode) return res

  const statusCode = res.statusCode

  const apiCode = res.apiCode

  // if ([6].includes(getHundreds(statusCode))) {
  //   callBack(CodeAction.RENDER_MESSAGE, res)

  //   return res
  // }

  // TODO 临时逻辑 如果有 Code 的话 先不走 statusCode 的行为
  // 否则会出现 messages 渲染两次的问题
  // if (!!res.code) return res

  const hundreds = getHundreds(statusCode)

  if (hundreds === 3) {
    if (apiCode === ApiCode.FLOW_END) {
      return callBack(CodeAction.FLOW_END, res)
    } else {
      return callBack(CodeAction.CHANGE_MODULE, res)
    }
  } else if (hundreds === 4 || hundreds === 6) {
    return callBack(CodeAction.RENDER_MESSAGE, res)
  }

  return res
}
