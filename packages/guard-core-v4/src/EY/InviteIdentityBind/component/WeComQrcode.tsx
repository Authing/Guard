import { message } from 'shim-antd'
import qs from 'qs'
import React, { useCallback, useEffect, useState } from 'react'
import { CodeAction } from '../../..'
import { getGuardWindow } from '../../../Guard/core/useAppendConfig'
import { ShieldSpin } from '../../../ShieldSpin'
import { getVersion, isWeComOrigin } from '../../../_utils'
import {
  useGuardAppId,
  useGuardEvents,
  useGuardFinallyConfig,
  useGuardHttpClient,
  useGuardPublicConfig,
  useGuardTenantId,
  useIsSpecialBrowser
} from '../../../_utils/context'
import { i18n } from '../../../_utils/locales'

export const WeComQrcode = (props: any) => {
  const { QRConfig, id, onRegister, refreshQrcode, setRefreshQrcode } = props
  const version = getVersion()

  const WwLogin = window.EYWwLogin

  const [loading, setLoading] = useState(true)

  const isSpecialBrowser = useIsSpecialBrowser()

  const { get } = useGuardHttpClient()

  const tenantId = useGuardTenantId()

  const appId = useGuardAppId()

  const config = useGuardFinallyConfig()

  const publicConfig = useGuardPublicConfig()

  const events = useGuardEvents()

  const fetchQrcode = useCallback(async () => {
    if (!id) return
    const query: Record<string, any> = {
      from_guard: '1',
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

    // 初始化iframe二维码
    const wwInstance = new WwLogin({
      id: `weCom_qrcode_wrapper-${id}`,
      appid: QRConfig.corpId,
      agentid: QRConfig.agentId,
      redirect_uri: encodeURIComponent(
        `${QRConfig.redirectUrl}?${qs.stringify(query)}`
      ),
      // redirect_uri,
      height: '205px',
      usertype: 'member',
      href: `${publicConfig?.cdnBase}/guard-assets/wecom_authing.css`, //企业微信二维码样式文件
      lang: i18n.language.includes('zh') ? 'zh' : 'en'
    })

    wwInstance.frame.onload = (event: Event) => {
      setLoading(false)
      wwInstance.frame.contentWindow.postMessage &&
        wwInstance.frame.contentWindow.postMessage('ask_usePostMessage', '*')
    }
  }, [
    QRConfig,
    WwLogin,
    appId,
    config?.isHost,
    id,
    publicConfig?.cdnBase,
    tenantId
  ])

  useEffect(() => {
    setLoading(true)
    fetchQrcode()
  }, [fetchQrcode, refreshQrcode])

  useEffect(() => {
    const messageEvent = async (event: MessageEvent) => {
      if (isWeComOrigin(event)) {
        try {
          // 拦截query信息
          const search = new URL(event.data).search
          const urlParams = new URLSearchParams(search)
          // 只获取idp信息
          urlParams.append('onlyIdpInfo', 'true')

          const query = `?${urlParams.toString()}`

          // 向应用域名下发起认证验证请求
          const res = await get(
            `/api/v1/qrcode/${QRConfig.identifier}/verify${query}`
          )

          if (res.statusCode === 200) {
            //  校验idp是否已被绑定
            const idpRes = await get('/api/v3/check-register-identity', {
              identity: res.data.identity
            })

            if (idpRes.statusCode === 200) {
              onRegister(res.data.identity)
            } else {
              idpRes?.onGuardHandling?.()
              setRefreshQrcode((prev: number) => prev + 1)
            }
          } else {
            const handMode = res?.onGuardHandling?.()
            // 向上层抛出错误
            handMode === CodeAction.RENDER_MESSAGE &&
              events?.onRegisterError?.({
                code: res.code,
                data: res.data,
                message: res.message
              })
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
  }, [QRConfig, events, get, loading, onRegister, props, setRefreshQrcode])

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
