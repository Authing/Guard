import { PlusOutlined, message, Spin, Upload } from 'shim-antd'

import { UploadChangeParam } from 'shim-antd/lib/upload'

import { React } from 'shim-react'

import { useTranslation } from 'react-i18next'

import { useGuardFinallyConfig } from '../_utils/context'

const { useState } = React

export const UploadImage: React.FC<{
  value?: string
  onChange?: (value: string) => void
}> = ({ value, onChange }) => {
  const [uploading, setUploading] = useState(false)
  const { t } = useTranslation()
  const { host } = useGuardFinallyConfig()

  const onStatusChange = (info: UploadChangeParam) => {
    const { status } = info.file

    if (status === 'uploading') {
      setUploading(true)
    } else {
      setUploading(false)
    }

    if (status === 'done') {
      const { code, message: errMsg, data } = info.file.response
      if (code !== 200) {
        return message.error(errMsg)
      }
      const { url } = data
      onChange?.(url)
    } else if (status === 'error') {
      message.error(
        t('common.uploadFail', {
          name: info.file.name
        })
      )
    }
  }

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  )

  return (
    <Upload
      name="file"
      accept="image/*"
      listType="picture-card"
      showUploadList={false}
      action={`${host}/api/v2/upload?folder=photos`}
      onChange={onStatusChange}
    >
      <Spin size="small" spinning={uploading}>
        {value ? <img src={value} alt="" style={{ width: '100%' }} /> : uploadButton}
      </Spin>
    </Upload>
  )
}
