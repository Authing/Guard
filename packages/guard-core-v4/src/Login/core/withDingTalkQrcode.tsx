import { message } from 'shim-antd'

import { React } from 'shim-react'

import qs from 'qs'

import { CodeAction, LoginMethods } from '../..'

import { getGuardWindow } from '../../Guard/core/useAppendConfig'

import { ShieldSpin } from '../../ShieldSpin'

import { isSpecialBrowser } from '../../_utils'

import {
  useGuardAppId,
  useGuardEvents,
  useGuardFinallyConfig,
  useGuardHttpClient,
  useGuardTenantId
} from '../../_utils/context'

import { useGuardAuthClient } from '../../Guard/authClient'

import { getVersion } from '../../_utils/getVersion'

const version = getVersion()

const { useCallback, useEffect, useState } = React

export const LoginWithDingTalkQrcode = (props: any) => {
  const { QRConfig, id } = props

  const DTLogin = window.DTFrameLogin

  const [loading, setLoading] = useState(false)

  const { get } = useGuardHttpClient()

  const tenantId = useGuardTenantId()

  const appId = useGuardAppId()

  const events = useGuardEvents()

  const authClient = useGuardAuthClient()

  const config = useGuardFinallyConfig()

  const fetchQrcode = useCallback(async () => {
    const query: Record<string, any> = {
      from_guard: '1',
      embedded: '1',
      app_id: appId,
      guard_version: `Guard@${version}`,
      ...(tenantId && { tenant_id: tenantId })
    }
    if (config?.isHost) {
      delete query.from_guard
      query.from_hosted_guard = '1'

      if (isSpecialBrowser()) {
        query.redirected = '1'
        const guardWindow = getGuardWindow()
        if (guardWindow) {
          // 如果 isHost 是 true，则从 url 获取 finish_login_url 作为 social.authorize 方法的 targetUrl 参数
          query.redirect_url = qs.parse(guardWindow.location.search)?.[
            'finish_login_url'
          ]
        }
      }
    }

    const DTFrame = DTLogin(
      {
        id: `dingtalk_qrcode_wrapper-${id}`,
        width: '100%',
        height: 388
      },
      {
        redirect_uri: encodeURIComponent(
          `${QRConfig.redirectUrl}?${qs.stringify(query)}`
        ),
        client_id: QRConfig.clientId,
        scope: 'openid',
        response_type: 'code',
        // state: 'xxxxxxxxx',
        prompt: 'consent'
      },
      async (loginResult: any) => {
        const { authCode } = loginResult
        // 这里可以直接进行重定向
        // window.location.href = redirectUrl
        // 也可以在不跳转页面的情况下，使用code进行授权

        try {
          if (events?.onBeforeLogin) {
            const isContinue = await events?.onBeforeLogin(
              {
                type: LoginMethods.WechatworkCorpQrconnect,
                data: loginResult
              },
              authClient
            )
            if (!isContinue) {
              return
            }
          }
          // 拦截query信息
          // const query = new URL(event.data).search
          // 向应用域名下发起认证验证请求
          const res = await get(
            `/api/v1/qrcode/${QRConfig.identifier}/verify?${qs.stringify(
              query
            )}&code=${authCode}`
          )
          if (res.code === 200) {
            props.multipleInstance &&
              props.multipleInstance.setLoginWay(
                'qrcode',
                LoginMethods.DingTalkQrcode,
                props.id
              )
            props.onLoginSuccess(res.data)
          } else {
            const handMode = res?.onGuardHandling?.()
            // 向上层抛出错误
            handMode === CodeAction.RENDER_MESSAGE &&
              props.onLoginFailed(res.code, res.data)
          }
        } catch (e: any) {
          message.error(e.message)
        }
      },
      (errorMsg: any) => {
        // 这里一般需要展示登录失败的具体原因
        console.log(errorMsg)
      }
    )
    // frame 页面二维码加载完毕
    // DTFrame.onload = () => {
    //   setLoading(false)
    // }
  }, [DTLogin, QRConfig, appId, config?.isHost, tenantId])

  useEffect(() => {
    fetchQrcode()
  }, [fetchQrcode])

  return (
    <div className="wecom_container">
      {loading && <ShieldSpin />}
      <div
        id={`dingtalk_qrcode_wrapper-${id}`}
        style={{ display: loading ? 'none' : '' }}
      ></div>
    </div>
  )
}
