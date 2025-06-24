import { React } from 'shim-react'
import { GuardButton } from '../GuardButton'
import { IconFont } from '../IconFont'
import { useGuardInitData } from '../_utils'
import { GuardIdentityBindingResultInitData } from './interface'

/**
 * @description 询问绑定的结果页 用于账号校验出现问题时
 */
export const GuardIdentityBindingResult = () => {
  const initData = useGuardInitData<GuardIdentityBindingResultInitData>()
  return (
    <div className="g2-view-container  g2-view-identity-binding-v2">
      <div className="g2-view-identity-binding-content">
        <div className="binding-result-header">
          <div className="binding-result-img">
            <IconFont type="authing-bianzu" />
          </div>
          <div className="title">{initData.title}</div>
          <div className="desc">{initData.desc}</div>
        </div>
        <div className="g2-view-identity-binding-account-select-button-group">
          {initData.actions.map(action => {
            return (
              <GuardButton
                className="authing-g2-ghost-button"
                onClick={action.callback}
              >
                {action.title}
              </GuardButton>
            )
          })}
        </div>
      </div>
    </div>
  )
}
