import React, { useState } from 'react'
import { useGuard, User } from '@authing/guard-react'

export default function Personal() {
  const [userInfo, setUserInfo] = useState('')

  const guard = useGuard()

  guard.trackSession().then((res: User | null) => {
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
