import { React } from 'shim-react'

import { GuardProps } from '../Guard'

import { ModuleState } from '../GuardModule/stateMachine'

import { RenderContext } from './renderContext'

import { RenderModule } from './renderModule'

import { useGuardPlugin } from './usePlugin'

export interface GuardCoreProps {
  guardProps: GuardProps
  initState: ModuleState
}

export const GuardCore = (props: GuardCoreProps) => {
  const { guardProps, initState } = props

  useGuardPlugin(guardProps)

  return (
    <RenderContext guardProps={guardProps} initState={initState}>
      <RenderModule guardProps={guardProps} />
    </RenderContext>
  )
}
