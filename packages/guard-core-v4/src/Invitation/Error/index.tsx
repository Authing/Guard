import { React } from 'shim-react'
import { GuardErrorView } from '../../Error'
import { i18n } from '../../_utils/locales'
import './style.less'
import { GuardModuleType } from '../../Guard'
import { useTranslation } from 'react-i18next'

export const GuardInviteExpireView = (props: any) => {
  const { t } = useTranslation()

  return (
    <GuardErrorView
      error={{
        name: 'invite_expire',
        message:
          props.key === GuardModuleType.INVITE_EXPIRE
            ? t('common.inviteExpired')
            : t('common.pageExpired')
      }}
    />
  )
}
