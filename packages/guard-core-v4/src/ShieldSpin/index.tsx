import { React } from 'shim-react'

import { useGuardPublicConfig } from '../_utils/context'

import loading from './loading.svg'

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
        <embed src={loading} width={size} height={size} />
      )}
    </div>
  )
}

export const Spin = () => (
  <div className="g2-init-setting-loading">
    <ShieldSpin size={100} />
  </div>
)
