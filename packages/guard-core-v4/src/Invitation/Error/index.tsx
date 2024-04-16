import React from 'react'
import { GuardErrorView } from '../../Error'
import { i18n } from '../../_utils/locales'

export const GuardInviteExpireView = () => {
  return (
    <GuardErrorView
      error={{
        name: 'invite_expire',
        message:
          i18n.t('common.inviteExpire') +
          '</br>' +
          i18n.t('common.inviteExpireMsg')
      }}
    />
  )
}
