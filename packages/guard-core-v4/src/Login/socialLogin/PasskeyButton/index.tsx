import { React } from 'shim-react'
import { useState } from 'react'

import { message } from 'shim-antd'
import axios from 'axios'
import {
  CredentialRequestOptionsJSON,
  create as createWebauthnCredential,
  get as getWebauthnCredential
} from '@github/webauthn-json'
import { useGuardHttp } from '../../../_utils/guardHttp'
import { GuardButton } from '../../../GuardButton'
import { IconFont } from '../../../IconFont'
import { useTranslation } from 'react-i18next'

export const PasskeyButton = () => {
  const [webAuthn, setWebAuthn] = useState(null)
  const { post, get } = useGuardHttp()

  const [abortController, setAbortController] = useState<AbortController>()

  const { t } = useTranslation()

  const createAbortSignal = () => {
    if (abortController) {
      abortController.abort()
    }
    const controller = new AbortController()
    setAbortController(controller)
    return controller.signal
  }

  const initializeLogin = async () => {
    const { data } = await post('/api/v3/webauthn/login/initialize', {})
    return data
  }

  const finalizeLogin = async (assertion: any, ticket: string) => {
    const { data } = await post('/api/v3/webauthn/login/finalize', {
      credential: assertion,
      ticket
    })
    return data
  }

  const handleLogin = async () => {
    const challenge = await initializeLogin()
    challenge.mediation = 'required' as CredentialMediationRequirement
    challenge.signal = createAbortSignal()
    const ticket = challenge.ticket
    const assertion = await getWebauthnCredential(challenge)
    console.log(assertion)
    const assertionResponse = await finalizeLogin(assertion, ticket)
    alert(JSON.stringify(assertionResponse))
  }

  return (
    <GuardButton
      className="g2-guard-third-login-btn"
      block
      size="large"
      onClick={handleLogin}
      icon={
        <IconFont
          type="authing-passkey-fill"
          style={{ fontSize: 16, marginRight: 8 }}
        />
      }
    >
      {t('login.loginWithPasskey')}
    </GuardButton>
  )
}
