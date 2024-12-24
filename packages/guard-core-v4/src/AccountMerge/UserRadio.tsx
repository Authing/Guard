import { React } from 'shim-react'
import { useTranslation } from 'react-i18next'
import { ImagePro } from '../ImagePro'
import { UserRadioItemProps, UserRadioProps } from './interface'
import './styles.less'

export const UserRadioItem: React.FC<UserRadioItemProps> = props => {
  const {
    value,
    onClick,
    displayName,
    avatar,
    selected,
    username,
    name,
    phone,
    email
  } = props
  const { t } = useTranslation()
  return (
    <>
      <div
        className={`user-item ${selected ? 'selected' : ''}`}
        onClick={() => onClick?.(value)}
        key={`user-radio-item-${value}`}
        style={{
          cursor: selected ? 'not-allowed' : ''
        }}
      >
        <ImagePro src={avatar} size={32} borderRadius={16} />
        <span style={{ marginLeft: 8 }}>{displayName}</span>
      </div>
      <div className="user-desc">
        <label>
          {t('user.name')} <span>{name}</span>
        </label>
        <label>
          {t('user.username')} <span>{username}</span>
        </label>
      </div>
      <div className="user-desc">
        <label>
          {t('user.email')} <span>{email}</span>
        </label>
        <label>
          {t('user.phone')} <span>{phone}</span>
        </label>
      </div>
    </>
  )
}

export const UserRadio: React.FC<UserRadioProps> = props => {
  const { currentUserInfo, existingUserInfo, value, onChange } = props

  return (
    <>
      <UserRadioItem
        {...currentUserInfo}
        value={false}
        selected={value === false}
        onClick={value => {
          onChange?.(value)
        }}
      />

      <UserRadioItem
        {...existingUserInfo}
        value={true}
        selected={value === true}
        onClick={value => {
          onChange?.(value)
        }}
      />
    </>
  )
}
