import React from 'react'
import { useHistory } from 'react-router-dom'

export default function Home() {
  const history = useHistory()

  const toEmbed = () => history.push('/embed')

  return (
    <div>
      <div style={{ marginBottom: '20px' }} onClick={toEmbed}>
        <button>内嵌模式 - 模态框形态</button>
      </div>
    </div>
  )
}
