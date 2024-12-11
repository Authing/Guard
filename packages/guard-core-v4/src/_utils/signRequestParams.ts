import CryptoJs from 'crypto-js'

export const generateRandomStr = (length = 12) => {
  const charset =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let randomString = ''
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length)
    randomString += charset[randomIndex]
  }
  return randomString
}

export const md5 = (text: string) => {
  return CryptoJs.MD5(text).toString()
}

export const signRequestParams = (params: Record<string, any>) => {
  const random = generateRandomStr()
  const timestamp = Date.now()

  const newParams = Object.assign(params, {
    _random: random,
    _timestamp: timestamp
  })

  const sign = md5(JSON.stringify(newParams))

  return Object.assign(newParams, {
    _sign: sign
  })
}
