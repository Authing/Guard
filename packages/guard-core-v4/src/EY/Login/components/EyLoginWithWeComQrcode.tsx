import { message } from 'shim-antd'
import qs from 'qs'
import { React } from 'shim-react'
import { ApiCode, CodeAction, GuardModuleType } from '../../..'
import { getGuardWindow } from '../../../Guard/core/useAppendConfig'
import { GuardLoginInitData } from '../../../Login/interface'
import { ShieldSpin } from '../../../ShieldSpin'
import { getVersion, isWeComOrigin } from '../../../_utils'
import {
  useGuardAppId,
  useGuardFinallyConfig,
  useGuardHttpClient,
  useGuardInitData,
  useGuardModule,
  useGuardPublicConfig,
  useGuardTenantId,
  useIsSpecialBrowser
} from '../../../_utils/context'
import { getGuardHttp } from '../../../_utils/guardHttp'
import { i18n } from '../../../_utils/locales'
const { useCallback, useEffect, useState } = React

export const EyLoginWithWeComQrcode = (props: any) => {
  const { QRConfig, id, refreshQrcode } = props
  const version = getVersion()

  const initData = useGuardInitData<GuardLoginInitData>()

  const WwLogin = window.EYWwLogin

  const isSpecialBrowser = useIsSpecialBrowser()

  const [loading, setLoading] = useState(true)

  const { authFlow } = getGuardHttp()

  const { changeModule } = useGuardModule()

  const { get } = useGuardHttpClient()

  const tenantId = useGuardTenantId()

  const appId = useGuardAppId()

  const config = useGuardFinallyConfig()

  const publicConfig = useGuardPublicConfig()

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
          const query = new URL(event.data).search
          // 向应用域名下发起认证验证请求
          const res = await get(
            `/api/v1/qrcode/${QRConfig.identifier}/verify${query}`
          )
          const { code, data, apiCode, onGuardHandling, message: msg } = res
          if (code === 200) {
            props.onLoginSuccess(res.data)
          } else {
            let context = {}
            if (apiCode === ApiCode.EY_PROTOCOLS) {
              context = {
                onAcceptHandle: async () => {
                  const res = await authFlow('terms-and-agreements', {
                    agree: true
                  })
                  const { isFlowEnd, onGuardHandling, message: msg, data } = res

                  if (isFlowEnd) {
                    props?.onLoginSuccess?.(data, msg)
                  } else {
                    onGuardHandling?.()
                  }
                },
                onRejectHandle: async () => {
                  const res = await authFlow('terms-and-agreements', {
                    agree: false
                  })
                  const { isFlowEnd, onGuardHandling, apiCode } = res
                  if (isFlowEnd || apiCode === ApiCode.ABORT_FLOW) {
                    changeModule?.(GuardModuleType.EY_PRE_CHECK_EMAIL, initData)
                  } else {
                    onGuardHandling?.()
                  }
                }
              }
            }

            const handMode = onGuardHandling?.(context)

            // 向上层抛出错误
            handMode === CodeAction.RENDER_MESSAGE &&
              props.onLoginFailed(apiCode, data, msg)
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
  }, [
    QRConfig.identifier,
    authFlow,
    changeModule,
    get,
    initData,
    loading,
    props
  ])

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
