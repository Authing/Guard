import React from 'react'

import '@authing/guard-shim-react/dist/guard.min.css'

import { Guard as GuardComponent, GuardProps } from '@authing/guard-shim-react'

export function Guard(props: GuardProps) {
  return <GuardComponent {...props}></GuardComponent>
}

export * from '@authing/guard-shim-react'
