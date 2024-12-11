import { React } from 'shim-react'
import { useGuardPublicConfig } from '../../../_utils/context'
import { EyLoginProps } from '../../interface'
import { EyLoginWithWeComQrcode } from '../components/EyLoginWithWeComQrcode'
import { EyLoginWithWeComQrcodeNew } from '../components/EyLoginWithWeComQrcodeNew'
const { useMemo } = React

interface ScanCodeSceneProps extends EyLoginProps {
  refreshQrcode: number
}

export const ScanCodeScene: React.FC<ScanCodeSceneProps> = props => {
  const publicConfig = useGuardPublicConfig()

  const qrcodeTabsSettings = publicConfig?.qrcodeTabsSettings

  const isNew = useMemo(() => {
    return qrcodeTabsSettings['wechatwork-service-provider-qrconnect-v2']
      ?.length
  }, [qrcodeTabsSettings])

  const connectConfig = useMemo(() => {
    return isNew
      ? qrcodeTabsSettings['wechatwork-service-provider-qrconnect-v2']?.[0]
      : qrcodeTabsSettings['wechatwork-service-provider-qrconnect']?.[0]
  }, [qrcodeTabsSettings, isNew])

  return (
    <div>
      {isNew ? (
        <EyLoginWithWeComQrcodeNew
          id={connectConfig?.id}
          QRConfig={connectConfig?.QRConfig}
          {...props}
        />
      ) : (
        <EyLoginWithWeComQrcode
          id={connectConfig?.id}
          QRConfig={connectConfig?.QRConfig}
          {...props}
        />
      )}

      {/* <div className="margin_top_32 margin_bottom_32">
        <div className="separator-wrapper">
          <div className="left-separator">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="68"
              height="2"
              viewBox="0 0 68 2"
              fill="none"
            >
              <path
                d="M0 1L68 0.5V1.5L0 1Z"
                fill="url(#paint0_linear_850_3491)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_850_3491"
                  x1="68"
                  y1="0.999998"
                  x2="8"
                  y2="0.999978"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#EAEBEE" />
                  <stop offset="1" stop-color="#EAEBEE" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="hint">其他登录方式</div>
          <div className="right-separator">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="68"
              height="2"
              viewBox="0 0 68 2"
              fill="none"
            >
              <path
                d="M68 1L0 1.49999L8.74228e-08 0.499994L68 1Z"
                fill="url(#paint0_linear_850_3492)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_850_3492"
                  x1="2.05556e-07"
                  y1="0.999996"
                  x2="60"
                  y2="1.00002"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#EAEBEE" />
                  <stop offset="1" stop-color="#EAEBEE" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
        <div className="other-identifies">
          <div className="identity-item"></div>
          <div className="identity-item"></div>
          <div className="identity-item"></div>
        </div>
      </div> */}
    </div>
  )
}
