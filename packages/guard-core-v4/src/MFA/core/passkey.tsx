import { useTranslation } from 'react-i18next'
import { React } from 'shim-react'
import { ImagePro } from '../../ImagePro'
import { useGuardPublicConfig } from '../../_utils'
import { IconFont } from '../../IconFont'
import {
  GetPasskeyBindChallenge,
  GetPasskeyVerifyChallenge,
  MfaBusinessAction,
  useMfaBusinessRequest
} from '../businessRequest'
import { registerPasskey, verifyPasskey } from '../../_utils/passkey'
import { message } from 'shim-antd'
import SubmitButton from '../../SubmitButton'
import { MFAType } from '../interface'

interface BindPasskeyProps {
  mfaToken: string
  mfaLogin: (code: any, data: any, message?: string) => void
  mfaConfigsMap: Map<MFAType, boolean>
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
  const { mfaToken, mfaLogin, mfaConfigsMap } = props
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
      <h3 className="authing-g2-mfa-title">{t('common.cratePasskeyTitle')}</h3>

      {!mfaConfigsMap.get(MFAType.PASSKEY) ? (
        <>
          <p className="authing-g2-mfa-tips">{t('common.cratePasskeyTips')}</p>
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
            text={t('common.createNow')!}
            className="bind-passkey-btn"
            htmlType="button"
            ref={submitButtonRef}
          />
        </>
      ) : (
        <>
          <p className="authing-g2-mfa-tips">
            {t('common.onBindPasskeyTitle')}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <IconFont
              type="authing-bianzu"
              style={{ width: 178, height: 120 }}
            />
          </div>
        </>
      )}
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
      <h3 className="authing-g2-mfa-title">{t('common.passkeyVerifyTitle')}</h3>
      <p className="authing-g2-mfa-tips">{t('common.passkeyVerifyTips')}</p>
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
        text={t('common.reVerify')!}
        className="bind-passkey-btn"
        htmlType="button"
        ref={submitButtonRef}
      />
    </>
  )
}

export const MFAPasskey: React.FC<MFAPasskeyProps> = props => {
  const { passkeyEnabled, mfaLogin, mfaToken, mfaConfigsMap } = props
  return passkeyEnabled ? (
    <VerifyPasskey mfaLogin={mfaLogin} mfaToken={mfaToken} />
  ) : (
    <BindPasskey
      mfaLogin={mfaLogin}
      mfaToken={mfaToken}
      mfaConfigsMap={mfaConfigsMap}
    />
  )
}
