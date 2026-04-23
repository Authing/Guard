import React, { useEffect, useState } from 'react'

// ============================================
// AWS 活体检测组件
// ============================================
// 注意：@aws-amplify/ui-react-liveness 已打包进 bundle
// 这样可以避免使用方遇到 chunk 加载问题
// ============================================

// 配置 TensorFlow.js WASM 后端路径
import { setWasmPaths } from '@tensorflow/tfjs-backend-wasm'

// 使用 CDN 路径加载 WASM 文件（版本需与 ui-react-liveness 依赖一致）
setWasmPaths(
  'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@4.11.0/dist/'
)

import {
  FaceLivenessDetectorCore,
  AwsCredentialProvider
} from '@aws-amplify/ui-react-liveness'

import { ThemeProvider } from '@aws-amplify/ui-react'

import '@aws-amplify/ui-react/styles.css'

interface AwsFaceLivenessDetectorProps {
  sessionId: string
  region?: string
  onAnalysisComplete?: () => void | Promise<void>
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
  const handleAnalysisComplete = async (deviceInfo: any): Promise<void> => {
    console.log(deviceInfo, 'handleAnalysisComplete log')
    if (onAnalysisComplete) {
      await Promise.resolve(onAnalysisComplete())
    }
  }

  // 包装 onError 以符合 AWS 组件类型要求
  const handleError = (error: any): void => {
    onError?.(error)
  }

  return (
    <ThemeProvider>
      <div style={{ width: '100%', maxWidth: 480, margin: '0 auto' }}>
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
