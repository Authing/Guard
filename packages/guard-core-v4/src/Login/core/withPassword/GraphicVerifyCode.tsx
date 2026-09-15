import { Input, InputProps } from 'shim-antd'

import { React } from 'shim-react'

import { useTranslation } from 'react-i18next'

import { ImagePro2 } from '../../../ImagePro'

export interface GraphicVerifyCodeProps extends InputProps {
  verifyCodeUrl: string
  changeCode: () => void
  imageLoading?: boolean
  imageHeight?: number
  imageError?: boolean
  refreshDisabled?: boolean
  onImageLoad?: React.ImgHTMLAttributes<HTMLImageElement>['onLoad']
  onImageError?: React.ImgHTMLAttributes<HTMLImageElement>['onError']
}

export const GraphicVerifyCode: React.FC<GraphicVerifyCodeProps> = props => {
  const {
    verifyCodeUrl,
    changeCode,
    imageLoading = false,
    imageHeight = 46,
    imageError = false,
    refreshDisabled = false,
    onImageLoad,
    onImageError,
    ...inputProps
  } = props

  const { t } = useTranslation()

  return (
    <div className="g2-graphic-verify-code">
      <Input {...inputProps} />

      <div
        style={{
          flexShrink: 0,
          pointerEvents: refreshDisabled ? 'none' : undefined
        }}
        aria-disabled={refreshDisabled}
      >
        {imageLoading || imageError ? (
          <button
            type="button"
            className="g2-captcha-code-image"
            disabled={refreshDisabled || imageLoading}
            onClick={changeCode}
            aria-label={t('common.refreshCaptcha') as string}
            style={{
              width: 134,
              height: imageHeight,
              background: '#f7f8fa',
              cursor: 'pointer'
            }}
          >
            {t(imageError ? 'common.refreshCaptcha' : 'common.captchaLoading')}
          </button>
        ) : (
          <ImagePro2
            key={verifyCodeUrl}
            className="g2-captcha-code-image"
            src={verifyCodeUrl}
            alt={t('login.captchaCode') as string}
            height={`${imageHeight}px`}
            width="134px"
            style={{ cursor: refreshDisabled ? 'default' : 'pointer' }}
            onClick={() => {
              if (!refreshDisabled) changeCode()
            }}
            onLoad={onImageLoad}
            onError={onImageError}
          />
        )}
      </div>
    </div>
  )
}
