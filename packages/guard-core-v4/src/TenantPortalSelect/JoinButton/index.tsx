import { React } from 'shim-react'
import { IconFont } from '../../IconFont'
import { TenantButtonProps } from '../interface'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import '../styles.less'

export const JoinButton: React.FC<TenantButtonProps> = ({
  className,
  onClick,
  style
}) => {
  const { t } = useTranslation()
  return (
    <div
      className={classNames('authing-add-button', className)}
      onClick={onClick}
      style={style}
    >
      <span className="authing-add-button-icon">
        <IconFont type="authing-add-line" />
      </span>
      {t('common.joinTenant')}
    </div>
  )
}
