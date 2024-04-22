import { React } from 'shim-react'

import { useGuardHttp } from '../../../_utils/guardHttp'

import { BeforeLogin } from './BeforeLogin'

import { PendingLogin } from './PendingLogin'

import {
  OnPushSuccessProps,
  CheckPushCodeStatusProps,
  OnLoginProps,
  LoginStatus,
  LoginWithAuthingOtpPushProps
} from './types'

import { message } from 'shim-antd'

import { useGuardPublicConfig } from '../../../_utils/context'

import { LoginMethods } from '../../../Type/application'

const { useCallback, useEffect, useRef, useState } = React

export function LoginWithAuthingOtpPush(props: LoginWithAuthingOtpPushProps) {
  const { onLoginSuccess, multipleInstance, agreements } = props

  const [loginStatus, setLoginStatus] = useState<LoginStatus>('before')

  const [pushCodeId, setPushCodeId] = useState<string>('')

  const [pushLoginStatus, setPushLoginStatus] = useState<boolean>(true)

  const timer = useRef<NodeJS.Timeout | undefined>()

  const [account, setAccount] = useState<string>('')

  const clearTimer = () => {
    timer.current && clearInterval(timer.current)
  }

  const { post, get } = useGuardHttp()

  const publicConfig = useGuardPublicConfig()

  const onPushSuccess = (props: OnPushSuccessProps) => {
    setLoginStatus('pending')
    setPushCodeId(props.pushCodeId)
  }

  const onCancelLogin = useCallback(() => {
    clearTimer()
    setLoginStatus('before')
  }, [])

  const onchangePushLoginStatus = useCallback((status = true) => {
    setPushLoginStatus(status)
  }, [])

  const signinByPush = async (props: OnLoginProps) => {
    const { account, agreementIds } = props
    const url = '/api/v3/signin-by-push'
    const body = {
      account,
      agreementIds
    }
    return await post(url, body)
  }

  const checkPushCodeStatus = useCallback(
    async (props: CheckPushCodeStatusProps) => {
      const { pushCodeId } = props
      const url = `/api/v3/check-pushcode-status?pushCodeId=${pushCodeId}`
      return await get(url)
    },
    [get]
  )

  const getUserInfo = useCallback(
    async (accessToken: string) => {
      const url = '/api/v2/users/me/info'
      const config = {
        headers: {
          'x-authing-userpool-id': publicConfig.userPoolId,
          authorization: `Bearer ${accessToken}`
        }
      }
      return await get(url, {}, config)
    },
    [get, publicConfig.userPoolId]
  )

  const onPushLogin = async () => {
    const {
      statusCode,
      data,
      message: _message
    } = await checkPushCodeStatus({
      pushCodeId
    })

    if (statusCode !== 200) {
      message.error(_message)
      onCancelLogin()
      return
    }

    if (data.status === 'AUTHORIZED') {
      const { access_token } = data.tokenSet

      clearTimer()

      const { code, data: _userInfo, message } = await getUserInfo(access_token)

      if (code === 200) {
        multipleInstance?.setLoginWay('input', LoginMethods.AuthingOtpPush)
        onLoginSuccess(_userInfo, message)
        return
      }
    }

    if (data.status !== 'PUSHED') {
      setPushLoginStatus(false)
      onCancelLogin()
    }
  }

  useEffect(() => {
    if (!pushCodeId) {
      return
    }

    timer.current = setInterval(onPushLogin, 1000)

    return () => {
      clearTimer()
    }
  }, [
    pushCodeId,
    checkPushCodeStatus,
    getUserInfo,
    onLoginSuccess,
    onCancelLogin
  ])

  const loginStatusMap = {
    before: (
      <BeforeLogin
        defaultAccount={account}
        setAccount={setAccount}
        onPushSuccess={onPushSuccess}
        signinByPush={signinByPush}
        pushLoginStatus={pushLoginStatus}
        onchangePushLoginStatus={onchangePushLoginStatus}
        agreements={agreements}
      />
    ),
    pending: <PendingLogin onCancelLogin={onCancelLogin} />
  }

  return <div>{loginStatusMap[loginStatus]}</div>
}
