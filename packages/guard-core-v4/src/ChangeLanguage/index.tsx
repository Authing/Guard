import { Dropdown, MenuProps } from 'shim-antd'

// import '@antd-lib-style/dropdown/style/index.less'

import { React } from 'shim-react'

import { useTranslation } from 'react-i18next'

import { IconFont } from '../IconFont'

import { Lang } from '../Type'

import { useGuardFinallyConfig, useGuardPageConfig } from '../_utils/context'

import { fallbackLng } from '../_utils/locales'

import './style.less'

const { useMemo } = React

export const LngTextMapping: Record<
  Lang,
  {
    label: string
  }
> = {
  'zh-CN': {
    label: '简体中文'
  },
  'zh-TW': {
    label: '繁體中文'
  },
  'en-US': {
    label: 'English'
  },
  'ja-JP': {
    label: '日本語'
  }
}

export const ChangeLanguage = (props: {
  onLangChange?: (lang: Lang) => void
  langRange?: Lang[]
}) => {
  const { langRange = ['zh-CN', 'zh-TW', 'en-US', 'ja-JP'] } = props

  const { onLangChange } = props

  const { i18n } = useTranslation()

  const guardPageConfig = useGuardPageConfig()

  const config = useGuardFinallyConfig()

  const languageTextClassName = useMemo(() => {
    return `g2-change-language-text ${config.mode}`
  }, [config])

  const showChangeLng = useMemo(() => {
    return guardPageConfig.global?.showChangeLanguage
  }, [guardPageConfig])

  const currentLng = useMemo<Lang>(() => {
    if (Object.keys(LngTextMapping).includes(i18n.language)) {
      return i18n.language as Lang
    } else {
      return (fallbackLng(i18n.language)[0] || 'en-US') as Lang
    }
  }, [i18n.language])

  const currentLngText = useMemo(() => {
    return (
      <>
        <span>{LngTextMapping[currentLng].label}</span>
      </>
    )
  }, [currentLng])

  const items = useMemo(() => {
    return Object.keys(LngTextMapping)
      .filter(lng => langRange.includes(lng as Lang))
      .map(lng => {
        return {
          key: lng,
          label: LngTextMapping[lng as Lang].label
        }
      })
  }, [langRange])

  if (!showChangeLng || langRange.length === 0) {
    return null
  }

  const handleMenuClick: MenuProps['onClick'] = (e: any) => {
    if (currentLng !== e.key) {
      i18n.changeLanguage(e.key)
      onLangChange?.(e.key)
    }
  }

  const menuProps = {
    items,
    onClick: handleMenuClick
  }

  return (
    <div className="g2-change-language-container">
      <Dropdown
        menu={menuProps}
        trigger={['click']}
        placement="bottom"
        overlayClassName="authing-g2-change-language-menu"
      >
        <span className={languageTextClassName}>
          {currentLngText}
          <IconFont
            type="authing-arrow-down-s-fill"
            className="down-fill-svg"
          />
        </span>
      </Dropdown>
    </div>
  )
}
