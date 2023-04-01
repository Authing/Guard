import { React } from 'shim-react'

import { GuardModuleType } from '..'

import { User } from 'authing-js-sdk'

import { BackCustom } from '../Back'

import { useGuardAuthClient } from '../Guard/authClient'

import { GuardMFAInitData, MFAType } from '../MFA/interface'

import {
  useGuardEvents,
  useGuardInitData,
  useGuardIsAuthFlow,
  useGuardModule
} from '../_utils/context'

import { SaveCode } from './core/saveCode'

import { UseCode } from './core/useCode'

import './style.less'

import { useGuardView } from '../Guard/core/hooks/useGuardView'

const { useMemo, useState } = React

export const RecoveryCode: React.FC = () => {
  const { changeModule } = useGuardModule()

  const initData = useGuardInitData<GuardMFAInitData>()

  const events = useGuardEvents()

  useGuardView()

  const [user, setUser] = useState<User>()

  const [code, setCode] = useState<string>()

  const authClient = useGuardAuthClient()

  const onBind = () => {
    if (user) events?.onLogin?.(user, authClient)
  }

  const renderBack = useMemo(() => {
    return (
      <BackCustom
        onBack={() =>
          changeModule?.(GuardModuleType.MFA, {
            ...initData,
            current: MFAType.TOTP
          })
        }
      ></BackCustom>
    )
  }, [changeModule, initData])

  return (
    <div className="g2-view-container g2-mfa-recovery-code">
      {renderBack}
      <div className="g2-mfa-content">
        {user && code ? (
          <SaveCode secret={code} onBind={onBind} />
        ) : (
          <UseCode
            mfaToken={initData.mfaToken}
            onSubmit={(code, user) => {
              setUser(user)
              setCode(code)
            }}
          />
        )}
      </div>
    </div>
  )
}

export const RecoveryCodeAuthFlow: React.FC = () => {
  const { changeModule } = useGuardModule()

  const initData = useGuardInitData<GuardMFAInitData>()

  const [recoveryCode, setRecoveryCode] = useState<string>()

  const events = useGuardEvents()

  const authClient = useGuardAuthClient()

  const onBind = (user: User) => {
    if (user) events?.onLogin?.(user, authClient)
  }

  const renderBack = useMemo(() => {
    return (
      <BackCustom
        onBack={() =>
          changeModule?.(GuardModuleType.MFA, {
            ...initData,
            current: MFAType.TOTP
          })
        }
      ></BackCustom>
    )
  }, [changeModule, initData])

  return (
    <div className="g2-view-container g2-mfa-recovery-code">
      {renderBack}
      <div className="g2-mfa-content">
        {recoveryCode ? (
          <SaveCode secret={recoveryCode} onBind={onBind} />
        ) : (
          <UseCode
            mfaToken={initData.mfaToken}
            onSubmit={code => {
              setRecoveryCode(code)
            }}
          />
        )}
      </div>
    </div>
  )
}

export const GuardRecoveryCodeView: React.FC = () => {
  const isAuthFlow = useGuardIsAuthFlow()

  return <>{isAuthFlow ? <RecoveryCodeAuthFlow /> : <RecoveryCode />}</>
}
