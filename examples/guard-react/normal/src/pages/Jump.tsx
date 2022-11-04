import React from 'react'
import { useGuard } from '@authing/guard-react'

export default function Jump() {
  const guard = useGuard()

  const startWithRedirect = () => guard.startWithRedirect({
    state: 'some-random-string'
  })

  return (
    <div>
      <div>
        <button className='authing-button' onClick={startWithRedirect}>Start With Redirect</button>
      </div>
    </div>
  )
}
