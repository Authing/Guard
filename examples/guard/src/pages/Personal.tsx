import React, { useEffect, useState } from 'react'

import { Guard } from '@authing/guard'

import { guardOptions } from '../config'

export default function Personal () {
  const [userInfo, setUserInfo] = useState('')

  const guard = new Guard(guardOptions)

  useEffect(() => {
    guard.trackSession().then(res => {
      console.log('trackSession res: ', res)
      setUserInfo(JSON.stringify(res, null, 2))
    })

    guard.getAuthClient().then(authClient => {
      console.log('authClient: ', authClient)
    })
  }, [])

  const onLogout = () => guard.logout()

  return <div>
    <div><button onClick={onLogout}>登出</button></div>
    {userInfo && <div>
      <div>用户信息：</div>
      <textarea cols={100} rows={30} defaultValue={userInfo}></textarea>
    </div>}
  </div>
}
