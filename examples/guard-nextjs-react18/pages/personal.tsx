import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { guard } from '../common/authing-guard'

export default function Personal() {
  const [userInfo, setUserInfo] = useState('')
  const router = useRouter()

  useEffect(() => {
    guard.trackSession().then(res => {
      console.log('trackSession res: ', res)
      setUserInfo(JSON.stringify(res || undefined, null, 2))
    })
  }, [])

  const onLogout = () => {
    guard.logout().then(() => {
      router.push('/')
    })
  }
  const onLogin = () => router.push('/')

  const onHello = () => {
    guard.getAuthClient().then(authClient => {
      const token = authClient.tokenProvider.getToken()

      fetch('/api/hello', {
        headers: {
          Authorization: token
        }
      })
        .then(res => res.json())
        .then(data => {
          alert(data.message)
        })
    })
  }

  const onHi = () => {
    guard.getAuthClient().then(authClient => {
      const token = authClient.tokenProvider.getToken()

      fetch('/api/hi', {
        headers: {
          Authorization: token
        }
      })
        .then(res => res.json())
        .then(data => {
          alert(data.message)
        })
    })
  }

  return (
    <div>
      {userInfo ? (
        <>
          <div>
            <button
              style={{
                marginRight: 12
              }}
              onClick={onLogout}
            >
              登出
            </button>
            <button
              style={{
                marginRight: 12
              }}
              onClick={onHello}
            >
              Hello
            </button>
            <button
              style={{
                marginRight: 12
              }}
              onClick={onHi}
            >
              Hi
            </button>
          </div>
          <div>
            <div>用户信息：</div>
            <textarea cols={100} rows={30} defaultValue={userInfo}></textarea>
          </div>
        </>
      ) : (
        <>
          <div style={{ marginBottom: 20 }}>未登录...</div>
          <button onClick={onLogin}>登录</button>
        </>
      )}
    </div>
  )
}
