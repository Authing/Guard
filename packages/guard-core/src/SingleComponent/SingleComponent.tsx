import { React } from 'shim-react'

import { IG2FCProps } from '../Type'

import { GuardModuleType } from '../Guard/module'

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
