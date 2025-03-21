import { message } from 'shim-antd'

import { React } from 'shim-react'

import qs from 'qs'

import { CodeAction, LoginMethods } from '../..'

import { getGuardWindow } from '../../Guard/core/useAppendConfig'

import { ShieldSpin } from '../../ShieldSpin'

import {
  useGuardAppId,
  useGuardEvents,
  useGuardFinallyConfig,
  useGuardHttpClient,
  useGuardTenantId,
  useIsSpecialBrowser
} from '../../_utils/context'

import { useGuardAuthClient } from '../../Guard/authClient'

import { getVersion } from '../../_utils/getVersion'

const version = getVersion()

const { useEffect, useState } = React

export const LoginWithZZDingQrcode = (props: any) => {
  const { qrConfig, id } = props

  const [loading] = useState(false)

  const { get } = useGuardHttpClient()

  const tenantId = useGuardTenantId()

  const appId = useGuardAppId()

  const events = useGuardEvents()

  const authClient = useGuardAuthClient()

  const config = useGuardFinallyConfig()

  const isSpecialBrowser = useIsSpecialBrowser()

  useEffect(() => {
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

      if (isSpecialBrowser) {
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

    const messageEvent = async (event: { data: { code: any } }) => {
      const { code } = event.data
      if (code) {
        try {
          if (events?.onBeforeLogin) {
            const isContinue = await events?.onBeforeLogin(
              {
                type: LoginMethods.WechatworkCorpQrconnect,
                data: event.data
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
            `/api/v1/qrcode/${qrConfig.identifier}/verify?${qs.stringify(
              query
            )}&code=${code}`
          )
          if (res.code === 200) {
            props.multipleInstance &&
              props.multipleInstance.setLoginWay(
                'qrcode',
                LoginMethods.ZZDingQrcode,
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
      } else {
        // 这里一般需要展示登录失败的具体原因
        console.log(event)
      }
    }
    if (!loading) {
      window.addEventListener('message', messageEvent, false)
    }

    return () => {
      window.removeEventListener('message', messageEvent, false)
    }
  }, [])
  return (
    <div className="wecom_container">
      {loading && <ShieldSpin className="dingtalk_loading" />}
      <div
        id={`dingtalk_qrcode_wrapper-${id}`}
        style={{ visibility: loading ? 'hidden' : 'visible' }}
      >
        <iframe
          src={qrConfig?.authorizationUrl}
          width="100%"
          height="388"
          frameBorder="0"
          scrolling="no"
        ></iframe>
      </div>
    </div>
  )
}
