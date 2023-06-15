import { getFacePlugin } from '../../_utils/facePlugin'

let inputSize = 512
let scoreThreshold = 0.5

export const devicesConstraints = {
  video: {
    width: 210,
    height: 210
  }
}
export const FACE_SCORE = 0.65

export function getFaceDetectorOptions() {
  const facePlugin = getFacePlugin()

  if (facePlugin) {
    const { TinyFaceDetectorOptions } = facePlugin
    return new TinyFaceDetectorOptions({ inputSize, scoreThreshold })
  }
}

export function getCurrentFaceDetectionNet() {
  const facePlugin = getFacePlugin()

  if (facePlugin) {
    const { nets } = facePlugin

    return nets.tinyFaceDetector
  }
}

export function isFaceDetectionModelLoaded() {
  return !!getCurrentFaceDetectionNet().params
}

export function dataURItoBlob(base64Data: any) {
  let byteString
  if (base64Data.split(',')[0].indexOf('base64') >= 0)
    byteString = atob(base64Data.split(',')[1])
  else byteString = unescape(base64Data.split(',')[1])
  let mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0]
  let ia = new Uint8Array(byteString.length)
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }
  return new Blob([ia], { type: mimeString })
}
