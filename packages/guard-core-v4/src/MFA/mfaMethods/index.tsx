import { React } from 'shim-react'

import { useTranslation } from 'react-i18next'

import { IconFont } from '../../IconFont'

import { GuardMFAInitData, MFAType } from '../interface'

import { i18n } from '../../_utils/locales'

import './style.less'

import { useGuardInitData } from '../../_utils/context'

import { GuardButton } from '../../GuardButton'

import { getFacePlugin } from '../../_utils/facePlugin'

const { useMemo, useState } = React

export interface MFAMethodsProps {
  method: MFAType
  onChangeMethod: (type: MFAType) => void
}

const methodTitleMapping: Record<
  MFAType,
  {
    title: () => string
    icon: string
  }
> = {
  [MFAType.EMAIL]: {
    title: () => i18n.t('common.EmailVerification'),
    icon: 'authing-mail'
  },
  [MFAType.SMS]: {
    title: () => i18n.t('common.SMS'),
    icon: 'authing-phone'
  },
  [MFAType.TOTP]: {
    title: () => i18n.t('common.OTPVerification'),
    icon: 'authing-totp'
  },
  [MFAType.FACE]: {
    title: () => i18n.t('common.faceVerification'),
    icon: 'authing-face'
  },
  [MFAType.PASSKEY]: {
    title: () => 'Passkey',
    icon: 'authing-slideshow-3-line'
  }
}

export const MFAMethods: React.FC<MFAMethodsProps> = ({
  method,
  onChangeMethod
}) => {
  const [currentMethod, setCurrentMethod] = useState(method)
  const { t } = useTranslation()

  const { applicationMfa } = useGuardInitData<GuardMFAInitData>()

  const otherMethods = useMemo(
    () =>
      applicationMfa
        .filter(item =>
          Object.keys(methodTitleMapping).includes(item.mfaPolicy)
        )
        .filter(item => item.mfaPolicy !== currentMethod)
        .filter(item => {
          if (item.mfaPolicy === MFAType.FACE) {
            const facePlugin = getFacePlugin()

            return Boolean(facePlugin)
          }

          return true
        })
        .sort((a, b) => a.sort - b.sort)
        .map(item => (
          <GuardButton
            className="g2-guard-mfa-methods-btn"
            onClick={(e: any) => {
              onChangeMethod(item.mfaPolicy)
              setCurrentMethod(item.mfaPolicy)
            }}
            key={item.mfaPolicy}
          >
            <IconFont type={methodTitleMapping[item.mfaPolicy].icon} />
            {`${methodTitleMapping[item.mfaPolicy].title()}`}
          </GuardButton>
        )),
    [applicationMfa, currentMethod, onChangeMethod]
  )

  return (
    <>
      {otherMethods.length !== 0 && (
        <>
          <div
            style={{
              minHeight: 32
            }}
          />
          <div className="g2-mfa-method">
            <div className="g2-mfa-method-title">
              {t('login.otherVerifyWay') as string}
            </div>
            {otherMethods}
          </div>
        </>
      )}
    </>
  )
}
