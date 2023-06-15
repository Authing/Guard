import { React } from 'shim-react'

import { GuardModuleType, IG2FCProps } from '..'

import { GuardCore } from '../Guard/core'

export function SingleComponent<T extends IG2FCProps>(
  props: T,
  guardModuleType: GuardModuleType,
  initData?: any
): JSX.Element {
  return (
    <GuardCore
      guardProps={props}
      initState={{
        moduleName: guardModuleType,
        initData
      }}
    />
  )
}
