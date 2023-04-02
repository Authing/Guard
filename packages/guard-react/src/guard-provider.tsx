import React, { useState, ComponentProps, JSXElementConstructor } from 'react'

import { Guard, GuardOptions } from '@authing/guard-shim-react'

import { GuardContext } from './guard-context'

type Options = GuardOptions & ComponentProps<JSXElementConstructor<any>>

export function GuardProvider(options: Options) {
  const { children, ...guardOptions } = options

  const _guard = new Guard(guardOptions)

  const [guard] = useState(_guard)

  return <GuardContext.Provider value={guard}>{children}</GuardContext.Provider>
}