import { useTranslation } from 'react-i18next'
import { React } from 'shim-react'
import { ImagePro } from '../../ImagePro'
import { useGuardPublicConfig } from '../../_utils'
import {
  GetPasskeyBindChallenge,
  GetPasskeyVerifyChallenge,
  MfaBusinessAction,
  useMfaBusinessRequest
} from '../businessRequest'
import { registerPasskey, verifyPasskey } from '../../_utils/passkey'
import { message } from 'shim-antd'
import SubmitButton from '../../SubmitButton'

interface BindPasskeyProps {
  mfaToken: string
  mfaLogin: (code: any, data: any, message?: string) => void
}
interface VerifyPasskeyProps {
  mfaToken: string
  mfaLogin: (code: any, data: any, message?: string) => void
}

export type MFAPasskeyProps = BindPasskeyProps &
  VerifyPasskeyProps & {
    // 用户在当前应用下是否绑定了 passkey
    passkeyEnabled: boolean
  }

const BindPasskey: React.FC<BindPasskeyProps> = props => {
  const { mfaToken, mfaLogin } = props
  const submitButtonRef = React.useRef<any>(null)
  const businessRequest = useMfaBusinessRequest()[MfaBusinessAction.PasskeyBind]

  let { t } = useTranslation()

  const publicConfig = useGuardPublicConfig()

  const cdnBase = publicConfig?.cdnBase

  const bindPasskey = async () => {
    submitButtonRef.current?.onSpin(true)
    try {
      const challenge = await GetPasskeyBindChallenge({
        mfaToken
      })

      if (challenge.statusCode !== 200) {
        message.error(challenge.message)
        return
      }

      const attestation = await registerPasskey(challenge.data!)
      const { isFlowEnd, data, onGuardHandling } =
        (await businessRequest(attestation!)) || {}

      if (isFlowEnd) {
        mfaLogin(200, data)
      } else {
        submitButtonRef.current?.onError()
        onGuardHandling?.()
      }
    } catch (e) {
      console.warn('register passkey flow error: ', e)
    } finally {
      submitButtonRef.current?.onSpin(false)
    }
  }

  return (
    <>
      <h3 className="authing-g2-mfa-title">创建 Passkey</h3>
      <p className="authing-g2-mfa-tips">
        当前账号没有 passkey，请先完成创建验证后登录
      </p>
      <ImagePro
        // className="g2-mfa-passkey-empty-image"
        width={215}
        height={145}
        src={`${cdnBase}/passkey/guard-bind-passkey-press.png`}
        alt=""
        className="g2-mfa-register-passkey-image"
      />

      <SubmitButton
        onClick={bindPasskey}
        text="立即创建"
        className="bind-passkey-btn"
        htmlType="button"
        ref={submitButtonRef}
      />
    </>
  )
}

const VerifyPasskey: React.FC<VerifyPasskeyProps> = props => {
  const { mfaToken, mfaLogin } = props
  const submitButtonRef = React.useRef<any>(null)
  const businessRequest =
    useMfaBusinessRequest()[MfaBusinessAction.PasskeyVerify]

  let { t } = useTranslation()

  const publicConfig = useGuardPublicConfig()
  const cdnBase = publicConfig?.cdnBase

  const handleVerifyPasskey = React.useCallback(async () => {
    submitButtonRef.current?.onSpin(true)
    try {
      const challenge = await GetPasskeyVerifyChallenge({
        mfaToken
      })

      if (challenge.statusCode !== 200) {
        message.error(challenge.message)
        return
      }

      const attestation = await verifyPasskey(challenge.data!)
      const { isFlowEnd, data, onGuardHandling } =
        (await businessRequest({
          credential: attestation!,
          ticket: challenge.data?.ticket || ''
        })) || {}

      if (isFlowEnd) {
        mfaLogin(200, data)
      } else {
        submitButtonRef.current?.onError()
        onGuardHandling?.()
      }
    } catch (e) {
      console.warn('verify passkey flow error: ', e)
    } finally {
      submitButtonRef.current?.onSpin(false)
    }
  }, [])

  // 首次进入页面立即开始验证
  React.useEffect(() => {
    handleVerifyPasskey()
  }, [])

  return (
    <>
      <h3 className="authing-g2-mfa-title">Passkey 登录</h3>
      <p className="authing-g2-mfa-tips">
        为了保障访问安全，请根据浏览器提示完成验证
      </p>
      <ImagePro
        // className="g2-mfa-passkey-empty-image"
        width={215}
        height={145}
        src={`${cdnBase}/passkey/guard-bind-passkey-press.png`}
        alt=""
        className="g2-mfa-verify-passkey-image"
      />

      <SubmitButton
        onClick={handleVerifyPasskey}
        text="重新验证"
        className="bind-passkey-btn"
        htmlType="button"
        ref={submitButtonRef}
      />
    </>
  )
}

export const MFAPasskey: React.FC<MFAPasskeyProps> = props => {
  const { passkeyEnabled, mfaLogin, mfaToken } = props
  return passkeyEnabled ? (
    <VerifyPasskey mfaLogin={mfaLogin} mfaToken={mfaToken} />
  ) : (
    <BindPasskey mfaLogin={mfaLogin} mfaToken={mfaToken} />
  )
}
