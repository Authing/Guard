import { Form, Input, Tabs } from 'shim-antd'

import { React } from 'shim-react'

import { useTranslation } from 'react-i18next'

import { GuardModuleType } from '../Guard'

import { BackCustom, BackLogin } from '../Back'

import {
  useGuardFinallyConfig,
  useGuardInitData,
  useGuardModule,
  useGuardPublicConfig
} from '../_utils/context'

import { GuardIdentityAccountVerifcationInitData } from './interface'

import './styles.less'

import { useGuardView } from '../Guard/core/hooks/useGuardView'
import SubmitButton from '../SubmitButton'
import { getGuardHttp } from '../_utils'

const { useMemo, useRef, useCallback } = React

/**
 * @description 用户身份源绑定已有账号流程中验证账号的视图 不建议向外暴露使用
 */
export const GuardIdentityAccountVerifcation: React.FC<any> = () => {
  const initData = useGuardInitData<GuardIdentityAccountVerifcationInitData>()

  const { post } = getGuardHttp()

  const config = useGuardFinallyConfig()

  const { backModule } = useGuardModule()

  const submitButtonRef = useRef<any>(null)

  useGuardView()

  const { t } = useTranslation()

  const publicConfig = useGuardPublicConfig()

  const renderBack = useMemo(() => {
    if (initData.source === GuardModuleType.IDENTITY_BINDING_ASK)
      return (
        <BackCustom onBack={() => backModule?.()}>
          {t('common.back')}
        </BackCustom>
      )

    return <BackLogin />
  }, [backModule, initData.source, t])

  const onNextHandle = useCallback(async values => {
    console.log(values, 'onFinish')
    const res = await post('/api/v2/users/check', values)
    // 是否存在账号
    if (res.code === 200) {
      // 存在
    } else {
      // 不存在
    }
  }, [])

  return (
    <div className="g2-view-container g2-view-identity-binding-v2">
      {renderBack}

      <div className="g2-view-identity-binding-content">
        <div className="g2-view-identity-binding-content-logo">
          <img src={config?.logo} alt="" className="logo" />
        </div>
        <div className="g2-view-identity-binding-content-desc">
          <span>{'请跟随步骤完成账号绑定'}</span>
        </div>
        <div className="g2-view-identity-binding-content-title">
          <span>{'绑定已有账号'}</span>
        </div>
      </div>
    </div>
  )
}
