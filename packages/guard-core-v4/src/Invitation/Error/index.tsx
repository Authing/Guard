import { React } from 'shim-react'
import { GuardErrorView } from '../../Error'
import { i18n } from '../../_utils/locales'

export const GuardInviteExpireView = () => {
  return (
    <GuardErrorView
      error={{
        name: 'invite_expire',
        message: '当前邀请链接已失效，请联系相关管理员为你重新发起邀请。'
      }}
    />
  )
}
