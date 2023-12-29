import { React } from 'shim-react'
import { IconFont } from '../IconFont'
import { TenantButtonProps } from './interface'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import './styles.less'

export const CreateButton: React.FC<TenantButtonProps> = ({
  className,
  onClick,
  style
}) => {
  const { t } = useTranslation()
  return (
    <div
      className={classNames('authing-create-button', className)}
      onClick={onClick}
      style={style}
    >
      {t('common.createTenantDesc')}
      <span> {t('common.createTenant')}</span>
    </div>
  )
}
