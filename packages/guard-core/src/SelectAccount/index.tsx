import { User } from 'authing-js-sdk'

import { React } from 'shim-react'

import { useGuardAuthClient } from '../Guard/authClient'

import { ImagePro } from '../ImagePro'

import {
  useGuardEvents,
  useGuardFinallyConfig,
  useGuardHttpClient,
  useGuardInitData
} from '../_utils/context'

import './style.less'

import { useGuardView } from '../Guard/core/hooks/useGuardView'

const { useCallback, useMemo } = React

export const GuardSelectAccountView = () => {
  const config = useGuardFinallyConfig()
  const events = useGuardEvents()
  const authClient = useGuardAuthClient()
  const { post } = useGuardHttpClient()
  const loadingComponent = useMemo(() => {
    return config.loadingComponent
  }, [config.loadingComponent])
  const initData = useGuardInitData<{
    accounts: User[]
    i18n: string
  }>()

  useGuardView()

  const onClick = useCallback(
    async (user: User) => {
      const { isFlowEnd, data, onGuardHandling } = await post(
        '/interaction/federation/binding/select',
        {
          account: user.id
        }
      )
      if (isFlowEnd) {
        events?.onLogin?.(data, authClient)
      } else {
        onGuardHandling?.()
      }
    },
    [authClient, post, events]
  )
  const renderList = useMemo(() => {
    if (!initData) {
      return null
    }
    return initData?.accounts.map(user => {
      const { id, photo, phone, email, username, nickname, name } = user
      const title = name || nickname || username || undefined
      const description = phone || email
      return (
        <li className="g2-select-account__li" key={id} onClick={() => onClick(user)}>
          <img className="g2-select-account__avatar" alt="" src={photo || ''} />
          <div className="g2-select-account__body">
            {title && <span className="g2-select-account__title">{title}</span>}
            <span className={title ? 'g2-multiple__desc' : 'g2-multiple__title'}>
              {description}
            </span>
          </div>
        </li>
      )
    })
  }, [onClick, initData])
  const title = useMemo(() => {
    if (!initData) return ''
    return initData.i18n
  }, [initData])
  return (
    <>
      {!initData ? (
        loadingComponent
      ) : (
        <div className="g2-view-container">
          <div className="g2-view-header">
            <ImagePro
              src={config?.logo as string}
              size={48}
              borderRadius={4}
              alt=""
              className="icon"
            />
            <div className="title">{title}</div>
          </div>
          <div className="g2-view-tabs">
            <ul className="g2-select-account_wrapper">{renderList}</ul>
          </div>
        </div>
      )}
    </>
  )
}
