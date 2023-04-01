import { React } from 'shim-react'

import { Drawer } from 'shim-antd'

import { i18n } from '../../../_utils'

import { PushLoginGuideSelector } from './PushLoginGuideSelector'

import { HowBindClient } from './HowBindClient'

import { HowUsePushLogin } from './HowUsePushLogin'

import { HowGetAppLoginUrl } from './HowGetAppLoginUrl'

import { PushLoginGudeModalProps, Selector, SelectorOption, SelectorOptions } from './types'

import { useMediaSize } from '../../../_utils/hooks'

import { IconFont } from '../../../IconFont'

const { useMemo, useState } = React

export function PushLoginGudeModal(props: PushLoginGudeModalProps) {
  const { visible, onClose } = props

  const { t } = i18n

  const howBindClient = t('login.howBindClient')

  const howGetAppLoginUrl = t('login.howGetAppLoginUrl')

  const howUsePushLogin = t('login.howUsePushLogin')

  const [selector, setSelector] = useState<Selector>('howUsePushLogin')

  const { isPhoneMedia } = useMediaSize()

  const selectorOptions = useMemo<SelectorOptions>(() => {
    return [
      {
        value: 'howUsePushLogin',
        label: howUsePushLogin
      },
      {
        value: 'howBindClient',
        label: howBindClient
      },
      {
        value: 'howGetAppLoginUrl',
        label: howGetAppLoginUrl
      }
    ]
  }, [howUsePushLogin, howBindClient, howGetAppLoginUrl])

  const onSelectorChange = (value: Selector) => {
    const selector = selectorOptions.find((option: SelectorOption) => option.value === value)
    if (selector) {
      setSelector(selector.value)
    }
  }

  const componentMap = {
    howBindClient: <HowBindClient />,
    howGetAppLoginUrl: <HowGetAppLoginUrl />,
    howUsePushLogin: <HowUsePushLogin />
  }

  return (
    <Drawer
      title={
        <PushLoginGuideSelector
          defaultValue="howUsePushLogin"
          onChange={onSelectorChange}
          options={selectorOptions}
        />
      }
      placement="right"
      onClose={onClose}
      open={visible}
      width={isPhoneMedia ? '375' : '640'}
      closeIcon={<IconFont type="authing-close-line" />}
    >
      {componentMap[selector]}
    </Drawer>
  )
}
