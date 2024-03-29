import { React } from 'shim-react'

import { useTranslation } from 'react-i18next'

import { GuardModuleType } from '../Guard'

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

  const { t } = useTranslation()

  const onBack = useCallback(
    () => changeModule?.(GuardModuleType.LOGIN),
    [changeModule]
  )

  const { isRender = true } = props

  if (!isRender) return null

  const whitelist = [GuardModuleType.LOGIN, GuardModuleType.REGISTER]

  // 初始场景不是 登录 或者注册时候，不显示返回按钮
  if (config.defaultScenes && !whitelist.includes(config.defaultScenes)) {
    return null
  }

  const renderBack = useMemo(() => {
    return (
      <GuardButton
        type="link"
        onClick={onBack}
        className="g2-view-mfa-back-hover"
      >
        <IconFont
          type="authing-arrow-left-6"
          className="authing-arrow-left-6"
        />
      </GuardButton>
    )
  }, [isRender, config.defaultScenes, onBack, t])

  return (
    <div
      className={`g2-view-back ${config.mode === 'modal' && 'modal'}`}
      style={{ display: 'inherit' }}
    >
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

  const {
    onBack = () => changeModule?.(GuardModuleType.LOGIN),
    isRender = true,
    children
  } = props

  const { mode } = useGuardFinallyConfig()

  const renderBack = useMemo(() => {
    return (
      <GuardButton
        type="link"
        onClick={onBack}
        className="g2-view-mfa-back-hover"
      >
        <IconFont
          type="authing-arrow-left-6"
          className="authing-arrow-left-6"
        />
        <span>{children}</span>
      </GuardButton>
    )
  }, [children, isRender, onBack])

  if (!isRender) return null

  return (
    <div
      className={`g2-view-back ${mode === 'modal' && 'modal'}`}
      style={{ display: 'inherit' }}
    >
      {renderBack}
    </div>
  )
}
