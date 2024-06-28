import { React } from 'shim-react'
import { GuardMessageView } from '../../Message'
import { useTranslation } from 'react-i18next'

export const GuardInviteSuccessView = () => {
  const { t } = useTranslation()

  return <GuardMessageView message={t('common.inviteSuccess')} />
}
