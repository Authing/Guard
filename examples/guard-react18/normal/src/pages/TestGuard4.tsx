import React from 'react'

// import { Guard } from '@authing/guard-shim-react18'

// import "@authing/guard-shim-react18/dist/esm/guard.min.css"

// export default function TestGuard4 () {
//   const guard = new Guard({
//     appId: '630ed3137dd6f2fd7001da24'
//   })

//   guard.start('#authing-guard-container')

//   console.log(1234)

//   return (
//     <div id="authing-guard-container"></div>
//   )
// }

import { useGuard } from '@authing/guard-react18'

import '@authing/guard-react18/dist/esm/guard.min.css'

export default function TestGuard4 () {
  const guard = useGuard()

  guard.start('#authing-guard-container').then(userInfo => {
    console.log('userInfo: ', userInfo)
  })

  return <>
    <div id="authing-guard-container"></div>
  </>
}