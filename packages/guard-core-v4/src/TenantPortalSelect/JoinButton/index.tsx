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
      className={classNames('authing-add-button', className)}
      onClick={onClick}
      style={style}
    >
      <span className="authing-add-button-icon">
        <IconFont type={icon} />
      </span>
      {text}
    </div>
  )
}
