import { guard } from '../common/authing-guard'

export default function Jump() {
  const onLogin = () => guard.startWithRedirect()

  const checkLoginStatus = async () => {
    const loginStatus = await guard.checkLoginStatus()
    console.log('loginStatus: ', loginStatus)
  }

  return (
    <div>
      <button onClick={onLogin}>登录</button>
      <button onClick={checkLoginStatus}>checkLoginStatus</button>
    </div>
  )
}
