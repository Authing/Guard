import { message } from 'shim-antd'

import { React, ReactNode } from 'shim-react'

import { useTranslation } from 'react-i18next'

import { GuardModuleType } from '../Guard/module'

import { ImagePro } from '../ImagePro'

import { useGuardFinallyConfig, useGuardInitData, useGuardModule } from '../_utils/context'

import { CompletePassword } from './core/completePassword'

import { FirstLoginReset } from './core/firstLoginReset'

import { RotateReset } from './core/rotateReset'

import { PasswordNotSafeReset } from './core/PasswordNotSafeReset'

import { useGuardView } from '../Guard/core/hooks/useGuardView'

const { useMemo } = React

// 手动修改密码，并非「忘记密码」
// 进入的场景是读取配置：1开了首次登录修改密码 || 2开了密码轮换
export const GuardChangePassword: React.FC<{
  title: string
  explain: string
  children: ReactNode
}> = props => {
  const { title, explain, children } = props

  const config = useGuardFinallyConfig()

  const typeContent = useMemo(
    () => ({
      title,
      explain
    }),
    [explain, title]
  )

  useGuardView()

  return (
    <div className="g2-view-container g2-change-password">
      <div className="g2-view-header">
        <ImagePro src={config?.logo as string} size={48} borderRadius={4} className="icon" />
        <div className="title">{typeContent.title}</div>
        <div className="title-explain">{typeContent.explain}</div>
      </div>
      <div className="g2-view-tabs">{children}</div>
    </div>
  )
}

export const GuardFirstLoginPasswordResetView: React.FC = () => {
  const { t } = useTranslation()

  const { changeModule } = useGuardModule()

  const onReset = () => {
    message.success(t('common.updatePsswordSuccess'))
    setTimeout(() => {
      changeModule?.(GuardModuleType.LOGIN)
    }, 500)
  }

  const config = useGuardFinallyConfig()

  const coreForm = <FirstLoginReset onReset={onReset} />

  return (
    <GuardChangePassword
      title={`${t('common.welcome')} ${config.title}`}
      explain={t('common.initPasswordText')}
    >
      {coreForm}
    </GuardChangePassword>
  )
}

export const GuardPasswordNotSafeResetView: React.FC = () => {
  const { t } = useTranslation()

  const { changeModule } = useGuardModule()

  const onReset = () => {
    message.success(t('common.updatePsswordSuccess'))
    setTimeout(() => {
      changeModule?.(GuardModuleType.LOGIN)
    }, 500)
  }

  const config = useGuardFinallyConfig()

  const coreForm = <PasswordNotSafeReset onReset={onReset} />

  return (
    <GuardChangePassword
      title={`${t('common.welcome')} ${config.title}`}
      explain={t('common.unsafePasswordChangeText')}
    >
      {coreForm}
    </GuardChangePassword>
  )
}

export const GuardForcedPasswordResetView: React.FC = () => {
  const { t } = useTranslation()

  const { changeModule } = useGuardModule()

  const initData = useGuardInitData<{ forcedCycle: number }>()

  const onReset = () => {
    message.success(t('common.updatePsswordSuccess'))
    setTimeout(() => {
      changeModule?.(GuardModuleType.LOGIN)
    }, 500)
  }

  const coreForm = <RotateReset onReset={onReset} />

  return (
    <GuardChangePassword
      title={t('user.modifyPwd')}
      explain={t('user.modifyPwdText', {
        number: initData.forcedCycle
      })}
    >
      {coreForm}
    </GuardChangePassword>
  )
}

export const GuardNoticePasswordResetView: React.FC = () => {
  const { t } = useTranslation()

  const { changeModule } = useGuardModule()

  const initData = useGuardInitData<{
    forcedCycle: number
    onFinishCallBack: any
  }>()

  const onReset = () => {
    message.success(t('common.updatePsswordSuccess'))
    setTimeout(() => {
      changeModule?.(GuardModuleType.LOGIN)
    }, 500)
  }

  const coreForm = <RotateReset onReset={onReset} onFinishCallBack={initData.onFinishCallBack} />

  return (
    <GuardChangePassword
      title={t('user.modifyPwd')}
      explain={t('user.modifyNoticePwdText', {
        number: initData.forcedCycle
      })}
    >
      {coreForm}
    </GuardChangePassword>
  )
}

export const GuardRegisterCompletePasswordView: React.FC = () => {
  const { t } = useTranslation()

  const config = useGuardFinallyConfig()

  return (
    <GuardChangePassword
      title={`${t('common.welcome')} ${config.title}`}
      explain={t('common.registerCompletePasswordDesc')}
    >
      <CompletePassword />
    </GuardChangePassword>
  )
}
