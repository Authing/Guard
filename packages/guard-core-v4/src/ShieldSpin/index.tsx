import { React } from 'shim-react'

import { useGuardPublicConfig } from '../_utils/context'

export const ShieldSpinLoading = (
  props: JSX.IntrinsicAttributes &
    React.ClassAttributes<HTMLEmbedElement> &
    React.EmbedHTMLAttributes<HTMLEmbedElement>
) => {
  const svgString = `<svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;">
          <defs>
            <style>
              #ring-outer { fill: none; stroke: rgba(251,108,43,0.12); stroke-width: 2; }
              .orbit-dot {
                fill: #fb6c2b;
                transform-origin: 50px 50px;
                animation: orbitSpin 1.6s linear infinite;
              }
              .orbit-dot2 {
                fill: rgba(251,108,43,0.45);
                transform-origin: 50px 50px;
                animation: orbitSpin 1.6s linear infinite;
                animation-delay: -0.8s;
              }
              .orbit-dot3 {
                fill: rgba(251,108,43,0.2);
                transform-origin: 50px 50px;
                animation: orbitSpin 1.6s linear infinite;
                animation-delay: -0.4s;
              }
              .arc-sweep {
                fill: none;
                stroke: #fb6c2b;
                stroke-width: 2;
                stroke-dasharray: 50 158;
                stroke-linecap: round;
                transform-origin: 50px 50px;
                animation: arcSpin 1.6s linear infinite;
              }
              .arc-sweep2 {
                fill: none;
                stroke: rgba(251,108,43,0.25);
                stroke-width: 1.5;
                stroke-dasharray: 90 118;
                stroke-linecap: round;
                transform-origin: 50px 50px;
                animation: arcSpin 2.4s linear infinite reverse;
              }
              #core-pulse {
                fill: #fb6c2b;
                animation: corePulse 1.6s ease-in-out infinite;
              }
              @keyframes orbitSpin {
                to { transform: rotate(360deg); }
              }
              @keyframes arcSpin {
                to { transform: rotate(360deg); }
              }
              @keyframes corePulse {
                0%, 100% { opacity: 0.4; r: 3; }
                50% { opacity: 1; r: 4.5; }
              }
            </style>
          </defs>

          <circle id="ring-outer" cx="50" cy="50" r="38"/>
          <circle cx="50" cy="50" r="26" fill="none" stroke="rgba(251,108,43,0.07)" stroke-width="1.5"/>
          <circle class="arc-sweep2" cx="50" cy="50" r="26"/>
          <circle class="arc-sweep" cx="50" cy="50" r="38"/>
          <circle id="core-pulse" cx="50" cy="50" r="4"/>
          <g class="orbit-dot"><circle cx="50" cy="12" r="4"/></g>
          <g class="orbit-dot2"><circle cx="50" cy="24" r="3"/></g>
          <g class="orbit-dot3"><circle cx="50" cy="38" r="2.5"/></g>
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
