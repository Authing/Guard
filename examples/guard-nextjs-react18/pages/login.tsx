import { useEffect } from 'react'
import '@authing/guard-react18/dist/esm/guard.min.css'
import { guard } from '../common/authing-guard'
import { useRouter } from 'next/router'

export default function Login() {
  const router = useRouter()
  const guardEffects = async () => {
    guard
      .start(document.querySelector('#authing-guard-container') as HTMLElement)
      .then(userInfo => {
        console.log('start userInfo: ', userInfo)
      })

    guard.on('load', e => {
      console.log('加载啊', e)
    })

    guard.on('login', userInfo => {
      console.log('userInfo: ', userInfo)
      // 登录成功，跳转到个人中心
      router.push('/personal')
    })
  }

  useEffect(() => {
    guardEffects()
  }, [])

  return (
    <div>
      <div id="authing-guard-container"></div>
    </div>
  )
}
