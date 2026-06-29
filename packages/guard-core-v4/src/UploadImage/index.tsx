import { message, Spin, Upload, PlusOutlined } from 'shim-antd'

import { UploadChangeParam } from 'shim-antd/lib/upload'

import { React } from 'shim-react'

import { useTranslation } from 'react-i18next'

import { useGuardFinallyConfig } from '../_utils/context'

const { useState } = React

export const UploadImage: React.FC<{
  value?: string
  onChange?: (value: string) => void
  uploadText?: string
  accept?: string
  folder?: string
  beforeUpload?: (file: File) => boolean | Promise<boolean>
  onUploaded?: (value: string) => void | Promise<void>
  onUploadFailed?: () => void
}> = ({
  value,
  onChange,
  uploadText,
  accept = 'image/*',
  folder = 'photos',
  beforeUpload,
  onUploaded,
  onUploadFailed
}) => {
  const [uploading, setUploading] = useState(false)
  const { t } = useTranslation()
  const { host } = useGuardFinallyConfig()

  const onStatusChange = async (info: UploadChangeParam) => {
    const { status } = info.file

    if (status === 'uploading') {
      setUploading(true)
      return
    }

    if (status === 'done') {
      const { code, message: errMsg, data } = info.file.response
      if (code !== 200) {
        setUploading(false)
        onUploadFailed?.()
        return message.error(errMsg)
      }
      const { url } = data
      onChange?.(url)
      try {
        await onUploaded?.(url)
      } catch (error) {
        message.error(
          (error as Error)?.message ||
            t('common.uploadFail', {
              name: info.file.name
            })
        )
      } finally {
        setUploading(false)
      }
    } else if (status === 'error') {
      setUploading(false)
      onUploadFailed?.()
      message.error(
        t('common.uploadFail', {
          name: info.file.name
        })
      )
    } else {
      setUploading(false)
    }
  }

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>{uploadText ?? 'Upload'}</div>
    </div>
  )

  return (
    <Upload
      name="file"
      accept={accept}
      listType="picture-card"
      showUploadList={false}
      action={`${host}/api/v2/upload?folder=${encodeURIComponent(folder)}`}
      beforeUpload={async file => {
        const valid = await beforeUpload?.(file)
        if (valid === false) return false
        return valid ?? true
      }}
      onChange={onStatusChange}
    >
      <Spin size="small" spinning={uploading}>
        {value ? (
          <img src={value} alt="" style={{ width: '100%' }} />
        ) : (
          uploadButton
        )}
      </Spin>
    </Upload>
  )
}
