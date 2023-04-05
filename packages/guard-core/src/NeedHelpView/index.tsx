import { React } from 'shim-react'

import { useTranslation } from 'react-i18next'

import { DescribeQuestions } from './core/describeQuestions'

import { GuardModuleType } from '../Guard/module'

import { useGuardAppId, useGuardFinallyConfig, useGuardModule } from '../_utils/context'

import { useGuardView } from '../Guard/core/hooks/useGuardView'

export const GuardNeedHelpView = () => {
  const { t } = useTranslation()

  const appId = useGuardAppId()

  const { changeModule } = useGuardModule()

  const config = useGuardFinallyConfig()

  const onSuccess = () => {
    changeModule?.(GuardModuleType.SUBMIT_SUCCESS)
  }

  useGuardView()

  return (
    <div className="g2-view-container g2-need-help">
      <div className="g2-view-header">
        <div className="title">{t('common.problem.title')}</div>
      </div>
      <div className="g2-view-tabs">
        <DescribeQuestions appId={appId} host={config.host} onSuccess={onSuccess} />
      </div>
      <div className="g2-tips-line ">
        <div className="back-to-login">
          <span className="gray">{t('common.noQuestions')}</span>
          <span className="link-like" onClick={() => changeModule?.(GuardModuleType.LOGIN)}>
            {t('common.goToLogin')}
          </span>
        </div>
      </div>
    </div>
  )
}
