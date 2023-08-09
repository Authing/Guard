import { React } from 'shim-react'

import className from 'classnames'

import './index.less'

import { useImage } from './hooks/useImage'

import { useStatus } from './hooks/useStatus'

import { ShieldSpin } from '../ShieldSpin'

import { CodeStatusDescriptions } from './WorkQrCode'

import { useTranslation } from 'react-i18next'

const { useMemo } = React

// 目前 UI 支持的状态（满载）
export type CodeStatus =
  | 'loading'
  | 'ready'
  | 'already'
  | 'success'
  | 'error'
  | 'expired'
  | 'cancel'
  | 'MFA'

export const prefix = 'refactor'

export interface UiQrProps {
  /**
   * Loading 组件
   */
  loadingComponent?: React.ReactElement
  /**
   * 二维码组件三种状态
   * ready 准备状态
   * already 已扫描状态
   * success 扫描成功/登录成功状态
   * error 错误状态（超时、网络错误）
   */
  status: CodeStatus
  /**
   * 二维码 URL
   */
  src?: string
  /**
   * 二维码底部内容
   */
  descriptions: CodeStatusDescriptions
  /**
   * 外层 container 样式
   */
  containerStyle?: React.CSSProperties
  /**
   * 内层 container 样式(图片)
   */
  imageStyle?: React.CSSProperties
  /**
   * 二维码图片准备好的回调
   */
  onLoad?: () => void
  /**
   * 点击遮罩中的内容区
   * status 当前组件所处状态
   */
  onClickMaskEl?: (status: CodeStatus) => void
  /**
   * 点击全部遮罩区域
   * status 当前组件所处状态
   */
  onMaskContent?: (status: CodeStatus) => void
}

const QrCode: React.FC<UiQrProps> = props => {
  const {
    status,
    loadingComponent,
    src,
    descriptions,
    containerStyle,
    imageStyle,
    onLoad,
    onClickMaskEl,
    onMaskContent
  } = props
  const { t } = useTranslation()
  const [statusCls, statusComponent] = useStatus(status)

  const [baseUrl] = useImage(src, {
    onLoad
  })
  const classPrefix: any = `${prefix}-qrcode`
  const classes = className(classPrefix, statusCls)

  const Loading = useMemo(() => {
    return loadingComponent || <ShieldSpin />
  }, [loadingComponent])

  return (
    <div className={classes} style={containerStyle}>
      {status === 'loading' ? (
        Loading
      ) : (
        <>
          <span
            className={`${prefix}__image-wrapper`}
            onClick={() => onMaskContent && onMaskContent(status)}
          >
            {statusComponent && (
              <div className={`${prefix}-qrcode__mask`}>
                {React.cloneElement(statusComponent as React.ReactElement, {
                  onClick: (e: React.MouseEvent) => {
                    onClickMaskEl && onClickMaskEl(status)
                    ;(statusComponent as React.ReactElement).props.onClick?.(e)
                  }
                })}
              </div>
            )}
            <img
              className={`${prefix}__image`}
              src={baseUrl}
              alt={t('common.qrcode') as string}
              style={imageStyle}
            />
          </span>
          {/* 统一的处理模板 */}
          <div className={`${prefix}__desc`}>{descriptions[status]}</div>
        </>
      )}
    </div>
  )
}

const UiQrCode = React.memo(QrCode)

export { UiQrCode }
