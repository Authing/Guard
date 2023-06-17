import { initFacePlugin } from '../../_utils/facePlugin'

import { FacePlugin } from '../../_utils/facePlugin/interface'

import isEqual from 'lodash/isEqual'

export const useGuardPlugin: any = (plugin: { facePlugin?: FacePlugin }) => {
  const { facePlugin } = plugin

  return useGuardFacePlugin(facePlugin)
}

export const useGuardFacePlugin = (facePlugin?: FacePlugin) => {
  if (!facePlugin) return true

  const guardFace = initFacePlugin(facePlugin)

  return isEqual(guardFace, facePlugin)
}
