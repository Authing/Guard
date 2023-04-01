import { React } from 'shim-react'

import { i18n } from '../_utils'

import { GuardModuleType } from '..'

import { GuardButton } from '../GuardButton'

import { IconFont } from '../IconFont'

import { useGuardFinallyConfig, useGuardModule } from '../_utils/context'

import './styles.less'

const { useCallback, useMemo } = React

export interface BackProps {
  isRender?: boolean
}

export const BackLogin: React.FC<BackProps> = props => {
  const { changeModule } = useGuardModule()

  const config = useGuardFinallyConfig()

  const { t } = i18n

  const onBack = useCallback(() => changeModule?.(GuardModuleType.LOGIN), [changeModule])

  const { isRender = true } = props

  const renderBack = useMemo(() => {
    if (!isRender) return null

    const whitelist = [GuardModuleType.LOGIN, GuardModuleType.REGISTER]

    // 初始场景不是 登录 或者注册时候，不显示返回按钮
    if (config.defaultScenes && !whitelist.includes(config.defaultScenes)) {
      return null
    }

    return (
      <GuardButton type="link" onClick={onBack} className="g2-view-mfa-back-hover">
        <IconFont type="authing-arrow-left-line" style={{ fontSize: 24 }} />
      </GuardButton>
    )
  }, [isRender, config.defaultScenes, onBack, t])

  return (
    <div className="g2-view-back" style={{ display: 'inherit' }}>
      {renderBack}
    </div>
  )
}

export interface BackCustomProps extends BackProps {
  onBack?: () => void
}

export const BackCustom: React.FC<
  BackCustomProps & {
    children?: any
  }
> = props => {
  const { changeModule } = useGuardModule()

  const { onBack = () => changeModule?.(GuardModuleType.LOGIN), isRender = true, children } = props

  const renderBack = useMemo(() => {
    if (!isRender) return null

    return (
      <GuardButton type="link" onClick={onBack} className="g2-view-mfa-back-hover">
        <IconFont type="authing-arrow-left-line" style={{ fontSize: 24 }} />
        <span>{children}</span>
      </GuardButton>
    )
  }, [children, isRender, onBack])

  return (
    <div className="g2-view-back" style={{ display: 'inherit' }}>
      {renderBack}
    </div>
  )
}
