import React, { useEffect, useState } from 'react'

// ============================================
// AWS 活体检测组件
// ============================================
// 注意：@aws-amplify/ui-react-liveness 已打包进 bundle
// 这样可以避免使用方遇到 chunk 加载问题
// ============================================

import {
  FaceLivenessDetectorCore,
  AwsCredentialProvider
} from '@aws-amplify/ui-react-liveness'

import { ThemeProvider } from '@aws-amplify/ui-react'

import '@aws-amplify/ui-react/styles.css'

// 覆盖 AWS 活体检测组件默认样式，移除上方空白
const overrideStyles = `
  .authing-aws-face-liveness {
    --authing-liveness-face-size: min(68vw, 300px);
  }

  /* 移除 liveness-detector-check 的 gap */
  .authing-aws-face-liveness .liveness-detector-check.amplify-flex {
    gap: 0 !important;
    align-items: center !important;
  }
  /* 隐藏 start screen warning，它不占用空间 */
  .authing-aws-face-liveness .amplify-liveness-start-screen-warning {
    display: none !important;
  }
  /* 针对 visibility: hidden 的元素 */
  .authing-aws-face-liveness div[style*="visibility: hidden"] {
    height: 0 !important;
    min-height: 0 !important;
    overflow: hidden !important;
  }
  /* 将 AWS 默认的矩形相机模块收成圆形取景区域 */
  .authing-aws-face-liveness .amplify-liveness-camera-module {
    width: var(--authing-liveness-face-size) !important;
    height: var(--authing-liveness-face-size) !important;
    min-height: var(--authing-liveness-face-size) !important;
    border: 0 !important;
    border-radius: 50% !important;
    background: transparent !important;
    overflow: visible !important;
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
  /* 隐藏 AWS 默认椭圆遮罩，避免把圆形视频再次裁成竖向椭圆 */
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
  /* 调整椭圆框（instruction overlay）位置和大小 */
  .authing-aws-face-liveness .amplify-liveness-instruction-overlay {
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    height: 100% !important;
    min-height: auto !important;
    margin: 0 !important;
  }
  /* 调整相机模块容器，确保没有多余间距 */
  .authing-aws-face-liveness .amplify-liveness-camera-module {
    gap: 0 !important;
    margin-top: 0 !important;
    padding-top: 0 !important;
  }

  @media (max-width: 420px) {
    .authing-aws-face-liveness {
      --authing-liveness-face-size: min(76vw, 300px);
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

/**
 * AWS Face Liveness 检测组件
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
  const [isLoaded, setIsLoaded] = useState(false)
  const [error] = useState<string | null>(null)

  useEffect(() => {
    // 组件挂载后标记为已加载
    setIsLoaded(true)
  }, [])

  // 凭证提供者
  const credentialProvider: AwsCredentialProvider = async () => {
    if (credentials && credentials.accessKeyId) {
      return {
        accessKeyId: credentials.accessKeyId,
        secretAccessKey: credentials.secretAccessKey,
        sessionToken: credentials.sessionToken
      }
    }
    // 如果没有提供凭证，返回空对象让组件使用默认方式
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
          刷新重试
        </button>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div
        style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}
      >
        <div className="authing-g2-loading">加载中...</div>
      </div>
    )
  }

  // 包装 onAnalysisComplete 以符合 AWS 组件类型要求
  const handleAnalysisComplete = async (completeInfo: any): Promise<void> => {
    if (onAnalysisComplete) {
      await Promise.resolve(onAnalysisComplete(completeInfo))
    }
  }

  // 包装 onError 以符合 AWS 组件类型要求
  const handleError = (error: any): void => {
    onError?.(error)
  }

  return (
    <ThemeProvider>
      <style>{overrideStyles}</style>
      <div
        className="authing-aws-face-liveness"
        style={{ width: '100%', maxWidth: 480, margin: '0 auto' }}
      >
        <FaceLivenessDetectorCore
          sessionId={sessionId}
          region={region}
          onAnalysisComplete={handleAnalysisComplete}
          onError={handleError}
          config={{
            credentialProvider
          }}
        />
      </div>
    </ThemeProvider>
  )
}

export default AwsFaceLivenessDetector
