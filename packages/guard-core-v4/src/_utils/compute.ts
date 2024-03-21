import { RegisterSortMethods, RegisterMethods } from '../Type'

import UAParser from 'ua-parser-js'

import qs from 'qs'

// 拼接请求链接
export const assembledRequestHost = (
  requestHostname: string,
  configHost: string
) => {
  const identifier = requestHostname.split('.')[0]

  const hostUrl = new URL(configHost)
  const splitHost = hostUrl.hostname.split('.')

  splitHost.shift()

  // 看看是否有端口号
  const port = hostUrl.port

  return `${hostUrl.protocol}//${identifier}.${splitHost.join('.')}${
    port && `:${port}`
  }`
}

export const getHundreds = (num: number) => {
  return Math.floor(num / 100)
}

export const transformSortMethod = (method: RegisterSortMethods | string) => {
  switch (method) {
    case RegisterSortMethods.Email:
      return RegisterMethods.Email
    case RegisterSortMethods.EmailCode:
      return RegisterMethods.EmailCode
    case RegisterSortMethods.Phone:
      return RegisterMethods.Phone
    default:
      return method
  }
}

// 微信内置浏览器
export const isWeChatBrowser = () => {
  if (typeof navigator === 'undefined') {
    return null
  }
  return (
    /MicroMessenger/i.test(navigator?.userAgent) &&
    !/wxwork/i.test(navigator.userAgent)
  )
}

export const isLarkBrowser = () => {
  if (typeof navigator === 'undefined') {
    return null
  }
  return /Lark/i.test(navigator.userAgent)
}

export const isQtWebEngine = () => {
  if (typeof navigator === 'undefined') {
    return null
  }
  return /QtWebEngine/i.test(navigator.userAgent)
}

export const isXiaomiBrowser = () => {
  if (typeof navigator === 'undefined') {
    return null
  }
  return /MiuiBrowser/i.test(navigator.userAgent)
}
export const isDingtalkBrowser = () => {
  if (typeof navigator === 'undefined') {
    return null
  }
  return /dingtalk/i.test(navigator.userAgent)
}
export const isQQBrowser = () => {
  if (typeof navigator === 'undefined') {
    return null
  }
  return /MQQBrowser/i.test(navigator.userAgent)
}
// qq 内置浏览器
export const isQQBuiltInBrowser = () => {
  if (typeof navigator === 'undefined') {
    return null
  }
  return / QQ/i.test(navigator.userAgent)
}
// 企业微信内置浏览器
export const isWeWorkBuiltInBrowser = () => {
  if (typeof navigator === 'undefined') {
    return null
  }
  return (
    /MicroMessenger/i.test(navigator.userAgent) &&
    /wxwork/i.test(navigator.userAgent)
  )
}
// 特殊浏览器 后续可能会增加

export const isEdgeBrowser = () => {
  const parser = UAParser()

  return parser.browser.name === 'Edge'
}

export const isWeiboBrowser = () => {
  if (typeof navigator === 'undefined') {
    return null
  }
  return /Weibo/i.test(navigator.userAgent)
}

export const isAlipayBrowser = () => {
  if (typeof navigator === 'undefined') {
    return null
  }
  return /Alipay/i.test(navigator.userAgent)
}

export const isBaiduBrowser = () => {
  if (typeof navigator === 'undefined') {
    return null
  }
  return /Baidu/i.test(navigator.userAgent)
}

export const isWeComeBrowser = () => /wxwork/i.test(navigator.userAgent)

export const isMobile = () => {
  return window.navigator.userAgent.match(
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
  )
}

// win10 上的 webview
export const isWebview = () => {
  return window.navigator.userAgent.match(/webview/i)
}

/* 利用浏览器的 UA 判断是否为不支持弹窗的特殊浏览器 */
export const isSpecialBrowser = () => {
  // 1. 首先筛选出一定是特殊浏览器的 UA
  if (
    isWeChatBrowser() ||
    isWeComeBrowser() ||
    isLarkBrowser() ||
    isDingtalkBrowser() ||
    isQtWebEngine() ||
    isXiaomiBrowser() ||
    isQQBrowser() ||
    isMobile() ||
    isWebview()
  ) {
    return true
  }

  // 2. 利用 ua-parser-js 进一步判断，筛选出很可能不是特殊浏览器的 UA
  // 由于一些特殊浏览器也可能会被误判为非特殊，所以需要首先经过第 1 步筛选
  const parser = UAParser()
  const nonSpecialBrowsers = [
    'Chrome',
    'Firefox',
    'Safari',
    'Opera',
    'IE',
    'Edge'
  ]
  if (nonSpecialBrowsers.includes(parser.browser.name ?? '')) {
    return false
  }

  // 3. 可能有一些 UA 没有任何特征，这种情况下一律默认为特殊浏览器
  return true
}

export const getPhoneInLoginPageContext = () => {
  const search = qs.parse(window.location.search, {
    ignoreQueryPrefix: true
  })

  try {
    if (search.login_page_context) {
      const customData = JSON.parse(search.login_page_context as string)
      return customData.phone || ''
    }
  } catch (e) {
    return ''
  }
}
