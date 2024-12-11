import { React } from 'shim-react'
import {
  useGuardEvents,
  useGuardFinallyConfig,
  useGuardHttpClient,
  useGuardModule
} from '../../_utils/context'
import { Form } from 'shim-antd'
import SubmitButton from '../../SubmitButton'
import { ChangeLanguage } from '../../ChangeLanguage'
import { useGuardView } from '../..'
import { EmailFormItem } from '../components/EmailFormItem'
import { GuardModuleType } from '../../Guard'
import { useMediaSize } from '../../_utils/hooks'
import { extendsFieldsToMetaData } from '../../CompleteInfo/utils'
import { useTranslation } from 'react-i18next'
const { useRef } = React
enum LoginSceneMap {
  password = 'login',
  qrcode = 'login',
  verifyCode = 'login',
  invitationRegister = 'ey_check_captcha'
}

export const EyGuardPreCheckEmailView = () => {
  useGuardView()

  const { t } = useTranslation()

  const { isPhoneMedia } = useMediaSize()

  const config = useGuardFinallyConfig()

  const events = useGuardEvents()

  const { changeModule } = useGuardModule()

  const { post } = useGuardHttpClient()

  const [form] = Form.useForm()

  let submitButtonRef = useRef<any>(null)

  const onFinishHandle = async (formValue: any) => {
    // fetch

    const res = await post<{ scene: keyof typeof LoginSceneMap; context: any }>(
      '/api/v3/pre-check-account',
      {
        account: formValue.email
      }
    )
    const { statusCode, data, onGuardHandling } = res
    if (statusCode === 200) {
      let nextModule = LoginSceneMap[
        data!.scene
      ] as unknown as GuardModuleType | null
      const context = data?.context

      let initData = {
        ...context,
        verifyAccount: formValue.email
      }

      const {
        extendsFields = [],
        extendsFieldsOptions = [],
        email,
        phone,
        username,
        qrCodeBindMethods,
        name
      } = initData

      const needCompleteData = extendsFields?.filter(
        (field: { name: string; type: string }) => {
          if (field.name === 'email' && field.type === 'internal') {
            return !email
          }
          if (field.name === 'phone' && field.type === 'internal') {
            return !phone
          }
          if (field.name === 'username' && field.type === 'internal') {
            return !username
          }
          if (field.name === 'name' && field.type === 'internal') {
            return !name
          }
          return true
        }
      )

      const metaData = extendsFieldsToMetaData(
        needCompleteData,
        extendsFieldsOptions
      )

      const wecomQrs =
        qrCodeBindMethods?.['wechatwork-service-provider-qrconnect'] || []
      const wecomNewQrs =
        qrCodeBindMethods?.['wechatwork-service-provider-qrconnect-v2'] || []

      if (nextModule === GuardModuleType.LOGIN) {
        initData = {
          scene: data!.scene,
          ...initData
        }
      } else if (nextModule === GuardModuleType.EY_CHECK_CAPTCHA) {
        //  和 user-portal inviteByCode 指定逻辑相同

        if (context?.enabledIdentifierCodeConfig) {
          //  开启身份验证码
          nextModule = GuardModuleType.EY_CHECK_CAPTCHA
        } else if (context?.enabledRegisterFillInfo && metaData.length > 0) {
          initData = {
            ...initData,
            metaData,
            originModule: GuardModuleType.EY_PRE_CHECK_EMAIL,
            context: {
              ticket: context.ticket
            }
          }
          nextModule = GuardModuleType.EY_INVITE_COMPLETE
        } else if (context?.enabledExtIdpBind && wecomQrs.length > 0) {
          initData = {
            ...initData,
            weComConfig: wecomQrs[0],
            originModule: GuardModuleType.EY_PRE_CHECK_EMAIL,
            context: {
              ticket: context.ticket
            }
          }
          nextModule = GuardModuleType.EY_IDENTITY_BIND
        } else if (context?.enabledExtIdpBind && wecomNewQrs.length > 0) {
          initData = {
            ...initData,
            weComConfig: wecomNewQrs[0],
            originModule: GuardModuleType.EY_PRE_CHECK_EMAIL,
            isNew: true,
            context: {
              ticket: context.ticket
            }
          }
          nextModule = GuardModuleType.EY_IDENTITY_BIND
        } else if (context?.autoLogin) {
          // 自动登录
          initData = {
            ...context,
            context: {
              ticket: context.ticket
            }
          }
          nextModule = GuardModuleType.EY_INVITE_LOADING
        } else {
          // todo 直接注册

          const res: any = await post('/api/v3/register-invitation-user', {
            ticket: context.ticket
          })

          if (res.code === 200) {
            events?.onRegister?.(res.data, res.message)
            nextModule = GuardModuleType.LOGIN
            initData = {
              scene: 'verifyCode',
              ...initData
            }
          } else {
            const { onGuardHandling } = res
            onGuardHandling?.()
            events?.onRegisterError?.(res.message)
            nextModule = null
          }
        }
      }

      nextModule && changeModule?.(nextModule, initData)
    } else {
      onGuardHandling?.({
        title: t('common.ey.activeFail')
      })
    }
  }

  return (
    <div className="g2-view-container ey-pre-check-email">
      <div className="g2-view-container-inner">
        <div className="g2-view-header">
          <img src={config?.logo} alt="" className="icon" />
          <div className="title">{config?.title}</div>
          {/* {!!publicConfig?.welcomeMessage && (
            <div className="title-description">
              {publicConfig?.welcomeMessage[i18n.language]}
            </div>
          )} */}
        </div>

        <div className="g2-view-content">
          <Form
            name="et-pre-check-email"
            onFinish={onFinishHandle}
            onFinishFailed={() => submitButtonRef.current.onError()}
            autoComplete="off"
            form={form}
            // onValuesChange={formValuesChange}
          >
            <EmailFormItem
              inputProps={{
                autoFocus: !isPhoneMedia,
                placeholder: t('login.inputEmail')
              }}
            />

            <Form.Item className="authing-g2-sumbit-form">
              <SubmitButton
                text={t('login.nextStep')!}
                className="password"
                ref={submitButtonRef}
              />
            </Form.Item>
          </Form>
        </div>
        <ChangeLanguage
          langRange={config?.langRange}
          onLangChange={events?.onLangChange}
        />
      </div>
    </div>
  )
}
