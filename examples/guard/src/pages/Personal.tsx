import React, { useState } from 'react'

import { Guard } from '@authing/guard'

export default function Personal () {
  const [userInfo, setUserInfo] = useState('')

  const guard = new Guard({
    appId: '62e8d32e4feac0ba0a75edf5',
    host: 'https://ipehegkanbpgkdho-demo.authing.cn',
    // redirectUri: 'http://localhost:3000/callback'
  })

  guard.trackSession().then(res => {
    console.log('trackSession res: ', res)
    setUserInfo(JSON.stringify(res, null, 2))
  })

  const authClientPromise = guard.getAuthClient()

  authClientPromise.then(authClient => {
    console.log('authClient: ', authClient)
  })

  const onLogout = () => guard.logout()

  return <div>
    <div><button onClick={onLogout}>登出</button></div>
    {userInfo && <div>
      <div>用户信息：</div>
      <textarea cols={100} rows={30} defaultValue={userInfo}></textarea>
    </div>}
  </div>
}
