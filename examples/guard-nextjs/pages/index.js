import Head from 'next/head'

export default function Home () {
  const toEmbed = () => window.location.href = '/login'
  const toJump = () => window.location.href = '/jump'

  return <div>
    <div style={{marginBottom: '20px'}} onClick={toEmbed}><button>嵌入模式</button></div>
    <div><button onClick={toJump}>跳转模式</button></div>
  </div>
}

