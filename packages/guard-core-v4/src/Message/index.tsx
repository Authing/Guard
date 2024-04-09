import { React } from 'shim-react'

import { i18n } from '../_utils/locales'

import './styles.less'

import { useGuardInitData, useGuardPublicConfig } from '../_utils/context'

import { useGuardView } from '../Guard/core/hooks/useGuardView'

const { useMemo } = React

export interface MessageProps {
  message?: React.ReactNode
}

export interface GuardMessageProps {
  initData?: MessageProps
}

export const GuardMessageView: React.FC<MessageProps> = propsInitData => {
  const guardXInitData = useGuardInitData<MessageProps>()

  const publicConfig = useGuardPublicConfig()

  useGuardView()

  const messages = useMemo(() => {
    const message = propsInitData?.message ?? guardXInitData?.message

    return `${message}` ?? `${i18n.t('user.contactAdministrator')}`
  }, [guardXInitData?.message, propsInitData?.message])

  return (
    <div className="g2-view-container g2-view-message">
      <div className="g2-message-content">
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div
            style={{
              width: 135,
              height: 103,
              backgroundImage: `url(${publicConfig.cdnBase}/authing_message.svg)`,
              backgroundSize: 'contain'
            }}
          />
        </div>
        <span
          className="g2-message-text"
          dangerouslySetInnerHTML={{ __html: messages }}
        />
      </div>
    </div>
  )
}
