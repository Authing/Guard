import { React } from 'shim-react'

import { useGuardPublicConfig } from '../_utils/context'

export const ShieldSpinLoading = (
  props: JSX.IntrinsicAttributes &
    React.ClassAttributes<HTMLEmbedElement> &
    React.EmbedHTMLAttributes<HTMLEmbedElement>
) => {
  const svgString = `<svg width="100%" height="100%"
 viewBox="0 0 150 150" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <style>
    #path-f {
      fill: none;
      stroke: var(--guard-primary, #EE5C2A);
      stroke-width: 8.2;
      stroke-dasharray: 100 220;
      animation: dash 1.6s infinite linear forwards;
      stroke-linecap: round;
      stroke-linejoin: round;

    }
    #path-b {
      fill: none;
      stroke: var(--guard-border, #E7E5E4);
      stroke-width: 8;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    @keyframes dash {
      to {
        stroke-dashoffset: 320;
      }
    }
  </style>
  <title>Loading</title>
  <g id="单独" transform="translate(25.000000, 16.000000)" fill-rule="nonzero"  stroke-width="2" >
    <path d="M50,0 L0,30 C0,31 0,32 0,33 C0,69 20,100 50,116 C79,100 100,69 100,33 C100,32 99,31 99,30 L50,0 Z" id="path-b"/>
    <path d="M50,0 L0,30 C0,31 0,32 0,33 C0,69 20,100 50,116 C79,100 100,69 100,33 C100,32 99,31 99,30 L50,0 Z" id="path-f"/>
  </g>
</svg>`

  return <div dangerouslySetInnerHTML={{ __html: svgString }} {...props} />
}

interface IG2SpinProps {
  size?: number
  className?: string
}

export const ShieldSpin = (props: IG2SpinProps) => {
  const publicConfig = useGuardPublicConfig()
  let size = props.size ? props.size : 50

  return (
    <div
      style={{
        width: size,
        height: size
      }}
      className={props.className}
    >
      {publicConfig?.customLoading ? (
        <img src={publicConfig.customLoading} alt="" width={size} />
      ) : (
        <ShieldSpinLoading width={size} height={size} />
      )}
    </div>
  )
}

export const Spin = () => (
  <div className="g2-init-setting-loading">
    <ShieldSpin size={100} />
  </div>
)
