import { Modal } from 'shim-antd'
import { React } from 'shim-react'
import {
  useGuardFinallyConfig,
  useGuardPublicConfig
} from '../../_utils/context'
import { EmailPreCheck } from '../core/email'
import { SmsPreCheck } from '../core/sms'
import { TotpPreCheck } from '../core/totp'
import { MFAType } from '../interface'
import './style.less'
export default function BindPreCheck(props: any) {
  const { visible, onCancel, type, initData, callback } = props
  const config = useGuardFinallyConfig()

  const publicConfig = useGuardPublicConfig()

  const codeLength = publicConfig?.verifyCodeLength

  const isInternationSms = Boolean(
    publicConfig?.internationalSmsConfig?.enabled
  )

  const ComponentsMapping: Record<
    MFAType.EMAIL | MFAType.SMS | MFAType.TOTP,
    (props: any) => React.ReactNode
  > = {
    [MFAType.EMAIL]: ({ initData, checkSuccess }) => (
      <EmailPreCheck
        mfaToken={initData.mfaToken}
        email={initData.mfaEmail}
        checkSuccess={checkSuccess}
        codeLength={codeLength}
      />
    ),
    [MFAType.SMS]: ({ initData, checkSuccess }) => (
      <SmsPreCheck
        userPhone={initData.mfaPhone}
        phone={initData.mfaPhone}
        mfaToken={initData.mfaToken}
        checkSuccess={checkSuccess}
        codeLength={codeLength}
        isInternationSms={isInternationSms}
        areaCode={publicConfig?.internationalSmsConfig?.defaultISOType || 'CN'}
        phoneCountryCode={initData.mfaPhoneCountryCode}
      />
    ),
    [MFAType.TOTP]: ({ initData, config, checkSuccess }) => (
      <TotpPreCheck mfaToken={initData.mfaToken} checkSuccess={checkSuccess} />
    )
  }
  const checkSuccess = () => {
    onCancel()
    // 开始切换
    callback()
  }

  return (
    <Modal
      centered={true}
      visible={visible}
      width={456}
      onCancel={onCancel}
      destroyOnClose
      footer={null}
    >
      <div className="bind-pre-check-wrapper">
        {ComponentsMapping[type as MFAType.EMAIL | MFAType.SMS | MFAType.TOTP]({
          config: config,
          initData: initData,
          checkSuccess
        })}
      </div>
    </Modal>
  )
}
