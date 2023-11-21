import { User } from 'authing-js-sdk'
import { useGuardAuthClient } from '../Guard/authClient'
import { Space } from 'shim-antd'
import '@antd-es-style/space/style/index.less'
import { React } from 'shim-react'
import { useTranslation } from 'react-i18next'
import { ImagePro } from '../ImagePro'
import {
  useGuardEvents,
  useGuardFinallyConfig,
  useGuardHttpClient,
  useGuardInitData
} from '../_utils/context'
import { getGuardHttp } from '../_utils/guardHttp'
import './style.less'

import { useGuardView } from '../Guard/core/hooks/useGuardView'

import { useGlobalAuthClient } from '../AuthClientProvider'

const { useCallback } = React

export const GuardSelectAccount2LoginView = () => {
  const config = useGuardFinallyConfig()
  const events = useGuardEvents()
  const { t } = useTranslation()
  const authClient = useGuardAuthClient()
  const { post } = useGuardHttpClient()

  const initData = useGuardInitData<{
    accounts: any[]
    myself: any
    i18n: string
  }>()

  const accounts = initData?.accounts ?? []
  const myself = initData?.myself ?? {}
  const i18n = initData?.i18n
  const users = [myself, ...accounts]

  useGuardView()
  const { authFlow } = getGuardHttp()

  const onClick = useCallback(
    async (user: User & { userId: string }) => {
      const { isFlowEnd, data, onGuardHandling } = await authFlow(
        'public-account-login-selection',
        {
          userId: user.userId
        }
      )
      if (isFlowEnd) {
        events?.onLogin?.(data, authClient!) // 登录成功
      } else {
        onGuardHandling?.()
      }
    },
    [authClient, post, events]
  )

  return (
    <>
      {!initData ? (
        config.loadingComponent
      ) : (
        <div className="g2-view-container g2-view-container-2-login">
          <div className="g2-view-header">
            <ImagePro
              src={config?.logo as string}
              size={42}
              borderRadius={4}
              alt=""
              className="icon"
            />
            <div className="title">{i18n}</div>
          </div>
          <div className="g2-view-tabs">
            <ul className="g2-select-account-2-login_wrapper">
              {users.map((user: any, index: number) => {
                return (
                  <li
                    className="g2-select-account-2-login__li"
                    key={index}
                    onClick={() => onClick(user)}
                  >
                    <img
                      className="g2-select-account-2-login__avatar"
                      alt={user.userId}
                      src={user.avatar || ''}
                    />
                    <div className="g2-select-account-2-login__body">
                      {user.displayName && (
                        <Space className="g2-select-account-2-login__title">
                          {user.displayName}
                          {+user.usertype === 2 && (
                            <Space className="g2-select-account-2-login__des">
                              {t('common.publicAccount')}
                            </Space>
                          )}
                        </Space>
                      )}
                      <Space className={'g2-multiple__tel'}>
                        {user?.phone || '-'}
                      </Space>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      )}
    </>
  )
}
