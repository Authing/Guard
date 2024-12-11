// import { message } from 'antd'
import qs from 'qs'
import { React } from 'shim-react'
import { ApiCode, CodeAction, GuardModuleType } from '../../..'
import { getGuardWindow } from '../../../Guard/core/useAppendConfig'
import { GuardLoginInitData } from '../../../Login/interface'
import { ShieldSpin } from '../../../ShieldSpin'
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
import { getVersion } from '../../../_utils'

import {
  createWWLoginPanel,
  WWLoginType,
  WWLoginRedirectType,
  WWLoginPanelSizeType,
  WWLoginLangType,
  WWLoginInstance
} from '@wecom/jssdk'

const { useCallback, useEffect, useRef, useState } = React

export const EyLoginWithWeComQrcodeNew = (props: any) => {
  const { QRConfig, id, refreshQrcode } = props

  const version = getVersion()

  const initData = useGuardInitData<GuardLoginInitData>()

  const isSpecialBrowser = useIsSpecialBrowser()

  const [loading, setLoading] = useState(true)

  const { authFlow } = getGuardHttp()

  const { changeModule } = useGuardModule()

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
        agentid: QRConfig.agentId,
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

        const res = await get(
          `/api/v1/qrcode/${QRConfig.identifier}/verify?code=${code}`
        )
        const {
          code: resCode,
          data,
          apiCode,
          onGuardHandling,
          message: msg
        } = res
        if (resCode === 200) {
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
          } else {
            props.setRefreshQrcode?.((prev: number) => prev + 1)
          }

          const handMode = onGuardHandling?.(context)

          // 向上层抛出错误
          handMode === CodeAction.RENDER_MESSAGE &&
            props.onLoginFailed(apiCode, data, msg)
        }
      },
      onLoginFail(err: any) {
        console.log('fail: ', err)
      }
    })
    panel.current = p
    setLoading(false)
  }, [
    QRConfig,
    appId,
    config?.isHost,
    id,
    publicConfig?.cdnBase,
    tenantId,
    authFlow,
    get,
    changeModule,
    initData,
    props
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
