import React, { useEffect, useState } from 'react'
import { AuthenticationClient, useGuard, User } from '@authing/guard-react18'

export default function Personal() {
  const [userInfo, setUserInfo] = useState('')

  const guard = useGuard()

  useEffect(() => {
    guard.trackSession().then((res: User | null) => {
      console.log('trackSession res: ', res)
      setUserInfo(JSON.stringify(res, null, 2))
    })
  }, [])

  const onLogout = () => guard.logout()

  const updateProfile = async () => {
    const authenticationClient: AuthenticationClient = await guard.getAuthClient()

    // 获取到 AuthenticationClient 实例之后，可以调用其提供的所有方法
    // 比如更新用户昵称
    const userProfile: User = await authenticationClient.updateProfile({
      nickname: 'Nick'
    })

    console.log('userProfile: ', userProfile)

    // 更多 AuthenticationClient 的方法，请见 authing-js-sdk 文档介绍。
  }

  return (
    <div>
      <div>
        <button className='authing-button' onClick={onLogout}>登出</button>
        <button className='authing-button' onClick={updateProfile}>Update Profile</button>
      </div>
      {userInfo && (
        <div>
          <div>用户信息：</div>
          <textarea cols={100} rows={30} defaultValue={userInfo}></textarea>
        </div>
      )}
    </div>
  )
}
