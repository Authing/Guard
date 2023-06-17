import { GuardModuleType } from '../../Guard/module'

import { useGuardModule } from '../context'

import { FacePlugin } from './interface'

let facePluginInstance: FacePlugin

export const getFacePlugin = () => {
  if (!facePluginInstance) {
    return undefined
  }

  return facePluginInstance
}

export const useFacePlugin = () => {
  const { changeModule } = useGuardModule()

  if (!facePluginInstance) {
    changeModule?.(GuardModuleType.ERROR, {
      error: new Error('为使用 face 模块，请先安装 face-api-guard 插件')
    })

    return undefined
  }

  return facePluginInstance
}

export const initFacePlugin = (facePlugin: FacePlugin) => {
  facePluginInstance = facePlugin

  return facePluginInstance
}
