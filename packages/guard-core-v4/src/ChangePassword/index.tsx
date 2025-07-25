import { React, ReactNode } from 'shim-react'

import { message } from 'shim-antd'

import { useTranslation } from 'react-i18next'

import { GuardModuleType } from '../Guard/module'

import { ImagePro } from '../ImagePro'

import {
  useGuardFinallyConfig,
  useGuardInitData,
  useGuardModule,
  useGuardPublicConfig
} from '../_utils/context'

import { CompletePassword } from './core/completePassword'

import { FirstLoginReset } from './core/firstLoginReset'

import { RotateReset } from './core/rotateReset'

import { PasswordNotSafeReset } from './core/PasswordNotSafeReset'

import { useGuardView } from '../Guard/core/hooks/useGuardView'

import { ForcedModifyPwdCycleUnit } from '../Type'

import { i18n } from '../_utils'

const { useMemo } = React

// 手动修改密码，并非「忘记密码」
// 进入的场景是读取配置：1开了首次登录修改密码 || 2开了密码轮换
export const GuardChangePassword: React.FC<{
  title: string
  explain: string
  children: ReactNode
  logo?: string
}> = props => {
  const { title, explain, children, logo } = props

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
        <ImagePro
          src={logo ?? (config?.logo as string)}
          size={48}
          borderRadius={4}
          alt=""
          className="icon"
        />
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

  const resolvedLanguage = i18n.resolvedLanguage ?? i18n.language

  const publicConfig = useGuardPublicConfig()

  // const initData = useGuardInitData<{
  //   forcedCycle: number
  //   forcedCycleUnit: ForcedModifyPwdCycleUnit
  // }>()

  const onReset = () => {
    message.success(t('common.updatePsswordSuccess'))
    setTimeout(() => {
      changeModule?.(GuardModuleType.LOGIN)
    }, 500)
  }

  const coreForm = <RotateReset onReset={onReset} />

  // const modifyNotice = useMemo(() => {
  //   switch (initData?.forcedCycleUnit) {
  //     case ForcedModifyPwdCycleUnit.Day:
  //       return {
  //         text: t('user.modifyPwdTextDay', {
  //           number: initData.forcedCycle
  //         }),
  //         unit: t('common.day')
  //       }
  //     case ForcedModifyPwdCycleUnit.Year:
  //       return {
  //         text: t('user.modifyPwdTextYear', {
  //           number: initData.forcedCycle
  //         }),
  //         unit: t('common.year')
  //       }
  //     case ForcedModifyPwdCycleUnit.Month:
  //     default:
  //       return {
  //         text: t('user.modifyPwdTextMonth', {
  //           number: initData.forcedCycle
  //         }),
  //         unit: t('common.month')
  //       }
  //   }
  // }, [initData])

  const title = useMemo(() => {
    const text = publicConfig?.noticePwdTipsConfig?.title
    return (
      (text?.i18n?.[resolvedLanguage].enabled
        ? text?.i18n?.[resolvedLanguage]?.value
        : text?.default) ?? t('user.modifyPwd')
    )
  }, [publicConfig, resolvedLanguage])

  const explain = useMemo(() => {
    const text = publicConfig?.noticePwdTipsConfig?.desc
    let brandText = text?.i18n?.[resolvedLanguage].enabled
      ? text?.i18n?.[resolvedLanguage]?.value
      : text?.default

    // if (brandText) {
    //   brandText = brandText.replaceAll(
    //     '{time}',
    //     `${initData.forcedCycle} ${modifyNotice.unit} `
    //   )
    // }
    return brandText ?? t('user.passwordExpired')
  }, [publicConfig, resolvedLanguage])

  return (
    <GuardChangePassword
      title={title}
      explain={explain}
      logo={publicConfig?.noticePwdCustomLogo}
    >
      {coreForm}
    </GuardChangePassword>
  )
}

export const GuardNoticePasswordResetView: React.FC = () => {
  const { t } = useTranslation()

  const { changeModule } = useGuardModule()

  const publicConfig = useGuardPublicConfig()

  const initData = useGuardInitData<{
    title?: string
    explain?: string
    onFinishCallBack: any
  }>()

  const onReset = () => {
    message.success(t('common.updatePsswordSuccess'))
    setTimeout(() => {
      changeModule?.(GuardModuleType.LOGIN)
    }, 500)
  }

  const coreForm = (
    <RotateReset
      onReset={onReset}
      onFinishCallBack={initData.onFinishCallBack}
    />
  )

  return (
    <GuardChangePassword
      title={initData?.title ?? t('user.modifyPwd')}
      explain={initData?.explain ?? t('user.passwordExpiredByDay')}
      logo={publicConfig?.noticePwdCustomLogo}
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
