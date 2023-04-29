import { React } from 'shim-react'

import i18n, { InitOptions, Resource } from 'i18next'

import { initReactI18next } from 'react-i18next'

import LanguageDetector from 'i18next-browser-languagedetector'

import * as enUsTrans from './en-us'

import * as zhCnTrans from './zh-cn'

import * as zhTwTrans from './zh-tw'

import * as jaJpTrans from './ja-jp'

import { Lang } from '../../Type'

const LanguageResources: Resource = {
  'en-US': { translation: enUsTrans },
  'zh-CN': { translation: zhCnTrans },
  'zh-TW': { translation: zhTwTrans },
  'ja-JP': { translation: jaJpTrans }
}

export interface InitGuardI18nOptions {
  // 默认显示
  defaultLanguage?: Lang | 'browser'
}

// fackbackLang

export const fallbackLng = (code = '') => {
  if (!code || code === 'en') return ['en-US']

  if (!code || code === 'zh') return ['zh-CN']

  if (!code || code === 'ja') return ['ja-JP']

  const fallbacks = []

  if (code.startsWith('en-')) {
    fallbacks.push('en-US')
    return fallbacks
  }

  if (code.startsWith('ja-')) {
    fallbacks.push('ja-JP')
    return fallbacks
  }

  if (code.startsWith('zh-')) {
    if (
      ['zh-tw', 'zh-hk', 'zh-mo', 'zh-hant'].includes(code.toLocaleLowerCase())
    ) {
      fallbacks.push('zh-TW')
    } else if (['zh-cn', 'zh-sg', 'zh-my'].includes(code.toLocaleLowerCase())) {
      fallbacks.push('zh-CN')
    } else {
      fallbacks.push('zh-CN')
    }

    return fallbacks
  }

  return ['en-US']
}

export const initGuardI18n = async (
  options: InitGuardI18nOptions,
  callback: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const { defaultLanguage } = options

  const detectionOrder: string[] = []

  let lng: Lang | undefined = undefined

  // 如果需要跟随浏览器语言, 则添加到监测顺序
  if (defaultLanguage === 'browser') {
    detectionOrder.push(
      ...[
        'querystring',
        'cookie',
        'navigator',
        'localStorage', //不保存用户所选语言 刷新重新走浏览器语言检测
        'htmlTag',
        'path',
        'subdomain'
      ]
    )
  } else {
    // 此处 defaultLanguage 可能为 Lng 也可能是 undefined
    lng = defaultLanguage
  }

  // 统一拼装一下 i18n 的 options
  const i18nOptions: InitOptions = {
    // 默认语言
    lng,
    detection: {
      order: detectionOrder,
      lookupLocalStorage: '_guard_i18nextLng' //与console主要业务i18n相关的key脱离
    },
    resources: LanguageResources,
    // 兜底语言
    fallbackLng,
    debug: false,
    interpolation: {
      escapeValue: false
    }
  }

  // 开始初始化了嗷~
  await i18n.use(LanguageDetector).use(initReactI18next).init(i18nOptions)
  // 告知外部i18n初始化完成
  callback(true)
}

export { i18n }
