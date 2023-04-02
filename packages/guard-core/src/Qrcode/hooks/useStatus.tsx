import { React } from 'shim-react'

import { useTranslation } from 'react-i18next'

import { IconFont } from '../../IconFont'

import { CodeStatus, prefix } from '../UiQrCode'

const { useMemo } = React

/**
 * 根据不同状态添加不同的元素
 * 维护不同状态的处理
 */
const useStatus = (status: CodeStatus) => {
  const classes = `${prefix}-qrcode--${status}`

  const { t } = useTranslation()

  /**
   * 不同状态的中间组件
   * TODO: 应该外部传入 具体看后续需求吧，如果有非统一状态外部覆盖
   * 否则保持内部统一模板无需改动
   */
  const componentMapping = useMemo(() => {
    const mapping: Record<CodeStatus, React.ReactNode> = {
      loading: null,
      ready: null,
      already: (
        <>
          <IconFont type="authing-checkbox-circle-fill" style={{ width: '40px', height: '40px' }} />
          <span className={`${prefix}-inner__title--already`}>{t('login.scanSuccess')}</span>
        </>
      ),
      cancel: (
        <>
          <IconFont type="authing-refer-qr-code" style={{ width: '40px', height: '40px' }} />
          <span className={`${prefix}-inner__title--refer`}>{t('login.qrcodeRefer')}</span>
        </>
      ),
      expired: (
        <>
          <IconFont type="authing-refer-qr-code" style={{ width: '40px', height: '40px' }} />
          <span className={`${prefix}-inner__title--refer`}>{t('login.qrcodeRefer')}</span>
        </>
      ),
      error: (
        <>
          <IconFont type="authing-refer-qr-code" style={{ width: '40px', height: '40px' }} />
          <span className={`${prefix}-inner__title--refer`}>{t('login.qrcodeNetWorkError')}</span>
        </>
      ),
      success: (
        <>
          <IconFont type="authing-checkbox-circle-fill" style={{ width: '40px', height: '40px' }} />
          <span className={`${prefix}-inner__title--already`}>{t('login.scanSuccess')}</span>
        </>
      ),
      MFA: null
    }
    return mapping[status]
  }, [status, t])

  return [classes, componentMapping]
}

export { useStatus }
