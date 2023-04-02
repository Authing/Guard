import React from 'react'
import { useHistory } from 'react-router-dom'

export default function Home() {
  const history = useHistory()

  const toEmbed = () => history.push('/embed')
  const toJump = () => history.push('/jump')

  return (
    <div>
      <div style={{ marginBottom: '20px' }} onClick={toEmbed}>
        <button className='authing-button'>嵌入模式 - 普通形态</button>
      </div>
      <div>
        <button className='authing-button' onClick={toJump}>托管模式</button>
      </div>
    </div>
  )
}
