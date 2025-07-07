import { React } from 'shim-react'

import { useTranslation } from 'react-i18next'

import { GuardModuleType } from '../Guard/module'

import { ImagePro } from '../ImagePro'

import {
  useGuardInitData,
  useGuardModule,
  useGuardPublicConfig
} from '../_utils/context'

import { ValidityVerifyInitData } from './interface'

import { useGuardView } from '../Guard/core/hooks/useGuardView'

import { SendCodeBtn } from '../SendCode/SendCodeBtn'

import { useGuardHttp } from '../_utils'

const { useEffect, useRef, useState } = React

export const GuardValidityVerifyView: React.FC = () => {
  const { t } = useTranslation()

  const { post } = useGuardHttp()

  const initData = useGuardInitData<ValidityVerifyInitData>()

  const [verifyStatus, setVerifyStatus] = useState<
    'success' | 'fail' | 'pending' | 'verifying'
  >('pending')

  const { changeModule: __changeModule } = useGuardModule()

  const publicConfig = useGuardPublicConfig()

  useGuardView()

  const { email = '', ticket = '' } = initData ?? {}

  const cdnBase = publicConfig?.cdnBase

  // 开始轮训请求 email verify status
  const checkEmailVerifyStatus = async () => {
    // 得到结果后 根据结果判断是否轮训还是结束轮休
    const { data } = await post<{
      status: 'success' | 'fail' | 'pending' | 'verifying'
    }>('/api/v2/check-verify-email', { email })
    setVerifyStatus(data?.status ?? 'pending')
    if (data?.status && ['success', 'fail'].includes(data.status)) {
      // 轮训结束
      return
    } else {
      // 继续轮训
      let timer = setTimeout(async () => {
        await checkEmailVerifyStatus()
        clearTimeout(timer)
      }, 500)
    }
  }

  useEffect(() => {
    // checkEmailVerifyStatus()
  }, [])

  return (
    <div className="g2-view-container g2-validity-verify-view">
      <div className="g2-validity-verify-view-content">
        <ImagePro
          className="plate"
          src={`${cdnBase}/questions-send-ok.png`}
          alt=""
          height={120}
        />
        <div className="title">{`验证邮箱 ${email}`}</div>
        <div className="message">
          {'验证链接已发送到你的邮箱中,请在邮箱中确认'}
        </div>

        <SendCodeBtn
          sendDesc="未收到? 重新发送"
          retryDesc={(time: number) => {
            return `${time}s 后可重新发送`
          }}
          beforeSend={() => {
            return new Promise(resolve => {
              resolve(true)
            })
          }}
          type="link"
        />
      </div>
    </div>
  )
}
