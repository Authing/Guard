import { React } from 'shim-react'

import { useGuardPublicConfig } from '../_utils/context'

export const EAK_LOADING_SPINNER_SIZE = 24
const CUSTOM_LOADING_IMAGE_SIZE = 100

export const EAK_LOADING_SVG_STRING = `<svg id="loadingSvg" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-label="Loading" role="img" focusable="false" style="display:block;width:var(--eak-loading-size,24px);height:var(--eak-loading-size,24px);overflow:visible;">
  <style>
    @keyframes eak-loading-spin {
      to {
        transform: rotate(360deg);
      }
    }

    .eak-loading-spinner__arc {
      transform-origin: 12px 12px;
      animation: eak-loading-spin 900ms linear infinite;
    }
  </style>
  <path class="eak-loading-spinner__arc" d="M21 12a9 9 0 1 1-6.219-8.56" fill="none" stroke="rgba(28, 28, 30, 0.38)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`

const toLoadingSize = (size: number | string) =>
  typeof size === 'number' ? `${size}px` : size

export const ShieldSpinLoading = (
  props: JSX.IntrinsicAttributes &
    React.HTMLAttributes<HTMLDivElement> & {
      size?: number | string
    }
) => {
  const { size = EAK_LOADING_SPINNER_SIZE, style, ...restProps } = props

  return (
    <div
      {...restProps}
      role="status"
      aria-label="Loading"
      style={{
        width: size,
        height: size,
        ['--eak-loading-size' as string]: toLoadingSize(size),
        ...style
      }}
      dangerouslySetInnerHTML={{ __html: EAK_LOADING_SVG_STRING }}
    />
  )
}

interface IG2SpinProps {
  size?: number | string
  className?: string
}

export const ShieldSpin = (props: IG2SpinProps) => {
  const publicConfig = useGuardPublicConfig()
  const customLoading = publicConfig?.customLoading
  const size = props.size ? props.size : EAK_LOADING_SPINNER_SIZE
  const imageSize = props.size ? props.size : CUSTOM_LOADING_IMAGE_SIZE

  return (
    <div
      style={{
        width: customLoading ? imageSize : size,
        height: customLoading ? imageSize : size
      }}
      className={props.className}
    >
      {customLoading ? (
        <img src={customLoading} alt="" width={imageSize} />
      ) : (
        <ShieldSpinLoading size={28} />
      )}
    </div>
  )
}

export const Spin = () => (
  <div className="g2-init-setting-loading">
    <ShieldSpin />
  </div>
)
