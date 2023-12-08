import { message } from 'shim-antd'

import { React } from 'shim-react'

import qs from 'qs'

import { CodeAction } from '../..'

import { getGuardWindow } from '../../Guard/core/useAppendConfig'

import { ShieldSpin } from '../../ShieldSpin'

import { getVersion, isSpecialBrowser, isWeComOrigin } from '../../_utils'

import {
  useGuardAppId,
  useGuardFinallyConfig,
  useGuardHttpClient,
  useGuardPublicConfig,
  useGuardTenantId
} from '../../_utils/context'

import { i18n } from '../../_utils/locales'

const version = getVersion()

const { useCallback, useEffect } = React
export const LoginWithWeComQrcode = (props: any) => {
  const { QRConfig } = props

  const WwLogin = window.WwLogin

  const { get } = useGuardHttpClient()

  const tenantId = useGuardTenantId()

  const appId = useGuardAppId()

  const config = useGuardFinallyConfig()

  const publicConfig = useGuardPublicConfig()
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

    // let redirect_uri = encodeURIComponent(
    //   `https://console.authing.localhost${QRConfig.redirectUrl}`
    // )

    // 初始化iframe二维码
    new WwLogin({
      id: 'weCom_qrcode_wrapper',
      appid: QRConfig.corpId,
      agentid: QRConfig.agentId,
      redirect_uri: encodeURIComponent(
        `${QRConfig.redirectUrl}?${qs.stringify(query)}`
      ),
      // redirect_uri,
      href: `${publicConfig?.cdnBase}/guard-assets/wecom_authing.css`, //企业微信二维码样式文件
      lang: i18n.language.includes('zh') ? 'zh' : 'en'
    })
  }, [
    QRConfig,
    WwLogin,
    appId,
    config?.isHost,
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
          // 拦截query信息
          const query = new URL(event.data).search
          // 向应用域名下发起认证验证请求
          const res = await get(
            `/api/v1/qrcode/${QRConfig.identifier}/verify${query}`
          )
          if (res.code === 200) {
            props.onLoginSuccess(res.data)
          } else {
            const handMode = res?.onGuardHandling?.()
            // 向上层抛出错误
            handMode === CodeAction.RENDER_MESSAGE &&
              props.onLoginFailed(res.code, res.data)
          }
          // TODO 通过微信认证校验 获取authing认证数据
          // const { data } = await Axios(event.data, {
          //   headers: getHeaders(),
          // })
          // if (data?.code === 200) {
          //   props.onLoginSuccess(data.data)
          // } else {
          //   const res = responseIntercept(data)
          //   const handMode = res?.onGuardHandling?.()
          //   // 向上层抛出错误
          //   handMode === CodeAction.RENDER_MESSAGE &&
          //     props.onLoginFailed(res.code, data)
          // }
        } catch (e: any) {
          message.error(e.message)
        }
      }
    }

    window.addEventListener('message', messageEvent, false)

    return () => {
      window.removeEventListener('message', messageEvent, false)
    }
  })

  return (
    <div id="weCom_qrcode_wrapper">
      <ShieldSpin />
    </div>
  )
}
