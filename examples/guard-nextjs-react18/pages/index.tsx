import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { guard } from '../common/authing-guard'

export default function Home() {
  const router = useRouter()
  const toEmbed = () => router.push('/login')
  const toJump = () => router.push('/jump')

  useEffect(() => {
    guard.trackSession().then(userInfo => {
      console.log('userInfo in index trackSession: ', userInfo)
    })
  }, [])

  return (
    <div>
      <div style={{ marginBottom: '20px' }} onClick={toEmbed}>
        <button>嵌入模式</button>
      </div>
      <div>
        <button onClick={toJump}>跳转模式</button>
      </div>
    </div>
  )
}
