import { React } from 'shim-react'

import { useGuardPublicConfig } from '../_utils/context'

export const EAK_LOADING_SPINNER_SIZE = 20
const CUSTOM_LOADING_IMAGE_SIZE = 100

export const EAK_LOADING_SVG_STRING = `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-label="Loading" role="img" focusable="false" style="display:block;width:var(--eak-loading-size,20px);height:var(--eak-loading-size,20px);overflow:visible;">
  <style>
    @keyframes eak-loading-spin {
      to {
        transform: rotate(360deg);
      }
    }

    .eak-loading-spinner__arc {
      transform-origin: 10px 10px;
      animation: eak-loading-spin 900ms linear infinite;
    }
  </style>
  <circle cx="10" cy="10" r="7.2" fill="none" stroke="rgba(28, 28, 30, 0.12)" stroke-width="1.6"/>
  <circle class="eak-loading-spinner__arc" cx="10" cy="10" r="7.2" fill="none" stroke="rgba(28, 28, 30, 0.38)" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="18 46"/>
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
        <ShieldSpinLoading size={size} />
      )}
    </div>
  )
}

export const Spin = () => (
  <div className="g2-init-setting-loading">
    <ShieldSpin />
  </div>
)
