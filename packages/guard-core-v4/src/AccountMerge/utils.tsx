import { User } from 'authing-js-sdk'
import { mailDesensitization } from '../_utils'

export const getDisplayName = (user: User) => {
  return (
    (user = user || {}),
    user.nickname ||
      user.username ||
      user.name ||
      user.givenName ||
      user.familyName ||
      user.email ||
      user.phone ||
      user.id
  )
}

export const getDisplayNameByEmail = (displayName: string) => {
  if (
    /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/.test(displayName)
  ) {
    return mailDesensitization(displayName)
  }
  return displayName
}
