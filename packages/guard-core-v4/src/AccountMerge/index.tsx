import { Form, Modal } from 'shim-antd'
import { React } from 'shim-react'
import { useTranslation } from 'react-i18next'
import { useGuardAuthClient } from '../Guard/authClient'
import { IconFont } from '../IconFont'
import SubmitButton from '../SubmitButton'
import {
  useGuardEvents,
  useGuardInitData,
  useGuardIsAuthFlow
} from '../_utils/context'
import { useGuardHttp } from '../_utils/guardHttp'
import {
  AuthFlowAction,
  BriefUserInfo,
  GuardAccountMergeInitData
} from './interface'
import './styles.less'
import { UserRadio } from './UserRadio'

const { useEffect, useRef } = React

const filterNull = (obj: BriefUserInfo) => {
  const newObj: any = {}
  Object.keys(obj).forEach(key => {
    if (!!obj[key as keyof BriefUserInfo]) {
      newObj[key] = obj[key as keyof BriefUserInfo]
    } else {
      newObj[key] = '暂未设置'
    }
  })
  return newObj
}
// 模拟用户合并
const SimulationMergeUser = (
  rootUser: BriefUserInfo,
  mergeUser: BriefUserInfo
) => {
  return {
    displayName: rootUser.displayName,
    username: rootUser.username,
    name: rootUser.name || mergeUser.name,
    email: rootUser.email || mergeUser.email,
    phone: rootUser.phone || mergeUser.phone
  }
}

export const GuardAccountMergeView: React.FC = () => {
  const {
    currentUserInfo: currentUser,
    existingUserInfo: existUser,
    mergeToken
  } = useGuardInitData<GuardAccountMergeInitData>()

  const currentUserInfo = filterNull(currentUser)
  const existingUserInfo = filterNull(existUser)

  const [form] = Form.useForm()

  const submitButtonRef = useRef<any>(null)

  const isFlow = useGuardIsAuthFlow()

  const events = useGuardEvents()

  const { post, authFlow } = useGuardHttp()

  const { t } = useTranslation()

  const authClient = useGuardAuthClient()

  useEffect(() => {
    form.setFieldsValue({
      merge: false
    })
  }, [form])
  const onFinish = async (values: any) => {
    let mergeUser: any = {}
    if (values.merge) {
      mergeUser = SimulationMergeUser(existUser, currentUserInfo)
    } else {
      mergeUser = SimulationMergeUser(currentUser, existingUserInfo)
    }

    Modal.confirm({
      prefixCls: 'authing-ant-modal',
      className: 'confirm-merge',
      title: t('login.accoutMergeConfirm', {
        account: mergeUser.displayName
      }),
      content: (
        <>
          <div className="account-base">{t('login.accountBaseInfo')}</div>
          <div className="account-info">
            <div>
              {t('user.name')} <span>{mergeUser.name}</span>
            </div>
            <div>
              {t('user.email')} <span>{mergeUser.email}</span>
            </div>
            <div>
              {t('user.username')} <span>{mergeUser.username}</span>
            </div>

            <div>
              {t('user.phone')} <span>{mergeUser.phone}</span>
            </div>
          </div>
        </>
      ),
      cancelButtonProps: {
        prefixCls: 'authing-ant-btn'
      },
      okButtonProps: {
        prefixCls: 'authing-ant-btn'
      },
      onOk: async () => {
        submitButtonRef.current?.onSpin(true)

        if (isFlow) {
          const { isFlowEnd, data, onGuardHandling } = await authFlow(
            AuthFlowAction.MERGE,
            {
              ...values
            }
          )

          if (isFlowEnd) {
            events?.onLogin?.(data, authClient)
          } else {
            onGuardHandling?.()
          }
        } else {
          const { code, data, onGuardHandling } = await post(
            '/api/gjs/confirmAccountMerge',
            {
              ...values,
              mergeToken
            }
          )

          if (code === 200) {
            events?.onLogin?.(data.newUser, authClient)
          } else {
            onGuardHandling?.()
          }
        }
        submitButtonRef.current?.onSpin(false)
      }
    })
  }

  return (
    <div className="g2-view-container">
      <div className="g2-view-tabs">
        <div className="g2-merge-user-header">
          <IconFont
            type="authing-a-bianzu12"
            style={{ fontSize: 220 }}
            className="icon"
          />
          <div className="title">
            {`${t(
              'user.yourPhoneAccounted'
            )} ${existingUserInfo?.displayName} ${t('user.userBindText')}`}
          </div>
          <div className="title-explain">
            {t('user.onlySaveOneAccountTips')}
          </div>
          <div className="title-explain">
            {t('user.hepAccountMigriationTips')}
          </div>
        </div>

        <div className="g2-user-list-content">
          <Form form={form} onFinish={onFinish}>
            <Form.Item name={'merge'}>
              <UserRadio
                currentUserInfo={currentUserInfo}
                existingUserInfo={existingUserInfo}
              />
            </Form.Item>

            <div className="g2-user-list-btn">
              <SubmitButton
                text={t('common.sure')!}
                ref={submitButtonRef}
                className="g2-mfa-submit-button"
              />
            </div>
          </Form>
        </div>
      </div>
    </div>
  )
}
