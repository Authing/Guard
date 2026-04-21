import React, { useEffect, useState } from 'react'

// ============================================
// AWS 活体检测组件 - CDN 版本
// ============================================
// 为避免 TensorFlow.js 版本冲突，使用 CDN 动态加载 AWS 组件
//
// 需要在 index.html 中添加以下脚本:
// <script src="https://unpkg.com/@aws-amplify/ui-react-liveness@3.6.2/dist/index.js"></script>
// <script src="https://unpkg.com/@aws-amplify/ui-react@6.15.2/dist/index.js"></script>
// ============================================

interface AwsFaceLivenessDetectorProps {
  sessionId: string
  region?: string
  onAnalysisComplete?: () => void
  onError?: (error: any) => void
  credentials?: {
    accessKeyId: string
    secretAccessKey: string
    sessionToken: string
  }
}

// 全局类型声明
declare global {
  interface Window {
    AwsAmplifyUIReactLiveness?: any
    AwsAmplifyUIReact?: any
  }
}

/**
 * 加载 CDN 脚本
 */
const loadScript = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    // 检查脚本是否已加载
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = src
    script.crossOrigin = 'anonymous'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`Failed to load: ${src}`))
    document.head.appendChild(script)
  })
}

/**
 * AWS Face Liveness 检测组件 (CDN 版本)
 *
 * 使用 CDN 动态加载 AWS 组件，避免与 face-api.js 的 TensorFlow.js 版本冲突
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
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadAwsComponents = async () => {
      try {
        // 加载 AWS CDN 脚本
        await Promise.all([
          loadScript(
            'https://unpkg.com/@aws-amplify/ui-react-liveness@3.6.2/dist/index.js'
          ),
          loadScript(
            'https://unpkg.com/@aws-amplify/ui-react@6.15.2/dist/index.js'
          )
        ])

        // 等待组件注册到全局
        if (window.AwsAmplifyUIReactLiveness && window.AwsAmplifyUIReact) {
          setIsLoaded(true)
        } else {
          throw new Error('AWS 组件加载失败')
        }
      } catch (e: any) {
        console.error('Failed to load AWS components:', e)
        setError('无法加载 AWS 活体检测组件')
        onError?.(e)
      }
    }

    loadAwsComponents()
  }, [onError])

  // 凭证提供者
  const credentialProvider = async () => {
    if (credentials) {
      return credentials
    }
    throw new Error('AWS credentials not provided')
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
        <div className="authing-g2-loading">加载 AWS 组件中...</div>
      </div>
    )
  }

  // 使用全局变量渲染组件
  const { FaceLivenessDetectorCore } = window.AwsAmplifyUIReactLiveness
  const { ThemeProvider } = window.AwsAmplifyUIReact

  return (
    <ThemeProvider>
      <div style={{ width: '100%', maxWidth: 480, margin: '0 auto' }}>
        <FaceLivenessDetectorCore
          sessionId={sessionId}
          region={region}
          onAnalysisComplete={onAnalysisComplete}
          onError={onError}
          config={{
            credentialProvider: credentials ? credentialProvider : undefined
          }}
        />
      </div>
    </ThemeProvider>
  )
}

export default AwsFaceLivenessDetector
