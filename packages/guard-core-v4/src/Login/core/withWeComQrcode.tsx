import { message } from 'shim-antd'

import { React } from 'shim-react'

import qs from 'qs'

import { CodeAction, LoginMethods } from '../..'

import { getGuardWindow } from '../../Guard/core/useAppendConfig'

import { ShieldSpin } from '../../ShieldSpin'

import { isSpecialBrowser, isWeComOrigin } from '../../_utils'

import {
  useGuardAppId,
  useGuardEvents,
  useGuardFinallyConfig,
  useGuardHttpClient,
  useGuardPublicConfig,
  useGuardTenantId
} from '../../_utils/context'

import { i18n } from '../../_utils/locales'

import { useGuardAuthClient } from '../../Guard/authClient'

import { getVersion } from '../../_utils/getVersion'

const version = getVersion()

const { useCallback, useEffect, useState } = React

export const LoginWithWeComQrcode = (props: any) => {
  const { QRConfig, id } = props

  const WwLogin = window.WwLogin

  const [loading, setLoading] = useState(true)

  const { get } = useGuardHttpClient()

  const tenantId = useGuardTenantId()

  const appId = useGuardAppId()

  const config = useGuardFinallyConfig()

  const publicConfig = useGuardPublicConfig()

  const events = useGuardEvents()

  const authClient = useGuardAuthClient()

  const fetchQrcode = useCallback(async () => {
    const query: Record<string, any> = {
      from_guard: '1',
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

    // 初始化iframe二维码
    const wwInstance = new WwLogin({
      id: `weCom_qrcode_wrapper-${id}`,
      appid: QRConfig.corpId,
      agentid: QRConfig.agentId,
      redirect_uri: encodeURIComponent(
        `${QRConfig.redirectUrl}?${qs.stringify(query)}`
      ),
      // redirect_uri,
      href: `${publicConfig?.cdnBase}/guard-assets/wrp_code_friesland.css`, //企业微信二维码样式文件
      lang: i18n.language.includes('zh') ? 'zh' : 'en'
    })

    wwInstance.frame.onload = (event: Event) => {
      setLoading(false)
      wwInstance.frame.contentWindow.postMessage &&
        wwInstance.frame.contentWindow.postMessage('ask_usePostMessage', '*')
    }
  }, [
    QRConfig.agentId,
    QRConfig.corpId,
    QRConfig.redirectUrl,
    WwLogin,
    appId,
    config?.isHost,
    id,
    publicConfig?.cdnBase,
    tenantId
  ])

  useEffect(() => {
    fetchQrcode()
  }, [fetchQrcode])

  useEffect(() => {
    const messageEvent = async (event: MessageEvent) => {
      if (isWeComOrigin(event)) {
        try {
          if (events?.onBeforeLogin) {
            const isContinue = await events?.onBeforeLogin(
              { type: LoginMethods.WechatworkCorpQrconnect, data: event.data },
              authClient
            )
            if (!isContinue) {
              return
            }
          }
          // 拦截query信息
          const query = new URL(event.data).search
          // 向应用域名下发起认证验证请求
          const res = await get(
            `/api/v1/qrcode/${QRConfig.identifier}/verify${query}`
          )
          if (res.code === 200) {
            props.multipleInstance &&
              props.multipleInstance.setLoginWay(
                'qrcode',
                LoginMethods.WechatworkCorpQrconnect,
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
      }
    }
    if (!loading) {
      window.addEventListener('message', messageEvent, false)
    }

    return () => {
      window.removeEventListener('message', messageEvent, false)
    }
  }, [QRConfig.identifier, authClient, events, get, loading, props])

  return (
    <div className="wecom_container">
      {loading && <ShieldSpin />}
      <div
        id={`weCom_qrcode_wrapper-${id}`}
        style={{ display: loading ? 'none' : '' }}
      ></div>
    </div>
  )
}
