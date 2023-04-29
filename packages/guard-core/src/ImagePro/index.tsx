import { React } from 'shim-react'

import { GuardButton } from '../GuardButton'

import { getClassnames } from '../_utils'

import { i18n } from '../_utils/locales'

import './styles.less'

export interface ImageProProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  className?: string
  alt?: string
  imgClassName?: string
  size?: number | string
  width?: number | string
  height?: number | string
  borderRadius?: number | string
  noSpin?: boolean
}

const { useRef, useState } = React

export const ImagePro = (props: ImageProProps) => {
  const { borderRadius, noSpin, alt, style, ...imgProps } = props
  const [loaded, setLoaded] = useState(noSpin === true ? true : false)
  let w: number | string = 0
  let h: number | string = 0
  if (props.size) {
    // size 存在，说明是正方形，让宽高等于 size
    w = props.size
    h = props.size
  } else {
    // 如果 size 不存在，说明长方形，尝试读取宽高
    w = props.width ? props.width : 'auto'
    h = props.height ? props.height : 'auto'
  }

  return (
    <div
      style={{ width: w, height: h }}
      className={getClassnames([
        'g2-base-imagepro-container',
        'g2-base-image-background-animation',
        loaded ? 'loaded' : 'unload',
        props?.className
      ])}
    >
      <img
        {...imgProps}
        style={{
          width: w,
          height: '100%',
          borderRadius: borderRadius,
          ...style
        }}
        className="g2-base-imagepro"
        draggable={false}
        alt={alt || 'image'}
        onLoad={() => setLoaded(true)}
      />
    </div>
  )
}

export const ImagePro2 = (props: ImageProProps) => {
  const { borderRadius, noSpin, alt, style, ...imgProps } = props
  const [loaded, setLoaded] = useState(noSpin === true ? true : false)
  const maskRef = useRef<any>(null)
  let w: number | string = 0
  let h: number | string = 0
  if (props.size) {
    // size 存在，说明是正方形，让宽高等于 size
    w = props.size
    h = props.size
  } else {
    // 如果 size 不存在，说明长方形，尝试读取宽高
    w = props.width ? props.width : 'auto'
    h = props.height ? props.height : 'auto'
  }

  return (
    <div
      style={{ width: w, height: h }}
      className={getClassnames([
        'g2-base-imagepro-container',
        'g2-base-imagepro-container2',
        'g2-base-image-background-animation',
        loaded ? 'loaded' : 'unload',
        props?.className
      ])}
      onClick={(e: any) => {
        setLoaded(false)
        props?.onClick && props?.onClick(e)
        if (maskRef.current) {
          maskRef.current.classList.remove('g2-base-imagepro-mask-show')
        }
      }}
      id="g2-base-imagepro-container"
      onMouseMove={() => {
        if (maskRef.current) {
          maskRef.current.classList.add('g2-base-imagepro-mask-show')
        }
      }}
    >
      <img
        {...imgProps}
        style={{
          width: w,
          height: '100%',
          borderRadius: borderRadius,
          ...style
        }}
        className="g2-base-imagepro"
        draggable={false}
        alt={alt || 'image'}
        onLoad={() => setLoaded(true)}
      />
      {loaded && (
        <div className="g2-base-imagepro-mask" ref={maskRef}>
          <span style={{ marginRight: 4 }}>
            {i18n.t('login.verifyCodeTip')}
          </span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_968_21911)">
              <path
                d="M3.64204 2.95599C4.85175 1.90776 6.39937 1.33176 8.00004 1.33399C11.682 1.33399 14.6667 4.31866 14.6667 8.00066C14.6667 9.42466 14.22 10.7447 13.46 11.8273L11.3334 8.00066H13.3334C13.3335 6.95507 13.0262 5.93253 12.4498 5.06016C11.8734 4.1878 11.0533 3.5041 10.0915 3.09407C9.12966 2.68405 8.06852 2.56579 7.04001 2.754C6.01151 2.94221 5.06101 3.42859 4.30671 4.15266L3.64204 2.95599ZM12.358 13.0453C11.1483 14.0935 9.60072 14.6696 8.00004 14.6673C4.31804 14.6673 1.33337 11.6827 1.33337 8.00066C1.33337 6.57666 1.78004 5.25666 2.54004 4.17399L4.66671 8.00066H2.66671C2.66662 9.04624 2.97388 10.0688 3.55027 10.9412C4.12665 11.8135 4.94675 12.4972 5.90859 12.9072C6.87042 13.3173 7.93156 13.4355 8.96007 13.2473C9.98857 13.0591 10.9391 12.5727 11.6934 11.8487L12.358 13.0453Z"
                fill="white"
              />
            </g>
            <defs>
              <clipPath id="clip0_968_21911">
                <rect width="16" height="16" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </div>
      )}
      {!loaded && (
        <GuardButton
          className="g2-base-imagepro-mask g2-base-imagepro-loading"
          loading
        />
      )}
    </div>
  )
}
