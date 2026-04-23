import { React } from 'shim-react'

import { useTranslation } from 'react-i18next'

import SubmitButton from '../../SubmitButton'

import { message } from 'shim-antd'

import { useGuardButtonState } from '../../_utils/context'

import { MfaBusinessAction, useMfaBusinessRequest } from '../businessRequest'

import { AwsFaceLivenessDetector } from './AwsFaceLivenessDetector'

const { useEffect, useState } = React

// ============================================
// AWS 活体检测 Session 响应
// ============================================
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

// ============================================
// AWS 活体检测结果
// ============================================
interface LivenessResult {
  isLive: boolean
  confidence: number
  status: string
  sessionId?: string
  message?: string
}

export const MFAFace = (props: any) => {
  let { t } = useTranslation()

  const mfaBusinessRequest = useMfaBusinessRequest()

  const { spinChange } = useGuardButtonState()

  // AWS 活体检测相关请求
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

  // 初始化时创建 session
  useEffect(() => {
    createLivenessSession()
  }, [])

  /**
   * 创建 AWS 活体检测 Session
   */
  const createLivenessSession = async () => {
    console.log(
      '[FaceLiveness] 开始创建 session, mfaToken:',
      props.initData.mfaToken
    )
    setIsLoadingSession(true)
    setLivenessResult(null)

    try {
      console.log('[FaceLiveness] 开始触发请求')
      const result = await getLivenessSessionRequest({
        mfaToken: props.initData.mfaToken
      })
      console.log('[FaceLiveness] 创建 session 响应:', result)

      // 适配后端返回格式：可能是 result.data 或直接在 result 上
      const responseData = result.data || result
      console.log('[FaceLiveness] 解析后的 responseData:', responseData)

      const sessionData: LivenessSessionResponse = responseData

      console.log('[FaceLiveness] sessionId:', sessionData.sessionId)
      console.log('[FaceLiveness] region:', sessionData.region)
      console.log('[FaceLiveness] credentials:', sessionData.credentials)

      setLivenessSessionId(sessionData.sessionId)
      setLivenessRegion(sessionData.region)

      // 保存 AWS 临时凭证
      if (sessionData.credentials) {
        console.log('[FaceLiveness] 保存临时凭证')
        setLivenessCredentials({
          accessKeyId: sessionData.credentials.AccessKeyId,
          secretAccessKey: sessionData.credentials.SecretAccessKey,
          sessionToken: sessionData.credentials.SessionToken
        })
      }
    } catch (e: any) {
      console.error('[FaceLiveness] 创建 session 失败:', e)
      message.error(e.message || '创建活体检测会话失败')
    }

    setIsLoadingSession(false)
    console.log('[FaceLiveness] 创建 session 结束')
  }

  /**
   * 获取活体检测结果
   */
  const fetchLivenessResult = async () => {
    if (!livenessSessionId) {
      console.log('[FaceLiveness] 没有 sessionId，跳过获取结果')
      return
    }

    console.log(
      '[FaceLiveness] 开始获取检测结果, sessionId:',
      livenessSessionId
    )
    spinChange(true)

    try {
      const result = await getLivenessResultRequest({
        sessionId: livenessSessionId,
        mfaToken: props.initData.mfaToken
      })
      console.log('[FaceLiveness] 获取检测结果响应:', result)

      // 适配后端返回格式
      const responseData = result.data || result
      console.log('[FaceLiveness] 解析后的 livenessData:', responseData)

      const livenessData: LivenessResult = responseData
      setLivenessResult(livenessData)

      console.log('[FaceLiveness] isLive:', livenessData.isLive)
      console.log('[FaceLiveness] confidence:', livenessData.confidence)
      console.log('[FaceLiveness] status:', livenessData.status)

      // 根据结果处理登录
      if (livenessData.isLive) {
        console.log('[FaceLiveness] 活体检测通过，调用 mfaLogin')
        // 活体检测通过，调用验证接口
        props.mfaLogin(200, responseData)
      } else {
        console.log('[FaceLiveness] 活体检测未通过')
        // 未通过，显示重试
        message.error(livenessData.message || '活体检测未通过')
      }
    } catch (e: any) {
      console.error('[FaceLiveness] 获取检测结果失败:', e)
      message.error(e.message || '获取检测结果失败')
    }

    spinChange(false)
    console.log('[FaceLiveness] 获取检测结果结束')
  }

  /**
   * 处理 AWS 活体检测完成
   */
  const handleLivenessAnalysisComplete = async () => {
    await fetchLivenessResult()
  }

  /**
   * 处理 AWS 活体检测错误
   */
  const handleLivenessError = async (error: any) => {
    console.error('Liveness error:', error)
    message.error(error.message || '检测过程中发生错误')
    await createLivenessSession()
  }

  // ============================================
  // 渲染 AWS 活体检测组件
  // ============================================
  const renderAwsLivenessDetector = () => {
    if (isLoadingSession) {
      return (
        <div
          style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}
        >
          <div className="authing-g2-loading">加载中...</div>
        </div>
      )
    }

    if (!livenessSessionId) {
      return (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>无法创建检测会话</p>
          <SubmitButton
            onClick={createLivenessSession}
            text="重试"
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

  // ============================================
  // 渲染结果页面
  // ============================================
  const renderResult = () => {
    if (!livenessResult) return null

    return (
      <div className="g2-mfa-face-result">
        <div
          className={`g2-mfa-face-result-badge ${
            livenessResult.isLive ? 'success' : 'error'
          }`}
        >
          {livenessResult.isLive ? '✅ 真人验证通过' : '❌ 未通过验证'}
        </div>
        <p className="authing-g2-mfa-tips">
          置信度: {livenessResult.confidence?.toFixed?.(2) || 0}%
        </p>
        <p className="authing-g2-mfa-tips">状态: {livenessResult.status}</p>
        {livenessResult.message && (
          <p className="authing-g2-mfa-tips">{livenessResult.message}</p>
        )}
        <SubmitButton
          onClick={() => {
            setLivenessResult(null)
            createLivenessSession()
          }}
          text="重新检测"
          className="mfa-face"
        />
      </div>
    )
  }

  // ============================================
  // 主渲染逻辑
  // ============================================

  return (
    <div>
      <h3 className="authing-g2-mfa-title">{t('common.mfaCertification')}</h3>

      {/* 结果展示 */}
      {livenessResult && renderResult()}

      {/* AWS 活体检测 */}
      {!livenessResult && (
        <>
          <p className="authing-g2-mfa-tips">
            {props.initData?.faceMfaEnabled
              ? '请进行人脸活体检测验证'
              : '请进行人脸活体检测绑定'}
          </p>
          {renderAwsLivenessDetector()}
        </>
      )}
    </div>
  )
}
