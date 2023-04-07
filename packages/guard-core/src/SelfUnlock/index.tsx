import { React } from 'shim-react'

import { useTranslation } from 'react-i18next'

import { GuardModuleType } from '../Guard'

import { SelfUnlock } from './core/selfUnlock'

import { ImagePro } from '../ImagePro'

import { useGuardFinallyConfig, useGuardModule } from '../_utils/context'

import { useGuardView } from '../Guard/core/hooks/useGuardView'

import { BackCustom } from '../Back'

const { useRef } = React

export const GuardUnlockView: React.FC = () => {
  const { t } = useTranslation()

  const config = useGuardFinallyConfig()

  const { changeModule } = useGuardModule()

  const identifyRef = useRef('')

  useGuardView()

  return (
    <div className="g2-view-container g2-forget-password">
      <BackCustom onBack={() => changeModule?.(GuardModuleType.LOGIN)} />
      <div className="g2-view-header">
        <ImagePro src={config?.logo as string} size={48} borderRadius={4} alt="" className="icon" />
        <div className="title">{t('login.selfUnlock')}</div>
        <div className="title-explain">{t('login.selfUnlockText')}</div>
      </div>
      <div className="g2-view-tabs">
        <SelfUnlock identifyRef={identifyRef} />
      </div>
      <div className="g2-tips-line">
        <span>{t('user.unlockTip')} &nbsp;</span>
        <span
          className="link-like"
          onClick={() =>
            changeModule?.(GuardModuleType.ANY_QUESTIONS, {
              identify: identifyRef.current
            })
          }
        >
          {t('common.feedback')}
        </span>
      </div>
      {/* <ChangeLanguage langRange={langRange} onLangChange={props.onLangChange} /> */}
    </div>
  )
}
