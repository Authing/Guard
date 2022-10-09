import React from 'react'
import { useHistory } from 'react-router-dom'

export default function Home() {
  const history = useHistory()

  const toEmbed = () => history.push('/login')
  const toJump = () => history.push('/jump')

  return (
    <div>
      <div style={{ marginBottom: '20px' }} onClick={toEmbed}>
        <button>嵌入模式 - 普通形态</button>
      </div>
      <div>
        <button onClick={toJump}>托管模式</button>
      </div>
    </div>
  )
}
