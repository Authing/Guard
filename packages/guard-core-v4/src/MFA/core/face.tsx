import { React } from 'shim-react'

import { useTranslation } from 'react-i18next'

import SubmitButton from '../../SubmitButton'

import { message } from 'shim-antd'

import { useGuardHttp } from '../../_utils/guardHttp'

import {
  FACE_SCORE,
  devicesConstraints,
  dataURItoBlob,
  getCurrentFaceDetectionNet,
  getFaceDetectorOptions,
  isFaceDetectionModelLoaded
} from './face_deps'

import { ImagePro } from '../../ImagePro'

import { faceErrorMessage } from '../../_utils/errorFace'

import { MFABackStateContext } from '../context'

import { getFacePlugin } from '../../_utils/facePlugin'

import {
  useGuardButtonState,
  useGuardPublicConfig,
  useGuardAppId
} from '../../_utils/context'

import { MfaBusinessAction, useMfaBusinessRequest } from '../businessRequest'

import { AwsFaceLivenessDetector } from './AwsFaceLivenessDetector'

const { useEffect, useState } = React

// AWS liveness session response.
interface LivenessSessionResponse {
  sessionId: string
  region: string
  expireTime?: number
  credentials?: {
    AccessKeyId: string
    SecretAccessKey: string
    SessionToken: string
    Expiration?: Date
  }
}

// AWS liveness result.
interface LivenessResult {
  isLive: boolean
  confidence: number
  status: string
  sessionId?: string
  message?: string
}

// TODO: Remove this bypass after the liveness backend returns stable results.
const livenessPassThroughForTest = false

const faceRetryApiCodes = [1700, 1701, 1702, 502]

const shouldRetryFaceRequest = (result?: any) => {
  if (!result) return true

  return (
    faceRetryApiCodes.includes(result.apiCode) ||
    faceRetryApiCodes.includes(result.code) ||
    result.statusCode === 502 ||
    result.code === -1 ||
    result.code === -2
  )
}

// Serialize the whole error object for reporting.
// Error's message/name are non-enumerable, plain JSON.stringify would output "{}".
const stringifyError = (error: any): string => {
  if (!error) return ''
  if (typeof error === 'string') return error
  try {
    return JSON.stringify(error, Object.getOwnPropertyNames(error))
  } catch {
    return String(error)
  }
}

/**
 * After liveness passes, continue with the original face photo flow.
 */
const FacePhotoMfa: React.FC<any & { autoStart?: boolean }> = (props: any) => {
  const { autoStart } = props
  const mfaBackContext = React.useContext(MFABackStateContext)

  const { postForm } = useGuardHttp()
  const { t } = useTranslation()

  const [faceState, setFaceState] = React.useState('ready')
  const [percent, setPercent] = React.useState(0)

  const mfaBusinessRequest = useMfaBusinessRequest()
  const { spinChange } = useGuardButtonState()

  const verifyRequest = mfaBusinessRequest[MfaBusinessAction.VerifyFace]
  const bindRequest = mfaBusinessRequest[MfaBusinessAction.AssociateFace]

  const videoRef = React.useRef<HTMLVideoElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const interval = React.useRef<NodeJS.Timeout | undefined>()
  const p1 = React.useRef<string>()
  const p2 = React.useRef<string>()
  const cooldown = React.useRef<number>(0)
  const hasUploadedOnceRef = React.useRef(false)

  const publicConfig = useGuardPublicConfig()
  const cdnBase = publicConfig?.cdnBase

  const useDashoffset = (percent: number) => {
    const offset = percent * 7
    const dashStyle: any = {}
    return { offset, dashStyle }
  }

  const { offset, dashStyle } = useDashoffset(percent)

  const _FACE_SCORE = publicConfig?.mfa?.faceScore ?? FACE_SCORE

  const stopAutoShoot = () => {
    if (interval.current) {
      clearInterval(interval.current)
      interval.current = undefined
    }
  }

  const resetFaceToRetry = () => {
    stopAutoShoot()
    p1.current = undefined
    p2.current = undefined
    cooldown.current = 0
    hasUploadedOnceRef.current = false
    setFaceState('retry')
  }

  // Load the model and start the camera while identifying.
  React.useEffect(() => {
    if (faceState !== 'identifying') {
      return
    }

    const currentProtocol = window.location.protocol
    const cdnBaseWithProtocol =
      cdnBase.startsWith('http://') || cdnBase.startsWith('https://')
        ? cdnBase
        : `${currentProtocol}${cdnBase}`

    const faceDetectionNet = getCurrentFaceDetectionNet()
    if (faceDetectionNet?.loadFromUri) {
      Promise.resolve(
        faceDetectionNet.loadFromUri(
          `${cdnBaseWithProtocol}/face-api/v1/tiny_face_detector_model-weights_manifest.json`
        )
      ).catch(() => undefined)
    }

    const devicesContext =
      navigator.mediaDevices.getUserMedia(devicesConstraints)
    devicesContext
      .then(stream => {
        if (videoRef.current) videoRef.current.srcObject = stream
      })
      .catch(e => {
        const msg = faceErrorMessage(e)
        message.error(t(msg))
      })

    return () => {
      interval.current && clearInterval(interval.current)
    }
  }, [faceState, interval, props.config, cdnBase, t])

  // Hide MFA method switching while the face flow is checking.
  React.useEffect(() => {
    if (mfaBackContext?.mfaBackState === 'check') {
      props.setShowMethods(false)
    } else {
      props.setShowMethods(true)
    }
  }, [mfaBackContext?.mfaBackState, props])

  const uploadImage = async (blob: Blob) => {
    spinChange(true)
    try {
      const formData = new FormData()
      formData.append('folder', 'photos')
      formData.append('file', blob, 'personal.jpeg')

      const url = '/api/v2/upload?folder=photos&private=true'
      const result = await postForm<any>(url, formData)

      const key = result?.data?.key
      const uploadedUrl = result?.data?.url
      const value = key ?? uploadedUrl

      if (!value) {
        message.error(
          result?.data?.message || t('common.faceLiveness.photoUploadFailed')
        )
      }

      return value
    } finally {
      spinChange(false)
    }
  }

  const getBase64 = (videoDom: any) => {
    const canvas = canvasRef.current!
    const ctx = canvas!.getContext('2d')!
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(videoDom, 0, 0, canvas.width, canvas.height)
    const base64Data = canvas.toDataURL('image/jpeg', 1.0)
    return base64Data
  }

  const faceBind = async () => {
    const p1Val = p1.current
    const p2Val = p2.current
    const isExternalPhoto =
      typeof p1Val === 'string' &&
      typeof p2Val === 'string' &&
      /^https?:\/\//.test(p1Val) &&
      /^https?:\/\//.test(p2Val)

    const requestData = {
      photoA: p1Val!,
      photoB: p2Val!,
      isExternalPhoto,
      mfaToken: props.initData.mfaToken
    }
    try {
      const result = await bindRequest(requestData)

      const { isFlowEnd, onGuardHandling, data } = result

      if (isFlowEnd) {
        props.mfaLogin(200, data)
      } else {
        if (shouldRetryFaceRequest(result)) {
          resetFaceToRetry()
        } else if (onGuardHandling) {
          onGuardHandling()
        } else {
          resetFaceToRetry()
        }
      }
    } catch (e: any) {
      resetFaceToRetry()
      message.error(e?.message || t('common.faceLiveness.photoUploadFailed'))
    }
  }

  const faceCheck = async () => {
    const requestData = {
      photo: p1.current!,
      mfaToken: props.initData.mfaToken
    }

    spinChange(true)
    try {
      const result = await verifyRequest(requestData)

      const { isFlowEnd, onGuardHandling, data } = result

      if (isFlowEnd) {
        props.mfaLogin(200, data)
      } else {
        if (shouldRetryFaceRequest(result)) {
          resetFaceToRetry()
        } else if (onGuardHandling) {
          onGuardHandling()
        } else {
          resetFaceToRetry()
        }
      }
    } catch (e: any) {
      resetFaceToRetry()
      message.error(e?.message || t('common.faceLiveness.photoUploadFailed'))
    } finally {
      spinChange(false)
    }
  }

  const goToBindScene = (key: string) => {
    if (!p1.current) {
      p1.current = key
      return false
    } else {
      if (cooldown.current > 0) {
        cooldown.current -= 1
      }
      if (cooldown.current <= 0) {
        p2.current = key
        stopAutoShoot()
        faceBind()
        return true
      }
    }

    return false
  }

  const goToCheckScene = (key: string) => {
    p1.current = key
    stopAutoShoot()
    faceCheck()
  }

  const quitIdentifying = (blob: Blob) => {
    setPercent(100)
    uploadImage(blob)
      .then((key: string) => {
        if (!key) {
          stopAutoShoot()
          hasUploadedOnceRef.current = false
          setFaceState('retry')
          return
        }

        if (props.initData?.faceMfaEnabled === true) {
          goToCheckScene(key)
        } else {
          const isBindSubmitted = goToBindScene(key)
          if (!isBindSubmitted) {
            hasUploadedOnceRef.current = false
          }
        }
      })
      .catch(e => {
        stopAutoShoot()
        hasUploadedOnceRef.current = false
        setFaceState('retry')
        message.error(e?.message || t('common.faceLiveness.photoUploadFailed'))
      })
  }

  const shootCurrentFrame = (videoDom: HTMLVideoElement) => {
    if (hasUploadedOnceRef.current) return

    hasUploadedOnceRef.current = true
    try {
      const base64Data = getBase64(videoDom)
      const blob = dataURItoBlob(base64Data)
      quitIdentifying(blob)
    } catch (e: any) {
      hasUploadedOnceRef.current = false
      message.error(e?.message || t('common.faceLiveness.photoUploadFailed'))
    }
  }

  const isVideoReady = (videoDom?: HTMLVideoElement | null) => {
    if (!videoDom) {
      return false
    }

    return !videoDom.paused && !videoDom.ended && videoDom.readyState >= 2
  }

  const runFaceDetect = async (videoDom: HTMLVideoElement) => {
    const options = getFaceDetectorOptions()
    const facePlugin = getFacePlugin()

    console.log(facePlugin, 'facePluginfacePlugin dft')
    if (!facePlugin) return

    const { detectSingleFace } = facePlugin

    try {
      const result = await detectSingleFace(videoDom, options)

      if (result) {
        if (result.score > _FACE_SCORE) {
          shootCurrentFrame(videoDom)
        } else {
          setPercent(() => {
            return (result.score / _FACE_SCORE) * 100
          })
        }
      } else {
        setPercent(10)
      }
    } catch {
      shootCurrentFrame(videoDom)
    }
  }

  const autoShoot = React.useCallback(async () => {
    if (!interval.current) {
      interval.current = setInterval(() => autoShoot(), 500)
    }

    const videoDom = videoRef.current!
    if (!isVideoReady(videoDom)) {
      return
    }

    if (hasUploadedOnceRef.current) return

    shootCurrentFrame(videoDom)

    // if (!isFaceDetectionModelLoaded()) {
    //   return
    // }

    // await runFaceDetect(videoDom)
  }, [])

  // Auto-start the original face photo flow after liveness passes.
  React.useEffect(() => {
    if (!autoStart) return
    if (faceState !== 'ready') return

    if (navigator.mediaDevices) {
      setPercent(0)
      setFaceState('identifying')
      mfaBackContext?.setMfaBackState && mfaBackContext.setMfaBackState('check')
      autoShoot()
    } else {
      message.error(t('login.mediaDevicesSupport'))
    }
  }, [autoStart, faceState, mfaBackContext, autoShoot, t])

  return (
    <div className="g2-mfa-face-liveness">
      <h3 className="authing-g2-mfa-title">{t('common.mfaCertification')}</h3>
      {faceState === 'ready' || mfaBackContext?.mfaBackState === 'login' ? (
        <>
          <p className="authing-g2-mfa-tips">
            {props.initData?.faceMfaEnabled
              ? t('common.faceCheck')
              : t('common.faceText2')}
          </p>
          <ImagePro
            className="g2-mfa-face-image"
            width={247}
            height={131}
            src={`${cdnBase}/face.png`}
            alt=""
          />

          <SubmitButton
            onClick={() => {
              if (navigator.mediaDevices) {
                setFaceState('identifying')
                mfaBackContext?.setMfaBackState &&
                  mfaBackContext.setMfaBackState('check')
                autoShoot()
              } else {
                message.error(t('login.mediaDevicesSupport'))
              }
            }}
            text={t('common.faceText3') as string}
            className="mfa-face"
          />
        </>
      ) : (
        <p className="authing-g2-mfa-tips">{t('common.faceCheck')}</p>
      )}

      <div
        className="g2-mfa-face-identifying"
        style={{
          display:
            faceState !== 'ready' && mfaBackContext?.mfaBackState !== 'login'
              ? 'flex'
              : 'none'
        }}
      >
        <video
          className="video-round"
          ref={videoRef}
          style={{ transform: 'rotateY(180deg)' }}
          id="inputVideo"
          autoPlay
          muted
          playsInline
        />
        <div
          className="video-round mesh"
          style={{
            display: faceState === 'retry' ? 'flex' : 'none'
          }}
          onClick={() => {
            setFaceState('identifying')
            setPercent(0)
            hasUploadedOnceRef.current = false
            autoShoot()
          }}
        >
          {t('common.faceText4')}
        </div>

        <div className="video-round ring">
          <svg width={240} height={240} fill="none">
            <circle
              className="svg-circle-running"
              style={dashStyle}
              strokeDasharray={700}
              strokeDashoffset={700 - offset}
              cx={120}
              cy={120}
              r={110}
            />
          </svg>
        </div>
      </div>

      <canvas
        style={{
          width: 210,
          height: 210,
          opacity: 0,
          position: 'absolute',
          display: 'none'
        }}
        ref={canvasRef}
      />
    </div>
  )
}

export const MFAFace = (props: any) => {
  let { t } = useTranslation()
  const { setShowMethods } = props

  const mfaBackContext = React.useContext(MFABackStateContext)

  const publicConfig = useGuardPublicConfig()
  const cdnBase = publicConfig?.cdnBase
  const mfaBusinessRequest = useMfaBusinessRequest()

  const { spinChange } = useGuardButtonState()
  const { post } = useGuardHttp()
  const appId = useGuardAppId()

  const [isFacePhotoPhase, setIsFacePhotoPhase] = useState(false)

  // AWS liveness requests.
  const getLivenessSessionRequest =
    mfaBusinessRequest[MfaBusinessAction.GetFaceLivenessSession]
  const getLivenessResultRequest =
    mfaBusinessRequest[MfaBusinessAction.GetFaceLivenessResult]

  const [livenessSessionId, setLivenessSessionId] = useState<string | null>(
    null
  )
  const [livenessRegion, setLivenessRegion] = useState<string>('')
  const [livenessCredentials, setLivenessCredentials] = useState<{
    accessKeyId: string
    secretAccessKey: string
    sessionToken: string
  } | null>(null)
  const [isLoadingSession, setIsLoadingSession] = useState(false)
  const [livenessResult, setLivenessResult] = useState<LivenessResult | null>(
    null
  )

  // Create the session only after the user starts verification.
  const [livenessStarted, setLivenessStarted] = useState(false)

  useEffect(() => {
    if (!livenessStarted) return
    createLivenessSession()
  }, [livenessStarted])

  useEffect(() => {
    if (mfaBackContext?.mfaBackState !== 'login') return

    setShowMethods(true)
    setIsFacePhotoPhase(false)
    setLivenessStarted(false)
    setLivenessSessionId(null)
    setLivenessCredentials(null)
    setLivenessResult(null)
    setIsLoadingSession(false)
  }, [mfaBackContext?.mfaBackState, setShowMethods])

  useEffect(() => {
    if (livenessStarted || isFacePhotoPhase) {
      setShowMethods(false)
    }
  }, [isFacePhotoPhase, livenessStarted, setShowMethods])

  useEffect(() => {
    return () => {
      setShowMethods(true)
    }
  }, [setShowMethods])

  const startLivenessCheck = () => {
    setIsFacePhotoPhase(false)
    setLivenessStarted(true)
    setShowMethods(false)
    mfaBackContext?.setMfaBackState && mfaBackContext.setMfaBackState('check')
  }

  const createLivenessSession = async () => {
    setIsLoadingSession(true)
    setLivenessResult(null)
    setLivenessSessionId(null)
    setLivenessCredentials(null)

    try {
      const result = await getLivenessSessionRequest({
        mfaToken: props.initData.mfaToken
      })

      const responseData = result.data || result

      const sessionData: LivenessSessionResponse = responseData

      setLivenessSessionId(sessionData.sessionId)
      setLivenessRegion(sessionData.region)

      if (sessionData.credentials) {
        setLivenessCredentials({
          accessKeyId: sessionData.credentials.AccessKeyId,
          secretAccessKey: sessionData.credentials.SecretAccessKey,
          sessionToken: sessionData.credentials.SessionToken
        })
      }
    } catch (e: any) {
      message.error(e.message || t('common.faceLiveness.createSessionFailed'))
    }

    setIsLoadingSession(false)
  }

  const fetchLivenessResult = async () => {
    if (!livenessSessionId) {
      return
    }

    spinChange(true)
    try {
      const result = await getLivenessResultRequest({
        sessionId: livenessSessionId,
        mfaToken: props.initData.mfaToken
      })

      const responseData = result.data || result

      const livenessData: LivenessResult = responseData
      setLivenessResult(livenessData)

      if (livenessData.isLive) {
        setIsFacePhotoPhase(true)
      } else {
        if (livenessPassThroughForTest) {
          setIsFacePhotoPhase(true)
          message.error(
            livenessData.message || t('common.faceLiveness.failedBypassed')
          )
        } else {
          setIsFacePhotoPhase(false)
          message.error(livenessData.message || t('common.faceLiveness.failed'))
        }
      }
    } catch (e: any) {
      message.error(e.message || t('common.faceLiveness.fetchResultFailed'))
    }

    spinChange(false)
  }

  const handleLivenessAnalysisComplete = async () => {
    await fetchLivenessResult()
  }

  // Report bg liveness detection errors to /trackevent.
  // Fire-and-forget: reporting failures must not affect the main flow.
  const reportLivenessErrorEvent = (error: any) => {
    const userPoolId = publicConfig?.userPoolId
    if (!userPoolId) return

    post('/trackevent', {
      event: 'bg_face_liveness_error',
      userPoolId,
      ua: navigator.userAgent,
      profile: {
        // bg 活体检测标识
        source: 'bg',
        module: 'faceLiveness',
        appId,
        errorName: error?.name,
        errorMessage: error?.message,
        errorCode: error?.code,
        error: stringifyError(error),
        sessionId: livenessSessionId ?? undefined
      }
    }).catch(() => undefined)
  }

  const handleLivenessError = async (error: any) => {
    reportLivenessErrorEvent(error)
    message.error(error.message || t('common.faceLiveness.analysisError'))
    setLivenessSessionId(null)
    setIsFacePhotoPhase(false)
  }

  if (isFacePhotoPhase) {
    return <FacePhotoMfa {...props} autoStart />
  }

  const renderAwsLivenessDetector = () => {
    if (isLoadingSession) {
      return (
        <div
          style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}
        >
          <div className="authing-g2-loading">
            {t('common.faceLiveness.loading')}
          </div>
        </div>
      )
    }

    if (!livenessSessionId) {
      return (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>{t('common.faceLiveness.sessionUnavailable')}</p>
          <SubmitButton
            onClick={createLivenessSession}
            text={t('common.faceLiveness.retry') as string}
            className="mfa-face"
          />
        </div>
      )
    }

    return (
      <AwsFaceLivenessDetector
        sessionId={livenessSessionId || ''}
        region={livenessRegion}
        onAnalysisComplete={handleLivenessAnalysisComplete}
        onError={handleLivenessError}
        credentials={livenessCredentials || undefined}
      />
    )
  }

  const renderResult = () => {
    if (!livenessResult) return null

    return (
      <div className="g2-mfa-face-result">
        <p className="authing-g2-mfa-tips">
          {t('common.faceLiveness.confidence')}:{' '}
          {livenessResult.confidence?.toFixed?.(2) || 0}%
        </p>
        {livenessResult.message && (
          <p className="authing-g2-mfa-tips">{livenessResult.message}</p>
        )}
        <SubmitButton
          onClick={() => {
            setLivenessResult(null)
            setIsFacePhotoPhase(false)
            startLivenessCheck()
            createLivenessSession()
          }}
          text={t('common.faceLiveness.redetect') as string}
          className="mfa-face"
        />
      </div>
    )
  }

  return (
    <div className="g2-mfa-face-liveness">
      <h3 className="authing-g2-mfa-title">{t('common.mfaCertification')}</h3>

      {livenessResult && renderResult()}

      {!livenessResult && !livenessStarted && (
        <>
          <p className="authing-g2-mfa-tips">{t('common.faceCheck')}</p>
          <ImagePro
            className="g2-mfa-face-image"
            width={247}
            height={131}
            src={`${cdnBase}/face.png`}
            alt=""
          />

          <SubmitButton
            onClick={() => {
              startLivenessCheck()
            }}
            text={t('common.faceText3') as string}
            className="mfa-face"
          />
        </>
      )}

      {!livenessResult && livenessStarted && (
        <>
          <p className="authing-g2-mfa-tips">
            {props.initData?.faceMfaEnabled
              ? t('common.faceLiveness.verifyTip')
              : t('common.faceLiveness.bindTip')}
          </p>
          {renderAwsLivenessDetector()}
        </>
      )}
    </div>
  )
}
