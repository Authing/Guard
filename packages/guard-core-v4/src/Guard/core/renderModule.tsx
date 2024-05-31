import { ConfigProvider, message, Modal, antdLocales } from 'shim-antd'

import { React } from 'shim-react'

import { GuardProps } from '../Guard'

import { GuardModuleType } from '../module'

import { GuardBindTotpView } from '../../BindTotp'

import {
  GuardFirstLoginPasswordResetView,
  GuardForcedPasswordResetView,
  GuardNoticePasswordResetView,
  GuardPasswordNotSafeResetView,
  GuardRegisterCompletePasswordView
} from '../../ChangePassword'
import { GuardSelectAccount2LoginView } from '../../SelectAccount2Login'
import {
  GuardLoginCompleteInfoView,
  GuardRegisterCompleteInfoView
} from '../../CompleteInfo'

import { GuardDownloadATView } from '../../DownloadAuthenticator'

import { GuardErrorView } from '../../Error'

import { GuardForgetPassword } from '../../ForgetPassword'

import { GuardLoginView } from '../../Login'

import { GuardMFAView } from '../../MFA'

import { GuardNeedHelpView } from '../../NeedHelpView'

import { GuardRecoveryCodeView } from '../../RecoveryCode'

import { GuardRegisterView } from '../../Register'

import { GuardSubmitSuccessView } from '../../SubmitSuccess'

import {
  useGuardButtonContext,
  useGuardContextLoaded,
  useGuardCurrentModule,
  useGuardDefaultMergedConfig,
  useGuardHttpClient,
  useGuardModule
} from '../../_utils/context'

import { GuardMode } from '../../Type'

import { IconFont } from '../../IconFont'

import { AuthingGuardResponse, AuthingResponse } from '../../_utils/http'

import {
  CodeAction,
  ChangeModuleApiCodeMapping,
  ApiCode
} from '../../_utils/responseManagement/interface'

import { GuardIdentityBindingView } from '../../IdentityBinding'

import { GuardIdentityBindingAskView } from '../../IdentityBindingAsk'

import '../styles.less'

import { updateFlowHandle } from '../../_utils/flowHandleStorage'

import { GuardUnlockView } from '../../SelfUnlock'

import { GuardSelectAccountView } from '../../SelectAccount'

import { GuardTenantPortalSelectView } from '../../TenantPortalSelect'

import { GuardNewSubmitSuccessView } from '../../NewSubmitSuccess'

import { i18n } from '../../_utils/locales'

const { useEffect, useMemo } = React

const PREFIX_CLS = 'authing-ant'

message.config({
  prefixCls: `${PREFIX_CLS}-message`
})

export enum LangMAP {
  zhCn = 'zh-CN',
  enUs = 'en-US',
  jaJp = 'ja-JP',
  zhTw = 'zh-TW'
}

const langMap = {
  [LangMAP.zhCn]: antdLocales.zhCN,
  [LangMAP.enUs]: antdLocales.enUS,
  [LangMAP.jaJp]: antdLocales.jaJP,
  [LangMAP.zhTw]: antdLocales.zhTW
}

export const RenderModule: React.FC<{
  guardProps: GuardProps
}> = ({ guardProps }) => {
  const defaultMergedConfig = useGuardDefaultMergedConfig()

  const contextLoaded = useGuardContextLoaded()

  const { moduleName } = useGuardCurrentModule()

  const httpClient = useGuardHttpClient()

  const { changeModule } = useGuardModule()

  const { GuardButtonProvider } = useGuardButtonContext()

  const loadingComponent = useMemo(() => {
    return defaultMergedConfig.loadingComponent
  }, [defaultMergedConfig])

  const ComponentsMapping: Record<
    GuardModuleType,
    (key: string) => React.ReactNode
  > = {
    // Error
    [GuardModuleType.ERROR]: (key: string) => <GuardErrorView key={key} />,
    // Login
    [GuardModuleType.LOGIN]: (key: string) => <GuardLoginView key={key} />,
    [GuardModuleType.RESET_ACCOUNT_NAME]: (key: string) => (
      <GuardLoginView key={key} isResetPage />
    ),
    // 身份源绑定
    [GuardModuleType.IDENTITY_BINDING]: (key: string) => (
      <GuardIdentityBindingView key={key} />
    ),
    // 身份源绑定 跳过询问页面
    [GuardModuleType.IDENTITY_BINDING_NO_ASK]: (key: string) => (
      <GuardIdentityBindingView key={key} skipAsk={true} />
    ),
    // 身份源绑定 问询
    [GuardModuleType.IDENTITY_BINDING_ASK]: (key: string) => (
      <GuardIdentityBindingAskView key={key} />
    ),
    // MFA
    [GuardModuleType.MFA]: (key: string) => <GuardMFAView key={key} />,
    // 注册
    [GuardModuleType.REGISTER]: (key: string) => (
      <GuardRegisterView key={key} />
    ),
    // 下载 Authenticator
    [GuardModuleType.DOWNLOAD_AT]: (key: string) => (
      <GuardDownloadATView key={key} />
    ),
    // 忘记密码 -> 重置密码
    [GuardModuleType.FORGET_PWD]: (key: string) => (
      <GuardForgetPassword key={key} />
    ),
    // 首次登录修改密码
    [GuardModuleType.FIRST_LOGIN_PASSWORD]: (key: string) => (
      <GuardFirstLoginPasswordResetView key={key} />
    ),
    // 提示修改密码
    [GuardModuleType.NOTICE_PASSWORD_RESET]: (key: string) => (
      <GuardNoticePasswordResetView key={key} />
    ),
    // 登陆安全策略 密码轮换
    [GuardModuleType.FORCED_PASSWORD_RESET]: (key: string) => (
      <GuardForcedPasswordResetView key={key} />
    ),
    // 绑定 TOTP
    [GuardModuleType.BIND_TOTP]: (key: string) => (
      <GuardBindTotpView key={key} />
    ),
    // 问题反馈
    [GuardModuleType.ANY_QUESTIONS]: (key: string) => (
      <GuardNeedHelpView key={key} />
    ),
    // MFA 恢复码
    [GuardModuleType.RECOVERY_CODE]: (key: string) => (
      <GuardRecoveryCodeView key={key} />
    ),
    // 提交成功
    [GuardModuleType.SUBMIT_SUCCESS]: (key: string) => (
      <GuardSubmitSuccessView key={key} />
    ),
    // 注册信息补全
    [GuardModuleType.REGISTER_COMPLETE_INFO]: (key: string) => (
      <GuardRegisterCompleteInfoView key={key} />
    ),
    // 切换登录身份
    [GuardModuleType.SELECT_ACCOUNT_2_LOGIN]: (key: string) => (
      <GuardSelectAccount2LoginView key={key} />
    ),
    // 登录信息补全
    [GuardModuleType.LOGIN_COMPLETE_INFO]: (key: string) => (
      <GuardLoginCompleteInfoView key={key} />
    ),
    // 注册密码补全
    [GuardModuleType.REGISTER_PASSWORD]: (key: string) => (
      <GuardRegisterCompletePasswordView key={key} />
    ),
    // 自助解锁
    [GuardModuleType.SELF_UNLOCK]: (key: string) => (
      <GuardUnlockView key={key} />
    ),
    [GuardModuleType.UNSAFE_PASSWORD_RESET]: key => (
      <GuardPasswordNotSafeResetView key={key} />
    ),
    [GuardModuleType.FLOW_SELECT_ACCOUNT]: key => (
      <GuardSelectAccountView key={key} />
    ),
    [GuardModuleType.TENANT_PORTAL]: key => <GuardTenantPortalSelectView />,
    [GuardModuleType.New_SUBMIT_SUCCESS]: key => (
      <GuardNewSubmitSuccessView key={key} />
    )
  }

  // 初始化 请求拦截器 （Error Code）
  useEffect(() => {
    if (!httpClient || !changeModule) return

    // 错误码处理回调 切换 module 和 错误信息提示
    const errorCodeCb = (
      code: CodeAction,
      res: AuthingResponse
    ): AuthingGuardResponse => {
      // 判断有没有 flowHandle
      res.flowHandle && updateFlowHandle(res.flowHandle)

      const codeActionMapping = {
        [CodeAction.CHANGE_MODULE]: () => {
          const nextModule = ChangeModuleApiCodeMapping[res.apiCode!]

          const nextData = res.data

          console.log(nextData, 'nextDatanextData dft')

          changeModule(nextModule, nextData)
          return CodeAction.CHANGE_MODULE
        },
        [CodeAction.RENDER_MESSAGE]: () => {
          message.error(res.message ?? res.messages)
          return CodeAction.RENDER_MESSAGE
        },
        [CodeAction.FLOW_END]: () => {
          return CodeAction.FLOW_END
        }
      }

      const codeAction = codeActionMapping[code]

      if (!codeAction) return res

      if (res.apiCode === ApiCode.FLOW_END) {
        const newData = res.data.user

        return {
          ...res,
          onGuardHandling: codeAction,
          isFlowEnd: true,
          data: newData ? { ...newData } : res
        }
      }

      return {
        ...res,
        onGuardHandling: codeAction
      }
    }

    httpClient.initErrorCodeInterceptor(errorCodeCb)
  }, [httpClient, changeModule])

  const renderModule = useMemo(() => {
    if (contextLoaded) {
      // 传入的渲染指令不正确的情况处理
      if (!moduleName || !ComponentsMapping[moduleName]) {
        return (
          <GuardErrorView
            error={
              new Error(`未知错误！moduleName 为 <b>${moduleName}</b> 无法识别`)
            }
          />
        )
      }
      return ComponentsMapping[moduleName](new Date().toString())
    } else if (loadingComponent) {
      return loadingComponent
    }

    return null
  }, [ComponentsMapping, contextLoaded, loadingComponent, moduleName])

  const visible = useMemo(() => {
    return guardProps.visible
  }, [guardProps.visible])

  const renderGuardContent = useMemo(() => {
    return <GuardButtonProvider>{renderModule}</GuardButtonProvider>
  }, [GuardButtonProvider, renderModule])

  return (
    <ConfigProvider
      prefixCls={PREFIX_CLS}
      locale={langMap[i18n.resolvedLanguage as LangMAP]}
    >
      {defaultMergedConfig.mode === GuardMode.Modal ? (
        <Modal
          className="authing-g2-render-module-modal"
          closeIcon={
            <IconFont type="authing-close-line" className="g2-modal-close" />
          }
          closable={defaultMergedConfig.clickCloseable ?? true}
          open={visible}
          onCancel={guardProps?.onClose}
          keyboard={defaultMergedConfig.escCloseable}
          maskClosable={false} // 点击蒙层，是否允许关闭
          getContainer={defaultMergedConfig.target ?? false}
        >
          <div className="authing-g2-render-module">{renderGuardContent}</div>
        </Modal>
      ) : (
        <div
          style={defaultMergedConfig.style}
          className={`authing-g2-render-module ${
            defaultMergedConfig.__internalRequest__
              ? ''
              : 'authing-g2-render-module-normal'
          }`}
        >
          <>11</>
          {renderGuardContent}
        </div>
      )}
    </ConfigProvider>
  )
}
