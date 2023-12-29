import { React } from 'shim-react'
import { IconFont } from '../IconFont'
import { TenantButtonProps } from './interface'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import './styles.less'

export const VisitorButton: React.FC<TenantButtonProps> = ({
  className,
  onClick,
  style
}) => {
  const { t } = useTranslation()
  return (
    <div
      className={classNames('authing-visitor-button', className)}
      onClick={onClick}
      style={style}
    >
      <IconFont type="authing-account-circle-line" />
      <span> {t('common.visitor')}</span>
    </div>
  )
}
