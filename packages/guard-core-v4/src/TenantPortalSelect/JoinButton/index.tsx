import { React } from 'shim-react'
import { IconFont } from '../../IconFont'
import { TenantButtonProps } from '../interface'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import '../styles.less'

export const ActionButton: React.FC<TenantButtonProps> = ({
  className,
  onClick,
  style,
  icon,
  text
}) => {
  const { t } = useTranslation()
  return (
    <div
      className={classNames('genauth-add-button', className)}
      onClick={onClick}
      style={style}
    >
      <span className="genauth-add-button-icon">
        <IconFont type={icon} />
      </span>
      {text}
    </div>
  )
}
