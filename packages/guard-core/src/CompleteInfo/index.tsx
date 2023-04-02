import { React } from 'shim-react'

import { useTranslation } from 'react-i18next'

import { ImagePro } from '../ImagePro'

import { CompleteInfo } from './core/completeInfo'

import {
  CompleteInfoInitData,
  CompleteInfoMetaData,
  CompleteInfoRequest,
  OmitCompleteInfo,
  RegisterCompleteInfoInitData
} from './interface'

import './styles.less'

import { IconFont } from '../IconFont'

import { useGuardAuthClient } from '../Guard/authClient'

import {
  useGuardButtonState,
  useGuardEvents,
  useGuardFinallyConfig,
  useGuardHttpClient,
  useGuardInitData,
  useGuardMultipleInstance,
  useGuardPublicConfig
} from '../_utils/context'

import { authFlow, CompleteInfoAuthFlowAction, registerRequest } from './businessRequest'

import { extendsFieldsToMetaData, fieldValuesToRegisterProfile } from './utils'

import { GuardButton } from '../GuardButton'

import { useGuardView } from '../Guard/core/hooks/useGuardView'

const { useCallback, useEffect, useMemo, useState } = React

export const GuardCompleteInfo: React.FC<{
  metaData: CompleteInfoMetaData[]
  skipComplateFileds: boolean
  businessRequest: (action: CompleteInfoAuthFlowAction, data?: CompleteInfoRequest) => Promise<void>
}> = ({ metaData, businessRequest, skipComplateFileds }) => {
  useGuardView()

  const config = useGuardFinallyConfig()

  const { t } = useTranslation()

  const { spinChange } = useGuardButtonState()

  const [skipLoading, setSkipLoading] = useState(false)

  const onSkip = async () => {
    spinChange(true)
    setSkipLoading(true)

    await businessRequest(CompleteInfoAuthFlowAction.Skip)
    setSkipLoading(false)
    spinChange(false)
  }

  return (
    <div className="g2-view-container g2-complete-info">
      <div className="g2-view-header">
        <div className="g2-completeInfo-header">
          <ImagePro
            src={config?.logo as string}
            size={56}
            borderRadius={8}
            alt=""
            className="icon"
          />

          {skipComplateFileds && (
            <GuardButton
              className="g2-completeInfo-header-skip"
              type="link"
              loading={skipLoading}
              onClick={() => onSkip()}
            >
              {!skipLoading && <IconFont type="authing-a-share-forward-line1" />}
              <span>{t('common.skip')}</span>
            </GuardButton>
          )}
        </div>

        <div className="title">{t('common.perfectUserInfo')}</div>
        <div className="title-explain">{t('common.welcomeDoc', { name: config.title })}</div>
      </div>
      <div className="g2-view-tabs g2-completeInfo-content">
        <CompleteInfo
          metaData={metaData}
          businessRequest={async data =>
            await businessRequest?.(CompleteInfoAuthFlowAction.Complete, data)
          }
        />
      </div>
    </div>
  )
}

export const GuardLoginCompleteInfoView: React.FC = () => {
  const { metaData, skip } = useGuardInitData<CompleteInfoInitData>()

  const events = useGuardEvents()

  const authClient = useGuardAuthClient()

  const { instance: multipleInstance } = useGuardMultipleInstance()

  const businessRequest = async (
    action: CompleteInfoAuthFlowAction,
    data?: CompleteInfoRequest
  ) => {
    const { isFlowEnd, data: resData, onGuardHandling } = await authFlow(action, data)

    // 第一次登录的信息 TODO: 脏逻辑 没时间
    const originAccount = multipleInstance?.getOriginAccount()
    const methods: any =
      multipleInstance?.getOriginWay() === 'password'
        ? multipleInstance?.setLoginWayByHttpData
        : multipleInstance?.setLoginWayByLDAPData
    resData && multipleInstance && originAccount && methods(originAccount, resData)

    if (isFlowEnd) {
      events?.onLogin?.(resData, authClient)
    } else {
      onGuardHandling?.()
    }
  }

  return (
    <GuardCompleteInfo
      metaData={metaData}
      businessRequest={businessRequest}
      skipComplateFileds={skip}
    />
  )
}

export const GuardRegisterCompleteInfoView: React.FC = () => {
  const initData = useGuardInitData<RegisterCompleteInfoInitData>()

  const publicConfig = useGuardPublicConfig()

  const events = useGuardEvents()

  const authClient = useGuardAuthClient()

  const { get } = useGuardHttpClient()

  const config = useGuardFinallyConfig()

  const [selectOptions, setSelectOptions] = useState<
    Array<{
      key: string
      options: {
        value: string
        label: string
      }[]
    }>
  >()

  const [metaData, setMetaData] = useState<CompleteInfoMetaData[]>()

  // 过滤掉 phone 或者 email
  const extendsFields = useMemo(() => {
    return publicConfig?.extendsFields.filter(
      field => field.name !== OmitCompleteInfo[initData.businessRequestName]
    )
  }, [initData.businessRequestName, publicConfig?.extendsFields])

  const skipComplateFileds = publicConfig?.skipComplateFileds

  const loadingComponent = useMemo(() => {
    return config.loadingComponent
  }, [config.loadingComponent])

  const loadSelectOptions = useCallback(async () => {
    const { data: selectOptions } = await get(
      '/api/v2/udfs/field-metadata-for-completion',
      undefined,
      {}
    )

    setSelectOptions(selectOptions)
  }, [get])

  const businessRequest = async (
    action: CompleteInfoAuthFlowAction,
    data?: CompleteInfoRequest
  ) => {
    const { registerProfile, udf } = fieldValuesToRegisterProfile(extendsFields, data?.fieldValues)
    const content = {
      ...initData.content,
      params: JSON.stringify(
        JSON.parse(initData.content?.params ? initData.content?.params : '[]').concat(udf)
      )
    }
    const user: any = await registerRequest(
      action,
      initData.businessRequestName,
      content,
      registerProfile
    )
    if (user.statusCode === 200) {
      initData.onRegisterSuccess(user.data)
      events?.onRegisterInfoCompleted?.(user.data, content, authClient)
    } else {
      user?.onGuardHandling?.()
      const { apiCode, message: errorMessage, data } = user
      initData.onRegisterFailed(apiCode, data, errorMessage)
      events?.onRegisterInfoCompletedError?.(
        {
          code: apiCode,
          message: errorMessage
        },
        content,
        authClient
      )
    }
  }

  useEffect(() => {
    loadSelectOptions()
  }, [loadSelectOptions])

  useEffect(() => {
    if (!selectOptions) return

    const metaData = extendsFieldsToMetaData(extendsFields, selectOptions)

    setMetaData(metaData)
  }, [extendsFields, selectOptions])

  return (
    <>
      {!metaData ? (
        loadingComponent
      ) : (
        <GuardCompleteInfo
          metaData={metaData}
          skipComplateFileds={skipComplateFileds}
          businessRequest={businessRequest}
        />
      )}
    </>
  )
}
