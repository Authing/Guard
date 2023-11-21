import { Input, InputProps } from 'shim-antd'

import '@antd-lib-style/input/style/index.less'

import { React } from 'shim-react'

import { useTranslation } from 'react-i18next'

import { ImagePro2 } from '../../../ImagePro'

export interface GraphicVerifyCodeProps extends InputProps {
  verifyCodeUrl: string
  changeCode: () => void
}

export const GraphicVerifyCode: React.FC<GraphicVerifyCodeProps> = props => {
  const { verifyCodeUrl, changeCode, ...inputProps } = props

  const { t } = useTranslation()

  return (
    <div className="g2-graphic-verify-code">
      <Input {...inputProps} />

      <ImagePro2
        className="g2-captcha-code-image"
        src={verifyCodeUrl}
        alt={t('login.captchaCode') as string}
        height="46px"
        width="134px" //  为了第一次加载图片，和后面刷新（或者显示时）宽度一致，免得宽度会变化，从100到134
        style={{ cursor: 'pointer' }}
        onClick={() => changeCode()}
      />
    </div>
  )
}
