import { React } from 'shim-react'
import { GuardErrorView } from '../../Error'
import { i18n } from '../../_utils/locales'
import './style.less'
import { GuardModuleType } from '../../Guard'

export const GuardInviteExpireView = (props: any) => {
  return (
    <GuardErrorView
      error={{
        name: 'invite_expire',
        message:
          props.key === GuardModuleType.INVITE_EXPIRE
            ? '当前邀请链接已失效，请联系相关管理员为你重新发起邀请。'
            : '当前页面已过期，请重新点击邀请链接进入'
      }}
    />
  )
}
