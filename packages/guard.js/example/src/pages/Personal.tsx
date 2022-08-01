import React, { useState } from 'react'

import { Guard } from '../../../components'

export default function Personal () {
  const [userInfo, setUserInfo] = useState('')

  const guard = new Guard({
    appId: '62e22721c889dd44bad1dda2',
    host: 'https://guard-test-2022.authing.cn',
    redirectUri: 'http://localhost:3000/callback'
  })
  
  guard.trackSession().then(res => {
    console.log('trackSession res: ', res)
    setUserInfo(JSON.stringify(res, null, 2))
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
