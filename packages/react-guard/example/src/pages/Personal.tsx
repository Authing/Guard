import React, { useState } from 'react'
import { useAuthing } from '@authing/react-guard'

export default function Personal() {
  const [userInfo, setUserInfo] = useState('')

  const guard = useAuthing()

  guard.trackSession().then(res => {
    console.log('trackSession res: ', res)
    setUserInfo(JSON.stringify(res, null, 2))
  })

  const onLogout = () => guard.logout()

  return (
    <div>
      <div>
        <button onClick={onLogout}>登出</button>
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
