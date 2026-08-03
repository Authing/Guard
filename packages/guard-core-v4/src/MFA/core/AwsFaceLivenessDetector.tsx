import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

// ============================================
// AWS liveness detection component
// ============================================
// Note: @aws-amplify/ui-react-liveness is bundled to avoid chunk loading
// issues for consumers.
// ============================================

import {
  FaceLivenessDetectorCore,
  AwsCredentialProvider
} from '@aws-amplify/ui-react-liveness'
import type { FaceLivenessDetectorCoreProps } from '@aws-amplify/ui-react-liveness'

import { ThemeProvider } from '@aws-amplify/ui-react'

import '@aws-amplify/ui-react/styles.css'

// Override AWS liveness detector styles and remove the top whitespace.
const overrideStyles = `
  .authing-aws-face-liveness {
    --authing-liveness-face-size: min(100%, 300px);
    width: 100%;
    max-width: 100%;
    overflow: hidden;
    box-sizing: border-box;
  }

  .authing-aws-face-liveness *,
  .authing-aws-face-liveness *::before,
  .authing-aws-face-liveness *::after {
    box-sizing: border-box;
  }

  .authing-aws-face-liveness .liveness-detector,
  .authing-aws-face-liveness .liveness-detector-check {
    width: 100% !important;
    max-width: 100% !important;
  }

  /* Remove the liveness-detector-check gap. */
  .authing-aws-face-liveness .liveness-detector-check.amplify-flex {
    gap: 0 !important;
    align-items: center !important;
    justify-content: center !important;
  }
  /* Hide the start screen warning without occupying space. */
  .authing-aws-face-liveness .amplify-liveness-start-screen-warning {
    display: none !important;
  }
  /* Collapse elements hidden with visibility: hidden. */
  .authing-aws-face-liveness div[style*="visibility: hidden"] {
    height: 0 !important;
    min-height: 0 !important;
    overflow: hidden !important;
  }
  /* Turn the default rectangular AWS camera module into a circular viewport. */
  .authing-aws-face-liveness .amplify-liveness-camera-module {
    width: var(--authing-liveness-face-size) !important;
    height: var(--authing-liveness-face-size) !important;
    min-height: var(--authing-liveness-face-size) !important;
    border: 0 !important;
    border-radius: 50% !important;
    background: transparent !important;
    overflow: hidden !important;
    flex: 0 0 var(--authing-liveness-face-size) !important;
    margin: 0 auto !important;
  }

  /* AWS switches to a viewport-fixed camera on mobile user agents. Guard must
     keep that camera inside its own card instead of pinning it to the page. */
  .authing-aws-face-liveness .amplify-liveness-camera-module--mobile {
    position: relative !important;
    inset: auto !important;
    top: auto !important;
    right: auto !important;
    bottom: auto !important;
    left: auto !important;
    z-index: auto !important;
  }

  .authing-aws-face-liveness .amplify-liveness-oval-canvas--mobile {
    position: absolute !important;
    inset: 0 !important;
  }

  .authing-aws-face-liveness .amplify-liveness-hint--mobile {
    margin-top: 0 !important;
  }
  .authing-aws-face-liveness .amplify-liveness-video-anchor {
    width: 100% !important;
    height: 100% !important;
    aspect-ratio: 1 / 1 !important;
    border-radius: 50% !important;
    overflow: hidden !important;
    background: #f7f8fa !important;
  }
  .authing-aws-face-liveness .amplify-liveness-video {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
  }
  /* Hide the default AWS oval mask so the circular video is not clipped again. */
  .authing-aws-face-liveness .amplify-liveness-oval-canvas {
    opacity: 0 !important;
    pointer-events: none !important;
  }
  .authing-aws-face-liveness .amplify-liveness-freshness-canvas {
    position: absolute !important;
    inset: 0 !important;
    width: 100% !important;
    height: 100% !important;
    border-radius: 50% !important;
    pointer-events: none !important;
  }
  /* Align the instruction overlay with the circular viewport. */
  .authing-aws-face-liveness .amplify-liveness-instruction-overlay {
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    height: 100% !important;
    min-height: auto !important;
    margin: 0 !important;
    padding: 16px !important;
    overflow: hidden !important;
    display: block !important;
  }

  .authing-aws-face-liveness .amplify-liveness-hint {
    position: absolute !important;
    top: 16px !important;
    left: 50% !important;
    width: calc(100% - 96px) !important;
    max-width: calc(100% - 96px) !important;
    min-width: 0 !important;
    justify-content: center !important;
    transform: translateX(-50%) !important;
    z-index: 3 !important;
  }

  .authing-aws-face-liveness .amplify-liveness-hint__text,
  .authing-aws-face-liveness .amplify-liveness-toast,
  .authing-aws-face-liveness .amplify-liveness-toast__message {
    width: auto !important;
    max-width: 100% !important;
    min-width: 0 !important;
    white-space: normal !important;
    overflow-wrap: anywhere !important;
    text-align: center !important;
  }

  .authing-aws-face-liveness .amplify-liveness-toast {
    padding: 8px 12px !important;
    font-size: 14px !important;
    line-height: 20px !important;
  }

  .authing-aws-face-liveness .amplify-liveness-start-screen-camera-select,
  .authing-aws-face-liveness .amplify-liveness-start-screen-camera-select__container {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    justify-content: center !important;
  }

  .authing-aws-face-liveness .amplify-liveness-start-screen-camera-select__label {
    flex: 0 0 auto !important;
    white-space: nowrap !important;
  }

  .authing-aws-face-liveness #amplify-liveness-camera-select {
    width: auto !important;
    max-width: 190px !important;
    min-width: 0 !important;
  }

  .authing-aws-face-liveness .amplify-liveness-cancel-container {
    top: 12px !important;
    right: 12px !important;
  }

  .authing-aws-face-liveness .amplify-liveness-cancel-button {
    width: 36px !important;
    height: 36px !important;
    min-width: 36px !important;
    padding: 8px !important;
    color: #ffffff !important;
    background: rgba(0, 0, 0, 0.32) !important;
    border-radius: 50% !important;
  }

  .authing-aws-face-liveness .amplify-liveness-recording-icon-container {
    top: auto !important;
    bottom: 16px !important;
    left: 50% !important;
    transform: translateX(-50%) !important;
  }

  .authing-aws-face-liveness .amplify-liveness-match-indicator {
    position: absolute !important;
    top: 64px !important;
    left: 50% !important;
    width: calc(100% - 64px) !important;
    max-width: 220px !important;
    transform: translateX(-50%) !important;
  }

  /* Keep screen-reader-only status copy from entering the visual flex layout. */
  .authing-aws-face-liveness .amplify-visually-hidden {
    position: absolute !important;
    width: 1px !important;
    height: 1px !important;
    padding: 0 !important;
    margin: -1px !important;
    overflow: hidden !important;
    clip: rect(0, 0, 0, 0) !important;
    clip-path: inset(50%) !important;
    white-space: nowrap !important;
    border: 0 !important;
  }
  /* Remove extra spacing from the camera module container. */
  .authing-aws-face-liveness .amplify-liveness-camera-module {
    gap: 0 !important;
    margin-top: 0 !important;
    padding-top: 0 !important;
  }

  @media (max-width: 420px) {
    .authing-aws-face-liveness {
      --authing-liveness-face-size: min(100%, 280px);
    }
  }
`

interface AwsFaceLivenessDetectorProps {
  sessionId: string
  region?: string
  onAnalysisComplete?: (completeInfo?: any) => void | Promise<void>
  onError?: (error: any) => void
  credentials?: {
    accessKeyId: string
    secretAccessKey: string
    sessionToken: string
  }
}

type LivenessDisplayText = NonNullable<
  FaceLivenessDetectorCoreProps['displayText']
>

const livenessDisplayTextKeys: Array<keyof LivenessDisplayText> = [
  'cameraMinSpecificationsHeadingText',
  'cameraMinSpecificationsMessageText',
  'cameraNotFoundHeadingText',
  'cameraNotFoundMessageText',
  'a11yVideoLabelText',
  'cancelLivenessCheckText',
  'goodFitCaptionText',
  'goodFitAltText',
  'hintCenterFaceText',
  'hintCenterFaceInstructionText',
  'hintFaceOffCenterText',
  'hintMoveFaceFrontOfCameraText',
  'hintTooManyFacesText',
  'hintFaceDetectedText',
  'hintCanNotIdentifyText',
  'hintTooCloseText',
  'hintTooFarText',
  'hintConnectingText',
  'hintVerifyingText',
  'hintCheckCompleteText',
  'hintIlluminationTooBrightText',
  'hintIlluminationTooDarkText',
  'hintIlluminationNormalText',
  'hintHoldFaceForFreshnessText',
  'hintMatchIndicatorText',
  'photosensitivityWarningBodyText',
  'photosensitivityWarningHeadingText',
  'photosensitivityWarningInfoText',
  'photosensitivityWarningLabelText',
  'retryCameraPermissionsText',
  'recordingIndicatorText',
  'startScreenBeginCheckText',
  'tooFarCaptionText',
  'tooFarAltText',
  'waitingCameraPermissionText',
  'errorLabelText',
  'connectionTimeoutHeaderText',
  'connectionTimeoutMessageText',
  'timeoutHeaderText',
  'timeoutMessageText',
  'faceDistanceHeaderText',
  'faceDistanceMessageText',
  'multipleFacesHeaderText',
  'multipleFacesMessageText',
  'clientHeaderText',
  'clientMessageText',
  'serverHeaderText',
  'serverMessageText',
  'landscapeHeaderText',
  'landscapeMessageText',
  'portraitMessageText',
  'tryAgainText'
]

/**
 * AWS Face Liveness detector component.
 */
export const AwsFaceLivenessDetector: React.FC<
  AwsFaceLivenessDetectorProps
> = ({
  sessionId,
  region = 'us-east-1',
  onAnalysisComplete,
  onError,
  credentials
}) => {
  const { t } = useTranslation()
  const [isLoaded, setIsLoaded] = useState(false)
  const [error] = useState<string | null>(null)
  const detectorContainerRef = React.useRef<HTMLDivElement>(null)

  const displayText = useMemo<LivenessDisplayText>(() => {
    const translateDisplayText = (key: keyof LivenessDisplayText) =>
      t(`common.faceLiveness.displayText.${String(key)}`) as string

    return livenessDisplayTextKeys.reduce<LivenessDisplayText>(
      (result, key) => ({
        ...result,
        [key]: translateDisplayText(key)
      }),
      {}
    )
  }, [t])

  useEffect(() => {
    // Mark the component as loaded after mount.
    setIsLoaded(true)
  }, [])

  useLayoutEffect(() => {
    const container = detectorContainerRef.current
    if (!container) return

    const cameraLabel = t('common.faceLiveness.cameraLabel') as string
    const cameraSelectA11yLabel = t(
      'common.faceLiveness.cameraSelectA11yLabel'
    ) as string

    const syncCameraLabels = () => {
      container
        .querySelectorAll<HTMLLabelElement>(
          [
            'label[for="amplify-liveness-camera-select"]',
            '.amplify-liveness-start-screen-camera-select__label'
          ].join(',')
        )
        .forEach(label => {
          if (label.textContent !== cameraLabel) {
            label.textContent = cameraLabel
          }
        })

      const select = container.querySelector<HTMLSelectElement>(
        '#amplify-liveness-camera-select'
      )
      if (
        select &&
        select.getAttribute('aria-label') !== cameraSelectA11yLabel
      ) {
        select.setAttribute('aria-label', cameraSelectA11yLabel)
      }
    }

    syncCameraLabels()

    const observer = new MutationObserver(syncCameraLabels)
    observer.observe(container, {
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true
    })

    return () => observer.disconnect()
  }, [isLoaded, t])

  // Credential provider.
  const credentialProvider: AwsCredentialProvider = async () => {
    if (credentials && credentials.accessKeyId) {
      return {
        accessKeyId: credentials.accessKeyId,
        secretAccessKey: credentials.secretAccessKey,
        sessionToken: credentials.sessionToken
      }
    }
    // Return empty credentials when none are provided and let the component use its default behavior.
    return {
      accessKeyId: '',
      secretAccessKey: '',
      sessionToken: ''
    }
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: '#ff4d4f' }}>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: '1rem',
            padding: '0.4rem 1.2rem',
            fontSize: '0.9rem',
            cursor: 'pointer',
            borderRadius: 6,
            border: '1px solid #ccc',
            background: '#fff'
          }}
        >
          {t('common.faceLiveness.refreshRetry')}
        </button>
      </div>
    )
  }

  if (!isLoaded) {
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

  // Wrap onAnalysisComplete to match the AWS component type.
  const handleAnalysisComplete = async (completeInfo: any): Promise<void> => {
    if (onAnalysisComplete) {
      await Promise.resolve(onAnalysisComplete(completeInfo))
    }
  }

  // Wrap onError to match the AWS component type.
  const handleError = (error: any): void => {
    onError?.(error)
  }

  return (
    <ThemeProvider>
      <style>{overrideStyles}</style>
      <div
        ref={detectorContainerRef}
        className="authing-aws-face-liveness"
        style={{ width: '100%', maxWidth: '100%', margin: '0 auto' }}
      >
        <FaceLivenessDetectorCore
          sessionId={sessionId}
          region={region}
          onAnalysisComplete={handleAnalysisComplete}
          onError={handleError}
          displayText={displayText}
          config={{
            credentialProvider
          }}
        />
      </div>
    </ThemeProvider>
  )
}

export default AwsFaceLivenessDetector
