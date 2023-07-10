import { React } from 'shim-react'

import { useMediaQuery } from 'react-responsive'

import phone from 'phone'

import {
  isDingtalkBrowser,
  isLarkBrowser,
  // isQQBrowser,
  isQQBuiltInBrowser,
  isSpecialBrowser,
  isWeChatBrowser,
  isWeWorkBuiltInBrowser
} from '../compute'

import { GuardLocalConfig } from '../../Guard'

import { getGuardWindow } from '../../Guard/core/useAppendConfig'

import {
  ApplicationConfig,
  SocialConnectionItem,
  SocialConnectionProvider
} from '../../Type/application'
export interface PhoneValidResult {
  isValid: boolean
  phoneNumber: string
  countryIso2: string
  countryIso3: string
  countryCode: string
}

// 某些社会化登录会在 tabs 中显示，或者无法在 Guard 中使用，所以底部不显示了
export const HIDE_SOCIALS = [
  'wechat:miniprogram:app-launch',
  'wechat:miniprogram:qrconnect',
  // 'wechat:webpage-authorization',
  'wechat:miniprogram:default',
  'wechatwork:addressbook',
  'wechat:mobile'
]

export const HIDE_SOCIALS_SHOWIN_ENTERPRISE = [
  'dingtalk',
  'lark-public',
  'lark-internal',
  'wechatwork:corp:qrconnect',
  'wechatwork:service-provider:qrconnect',
  'wechatwork:agency:qrconnect',
  'wechatwork:qrconnect:of:authing:agency',
]

let thisAppId = ''

const { useRef, useCallback, useEffect } = React

export const useAppId = (appId?: string) => {
  if (appId) {
    thisAppId = appId
  }

  return thisAppId
}

export const useDebounce = (
  // 回调函数
  fn: any,
  // 延迟时间
  delay: number
) => {
  const timer = useRef<{ time: any }>({ time: null })
  const errorBody = useRef<{ body: any }>({ body: null })

  useEffect(() => {
    return () => {
      timer.current.time && clearInterval(timer.current.time)
    }
  }, [])

  return useCallback(
    (...args: any[]) => {
      if (timer.current.time) {
        clearTimeout(timer.current.time)
        timer.current.time = null
      }
      timer.current.time = setTimeout(() => {
        // fn.apply(this, args);
        const res = fn(...args)
        timer.current.time = null
        errorBody.current.body = res
      }, delay)
      // if (errorBody.current.body) {
      //   return Promise.reject(errorBody.current.body)
      // } else {
      //   return Promise.resolve()
      // }
    },
    [timer.current, delay]
  )
}

export const useMediaSize = () => {
  const isPhoneMedia = useMediaQuery({
    maxWidth: 450
  })

  return {
    isPhoneMedia
  }
}
// shaking 抖动
export const useShaking = () => {
  // form input
  const inputs = document.getElementsByClassName('authing-g2-input')
  // 必选协议
  const agreements = document.getElementsByClassName(
    'authing-agreements-item-invalid'
  )
  const saftyCode = document.getElementsByClassName('authing-g2-code-input')

  const bindTotpSecretSave = document.getElementsByClassName(
    'g2-mfa-bindTotp-secretSave'
  )
  // 挂载 shaking
  const MountShaking = () => {
    Array.from(inputs).forEach(input => {
      input.classList.add('shaking')
    })
    Array.from(agreements).forEach(agreement => {
      agreement.classList.add('shaking')
    })
    saftyCode[0] && saftyCode[0].classList.add('shaking')
    bindTotpSecretSave[0] && bindTotpSecretSave[0].classList.add('shaking')
  }
  // 卸载 shaking
  const UnMountShaking = () => {
    Array.from(inputs).forEach(input => {
      input.classList.remove('shaking')
    })
    Array.from(agreements).forEach(agreement => {
      agreement.classList.remove('shaking')
    })
    saftyCode[0] && saftyCode[0].classList.remove('shaking')
    bindTotpSecretSave[0] && bindTotpSecretSave[0].classList.remove('shaking')
  }
  return { MountShaking, UnMountShaking }
}

/**
 * 解析手机号
 * @param fieldValue 字段值
 * @param areaCode 区号
 * @returns
 */
export const parsePhone = (
  isInternationSms: boolean,
  fieldValue: string,
  areaCode = 'CN'
) => {
  let countryCode = undefined

  let phoneNumber = fieldValue
  // 未开启国家化短信
  if (!isInternationSms) {
    return { phoneNumber, countryCode: undefined }
  }
  // 处理 类似 192*******9 情况
  if (phone(fieldValue, { country: areaCode }).isValid) {
    const parsePhone = phone(fieldValue, {
      country: areaCode
    }) as PhoneValidResult

    countryCode = parsePhone.countryCode as string

    phoneNumber = parsePhone.phoneNumber.split(countryCode)[1]
  } else if (phone(fieldValue).isValid) {
    // 处理 +86 19294229909 情况
    const parsePhone = phone(fieldValue) as PhoneValidResult

    countryCode = parsePhone.countryCode as string

    phoneNumber = parsePhone.phoneNumber.split(countryCode)[1]
  }

  return { countryCode, phoneNumber }
}

export enum SocialConnectionEvent {
  Message = 'message',
  Auth = 'auth'
}

/**
 *
 * @param config
 * @returns[socialConnectionObjs 社交身份源连接对象 enterpriseConnectionObjs 企业身份源连接对象 isNoMethod 是否没有身份源 ]
 */
export const useMethod: (params: {
  config: GuardLocalConfig
  publicConfig: ApplicationConfig
}) => any = ({ config, publicConfig }) => {
  const noLoginMethods = !config?.loginMethods?.length
  let enterpriseConnectionObjs: ApplicationConfig['identityProviders']
  if (config.enterpriseConnections) {
    enterpriseConnectionObjs =
      publicConfig?.identityProviders?.filter?.(item =>
        config.enterpriseConnections!.includes(item.identifier)
      ) || []
  } else {
    enterpriseConnectionObjs = publicConfig?.identityProviders || []
  }

  let socialConnectionObjs: (SocialConnectionItem & { action?: string })[]

  if (!config.socialConnections) {
    socialConnectionObjs = [...(publicConfig?.socialConnections || [])]
  } else {
    const socials = config.socialConnections
    socialConnectionObjs =
      publicConfig?.socialConnections?.filter?.(item =>
        socials.includes(item.provider)
      ) ?? []
  }

  socialConnectionObjs = socialConnectionObjs
    ?.filter(item => {
      // 某些社会化登录会在 tabs 中显示，或者无法在 Guard 中使用，所以底部不显示了
      return !HIDE_SOCIALS.includes(item.provider)
    })
    .filter((item: any) => {
      // 某些在企业身份源创建的社交身份源归为企业身份源方式显示
      if (HIDE_SOCIALS_SHOWIN_ENTERPRISE.includes(item.provider)) {
        if (
          !enterpriseConnectionObjs.find(
            (connection: any) => connection.identifier === item.identifier
          )
        ) {
          enterpriseConnectionObjs.push(item)
        }
        return false
      }
      return true
    })

  // 在所有身份源下都要隐藏
  const hiddenSocialConnection = [
    'wechat:mobile',
    'wechat:miniprogram:app-launch',
    'wechat:miniprogram:default',
    'apple',
    'yidun'
  ]

  switch (true) {
    // 微信内置浏览器
    case isWeChatBrowser():
      // 显示 点击提示
      const wechatDisplayButtonsMessage = [
        SocialConnectionProvider.WECHATPC,
        SocialConnectionProvider.GITHUB,
        SocialConnectionProvider.QQ,
        SocialConnectionProvider.APPLE_WEB,
        SocialConnectionProvider.ALIPAY,
        SocialConnectionProvider.LINKEDIN,
        SocialConnectionProvider.BAIDU,
        SocialConnectionProvider.GOOGLE,
        SocialConnectionProvider.WEIBO,
        SocialConnectionProvider.FACEBOOK,
        SocialConnectionProvider.SLACK,
        SocialConnectionProvider.DINGTALK,
        'wechatwork:mobile',
        'instagram',
        'qingcloud',
        'gitee',
        'gitlab'
      ]

      // 各个浏览器下特殊的身份源隐藏规则
      const hiddenSocialConnectionInWeChatBrowser: string[] = [
        SocialConnectionProvider.WECHATPC
      ]

      socialConnectionObjs = socialConnectionObjs
        .filter(
          item =>
            ![
              ...hiddenSocialConnection,
              ...hiddenSocialConnectionInWeChatBrowser
            ].includes(item.provider)
        )
        .map(item => {
          if (wechatDisplayButtonsMessage.includes(item.provider)) {
            item.action = SocialConnectionEvent.Message
          } else {
            item.action = SocialConnectionEvent.Auth
          }
          return item
        })
      enterpriseConnectionObjs = enterpriseConnectionObjs
        .filter(
          (item: any) =>
            !(item?.provider && hiddenSocialConnection.includes(item.provider))
        )
        .map((item: any) => {
          if (wechatDisplayButtonsMessage.includes(item.provider)) {
            item.action = SocialConnectionEvent.Message
          } else {
            item.action = SocialConnectionEvent.Auth
          }
          return item
        })
      break
    // qq 内置浏览器
    case isQQBuiltInBrowser():
      const qqbuiltDisplayButtonsMessage = [
        SocialConnectionProvider.WECHATPC,
        SocialConnectionProvider.WECHATMP,
        SocialConnectionProvider.APPLE_WEB,
        SocialConnectionProvider.GOOGLE,
        SocialConnectionProvider.ALIPAY,
        SocialConnectionProvider.WECHATWORK_CORP_QRCONNECT,
        SocialConnectionProvider.DINGTALK,
        'wechatwork:agency:qrconnect',
        'wechatwork:mobile'
      ]
      // 各个浏览器下特殊的身份源隐藏规则
      const hiddenSocialConnectionInQQBuiltInBrowser = [
        SocialConnectionProvider.WECHATMP
      ]
      socialConnectionObjs = socialConnectionObjs
        .filter(
          item =>
            ![
              ...hiddenSocialConnection,
              ...hiddenSocialConnectionInQQBuiltInBrowser
            ].includes(item.provider)
        )
        .map(item => {
          if (qqbuiltDisplayButtonsMessage.includes(item.provider)) {
            item.action = SocialConnectionEvent.Message
          } else {
            item.action = SocialConnectionEvent.Auth
          }
          return item
        })
      enterpriseConnectionObjs = enterpriseConnectionObjs
        .filter(
          (item: any) =>
            !(item?.provider && hiddenSocialConnection.includes(item.provider))
        )
        .map((item: any) => {
          if (qqbuiltDisplayButtonsMessage.includes(item.provider)) {
            item.action = SocialConnectionEvent.Message
          } else {
            item.action = SocialConnectionEvent.Auth
          }
          return item
        })
      break
    // 企业微信内置浏览器
    case isWeWorkBuiltInBrowser():
      const weWorkBuiltDisplayButtonsMessage = [
        SocialConnectionProvider.WECHATPC,
        SocialConnectionProvider.WECHATMP,
        SocialConnectionProvider.GITHUB,
        SocialConnectionProvider.QQ,
        SocialConnectionProvider.APPLE_WEB,
        SocialConnectionProvider.ALIPAY,
        SocialConnectionProvider.LINKEDIN,
        SocialConnectionProvider.BAIDU,
        SocialConnectionProvider.GOOGLE,
        SocialConnectionProvider.WEIBO,
        SocialConnectionProvider.FACEBOOK,
        SocialConnectionProvider.SLACK,
        SocialConnectionProvider.DINGTALK,
        'wechatwork:mobile',
        'instagram',
        'qingcloud',
        'gitee',
        'gitlab'
      ]
      // 各个浏览器下特殊的身份源隐藏规则
      const hiddenSocialConnectionInWeWorkBuiltInBrowser = [
        SocialConnectionProvider.WECHATMP
      ]
      socialConnectionObjs = socialConnectionObjs
        .filter(
          item =>
            ![
              ...hiddenSocialConnection,
              ...hiddenSocialConnectionInWeWorkBuiltInBrowser
            ].includes(item.provider)
        )
        .map(item => {
          if (weWorkBuiltDisplayButtonsMessage.includes(item.provider)) {
            item.action = SocialConnectionEvent.Message
          } else {
            item.action = SocialConnectionEvent.Auth
          }
          return item
        })
      enterpriseConnectionObjs = enterpriseConnectionObjs
        .filter(
          (item: any) =>
            !(item?.provider && hiddenSocialConnection.includes(item.provider))
        )
        .map((item: any) => {
          if (weWorkBuiltDisplayButtonsMessage.includes(item.provider)) {
            item.action = SocialConnectionEvent.Message
          } else {
            item.action = SocialConnectionEvent.Auth
          }
          return item
        })
      break
    // 钉钉内置浏览器
    case isDingtalkBrowser():
      const dingTalkDisplayButtonsMessage = [
        SocialConnectionProvider.WECHATPC,
        SocialConnectionProvider.WECHATMP,
        SocialConnectionProvider.QQ,
        SocialConnectionProvider.APPLE_WEB,
        SocialConnectionProvider.GOOGLE,
        SocialConnectionProvider.ALIPAY,
        SocialConnectionProvider.WECHATWORK_CORP_QRCONNECT,
        'wechatwork:agency:qrconnect',
        'wechatwork:mobile'
      ]

      // 各个浏览器下特殊的身份源隐藏规则
      const hiddenSocialConnectionInDingtalkBrowser = [
        SocialConnectionProvider.WECHATMP
      ]

      socialConnectionObjs = socialConnectionObjs
        .filter(
          item =>
            ![
              ...hiddenSocialConnection,
              ...hiddenSocialConnectionInDingtalkBrowser
            ].includes(item.provider)
        )
        .map(item => {
          if (dingTalkDisplayButtonsMessage.includes(item.provider)) {
            item.action = SocialConnectionEvent.Message
          } else {
            item.action = SocialConnectionEvent.Auth
          }
          return item
        })
      enterpriseConnectionObjs = enterpriseConnectionObjs
        .filter(
          (item: any) =>
            !(item?.provider && hiddenSocialConnection.includes(item.provider))
        )
        .map((item: any) => {
          if (dingTalkDisplayButtonsMessage.includes(item.provider)) {
            item.action = SocialConnectionEvent.Message
          } else {
            item.action = SocialConnectionEvent.Auth
          }
          return item
        })
      break
    // 飞书内置浏览器
    case isLarkBrowser():
      const larkDisplayButtonsMessage = [
        SocialConnectionProvider.WECHATPC,
        SocialConnectionProvider.WECHATMP,
        SocialConnectionProvider.GITHUB,
        SocialConnectionProvider.QQ,
        SocialConnectionProvider.APPLE_WEB,
        SocialConnectionProvider.ALIPAY,
        SocialConnectionProvider.LINKEDIN,
        SocialConnectionProvider.BAIDU,
        SocialConnectionProvider.GOOGLE,
        SocialConnectionProvider.WEIBO,
        SocialConnectionProvider.FACEBOOK,
        SocialConnectionProvider.SLACK,
        SocialConnectionProvider.DINGTALK,
        'gitlab',
        'gitee',
        'instagram',
        'wechatwork:agency:qrconnect',
        'wechatwork:mobile'
      ]

      // 各个浏览器下特殊的身份源隐藏规则
      const hiddenSocialConnectionInLarkBrowser = [
        SocialConnectionProvider.WECHATMP
      ]

      socialConnectionObjs = socialConnectionObjs
        .filter(
          item =>
            ![
              ...hiddenSocialConnection,
              ...hiddenSocialConnectionInLarkBrowser
            ].includes(item.provider)
        )
        .map(item => {
          if (larkDisplayButtonsMessage.includes(item.provider)) {
            item.action = SocialConnectionEvent.Message
          } else {
            item.action = SocialConnectionEvent.Auth
          }
          return item
        })
      enterpriseConnectionObjs = enterpriseConnectionObjs
        .filter(
          (item: any) =>
            !(item?.provider && hiddenSocialConnection.includes(item.provider))
        )
        .map((item: any) => {
          if (larkDisplayButtonsMessage.includes(item.provider)) {
            item.action = SocialConnectionEvent.Message
          } else {
            item.action = SocialConnectionEvent.Auth
          }
          return item
        })
      break
    // pc 浏览器
    default:
      const pcDisplayButtonsMessage = [
        SocialConnectionProvider.WECHATMP,
        'wechatwork:mobile'
      ]

      // 各个浏览器下特殊的身份源隐藏规则
      const hiddenSocialConnectionInPCBrowser = [
        SocialConnectionProvider.WECHATMP
      ]

      socialConnectionObjs = socialConnectionObjs
        .filter(
          item =>
            ![
              ...hiddenSocialConnection,
              ...hiddenSocialConnectionInPCBrowser
            ].includes(item.provider)
        )
        .map(item => {
          if (pcDisplayButtonsMessage.includes(item.provider)) {
            item.action = SocialConnectionEvent.Message
          } else {
            item.action = SocialConnectionEvent.Auth
          }
          return item
        })
      enterpriseConnectionObjs = enterpriseConnectionObjs
        .filter(
          (item: any) =>
            !(item?.provider && hiddenSocialConnection.includes(item.provider))
        )
        .map((item: any) => {
          if (pcDisplayButtonsMessage.includes(item.provider)) {
            item.action = SocialConnectionEvent.Message
          } else {
            item.action = SocialConnectionEvent.Auth
          }
          return item
        })
      break
  }

  const guardWindow = getGuardWindow()

  if (!guardWindow) return

  if (!config?.isHost && (isSpecialBrowser() || !guardWindow.postMessage)) {
    // 嵌入模式下特殊浏览器不显示所有身份源登录
    socialConnectionObjs = []
    enterpriseConnectionObjs = []
  }

  const isNoMethod: boolean =
    noLoginMethods &&
    (!publicConfig?.ssoPageComponentDisplay.socialLoginBtns ||
      !socialConnectionObjs.length) &&
    (!publicConfig?.ssoPageComponentDisplay.idpBtns ||
      !enterpriseConnectionObjs.length)
  return [socialConnectionObjs, enterpriseConnectionObjs, isNoMethod]
}
