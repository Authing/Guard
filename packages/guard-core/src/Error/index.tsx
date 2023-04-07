import { React } from 'shim-react'

import { ErrorInitData } from './interface'

import { i18n } from '../_utils/locales'

import './styles.less'

import { useGuardInitData } from '../_utils/context'

import { useGuardView } from '../Guard/core/hooks/useGuardView'

export interface ErrorProps {
  error?: Error
}

const { useMemo } = React

export const GuardErrorView: React.FC<ErrorProps> = propsInitData => {
  const guardXInitData = useGuardInitData<ErrorInitData>()

  useGuardView()

  const messages = useMemo(() => {
    const error = propsInitData?.error ?? guardXInitData?.error

    return `${error?.message}` ?? `${i18n.t('user.contactAdministrator')}`
  }, [guardXInitData?.error, propsInitData?.error])

  return (
    <div className="g2-view-container g2-view-error">
      <div className="g2-error-content">
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div
            style={{
              width: 205,
              height: 140,
              backgroundImage:
                'url(https://authing-files.oss-cn-zhangjiakou.aliyuncs.com/authing-guard/authing_error.svg)',
              backgroundSize: 'contain'
            }}
          />
        </div>
        <div className="g2-error-message">{i18n.t('user.error')}</div>
        <span className="g2-error-message-text" dangerouslySetInnerHTML={{ __html: messages }} />
      </div>
    </div>
  )
}
