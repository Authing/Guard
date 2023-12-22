import { React } from 'shim-react'
import { Steps, StepsProps } from 'shim-antd'
import './style.less'
import { IconFont } from '../IconFont'

const customDot: StepsProps['progressDot'] = (dot, { status, index }) => {
  console.log('dot: ', dot, 'status: ', status)
  if (status === 'finish') {
    return (
      <IconFont
        type="authing-checkbox-circle-fill"
        className="g2-gateway-icon"
      />
    )
  } else if (status === 'error') {
    return (
      <IconFont
        type="authing-close-circle-fill"
        style={{ color: '#E8353E' }}
        className="g2-gateway-icon"
      />
    )
  } else if (status === 'wait') {
    return (
      <IconFont
        type="authing-indeterminate-circle-fill"
        className="g2-gateway-icon"
        style={{ color: '#A9AEB8' }}
      />
    )
  }

  return <span>{dot}</span>
}
export const GuardGatewayError = () => {
  return (
    <div className="g2-view-gateway">
      <Steps
        className="g2-gateway-steps"
        current={3}
        progressDot={customDot}
        status="error"
        items={[
          {
            title: (
              <span>
                Authing
                <br />
                网关代理应用
              </span>
            )
          },
          {
            title: '测试连接'
          },
          {
            title: '网关'
          },
          {
            title: '测试连接'
          },
          {
            title: '应用'
          }
        ]}
      />
      <div className="g2-gateway-error">
        <p className="g2-gateway-error-title">
          <IconFont type="authing-alert-fill" className="g2-gateway-warning" />
          出错了，请检查后重试！
        </p>
        <div className="g2-gateway-error-content">
          <p>
            <span className="g2-gateway-error-content-title">验证码：</span>
            <span>d33d4rf4</span>
          </p>
          <p>
            <span className="g2-gateway-error-content-title">错误原因：</span>
            <span>d33d4rf4</span>
          </p>
        </div>
      </div>
    </div>
  )
}
