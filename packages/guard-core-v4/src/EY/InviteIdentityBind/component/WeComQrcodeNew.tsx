// import { message } from 'antd'
import qs from 'qs'
import { React } from 'shim-react'
import { CodeAction } from '../../..'
import { getGuardWindow } from '../../../Guard/core/useAppendConfig'
import { ShieldSpin } from '../../../ShieldSpin'
import { getVersion } from '../../../_utils'

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
import {
  createWWLoginPanel,
  WWLoginType,
  WWLoginRedirectType,
  WWLoginPanelSizeType,
  WWLoginLangType,
  WWLoginInstance
} from '@wecom/jssdk'
const { useCallback, useEffect, useRef, useState } = React

export const WeComQrcodeNew = (props: any) => {
  const { QRConfig, id, onRegister, refreshQrcode, setRefreshQrcode } = props
  const version = getVersion()

  const events = useGuardEvents()

  const isSpecialBrowser = useIsSpecialBrowser()

  const [loading, setLoading] = useState(true)

  const { get } = useGuardHttpClient()

  const tenantId = useGuardTenantId()

  const appId = useGuardAppId()

  const config = useGuardFinallyConfig()

  const publicConfig = useGuardPublicConfig()

  const panel = useRef<WWLoginInstance>()

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

    if (panel.current) {
      console.log('panel: ', panel.current)

      panel.current?.unmount()
    }
    const p = createWWLoginPanel({
      el: `#weCom_qrcode_wrapper-${id}`,
      params: {
        login_type: WWLoginType.serviceApp,
        appid: QRConfig.corpId,
        redirect_uri: `${QRConfig?.redirectUrl}`,
        redirect_type: WWLoginRedirectType.callback,
        panel_size: WWLoginPanelSizeType.small,
        lang: i18n.language.includes('zh')
          ? WWLoginLangType.zh
          : WWLoginLangType.en,
        href: `${publicConfig?.cdnBase}/guard-assets/wecom_authing.css`
      },
      async onLoginSuccess({ code }: any) {
        console.log({ code })

        // 向应用域名下发起认证验证请求
        const res = await get(
          `/api/v1/qrcode/${QRConfig.identifier}/verify?code=${code}&onlyIdpInfo=true`
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
          setRefreshQrcode((prev: number) => prev + 1)
        }
      },
      onLoginFail(err: any) {
        console.log('fail: ', err)
      }
    })
    panel.current = p
    setLoading(false)
  }, [
    appId,
    config?.isHost,
    id,
    publicConfig?.cdnBase,
    tenantId,
    QRConfig,
    get,
    onRegister,
    events,
    setRefreshQrcode
  ])

  useEffect(() => {
    setLoading(true)
    fetchQrcode()
  }, [fetchQrcode, refreshQrcode])

  return (
    <div className="wecom_container wecom_container-new">
      {loading && <ShieldSpin />}
      <div
        id={`weCom_qrcode_wrapper-${id}`}
        style={{ display: loading ? 'none' : '' }}
      ></div>
    </div>
  )
}
