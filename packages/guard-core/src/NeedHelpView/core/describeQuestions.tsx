import { React } from 'shim-react'

import { useTranslation } from 'react-i18next'

import { Form, Input, message, Modal, Progress, Select, Upload } from 'shim-antd'

import SubmitButton from '../../SubmitButton'

import { PlusOutlined } from 'shim-antd'

import { UploadFile } from 'shim-antd/lib/upload/interface'

import { useGuardHttp } from '../../_utils/guardHttp'

import { fieldRequiredRule, validate } from '../../_utils'

import { IconFont } from '../../IconFont'

import { useGuardInitData } from '../../_utils/context'

const { useRef, useState } = React

interface describeQuestionsProps {
  appId: string
  host: string
  onSuccess: any
}

export const DescribeQuestions = (props: describeQuestionsProps) => {
  const { t } = useTranslation()
  const initData = useGuardInitData<{ identify: string }>()
  // 不清楚为什么放出去之后，i18n 的结果全是 undefeated
  const typeProblemMap: any = {
    0: [
      t('common.problem.noVerifyTip.tip'),
      t('common.problem.noVerifyTip.type1'),
      t('common.problem.noVerifyTip.type2'),
      t('common.problem.noVerifyTip.type3')
    ],
    1: [
      t('common.problem.noLoginTips'),
      t('common.problem.noLoginTip.type1'),
      t('common.problem.noLoginTip.type2')
    ],
    2: [
      t('common.problem.noRegisterTip.tip'),
      t('common.problem.noRegisterTip.type1'),
      t('common.problem.noRegisterTip.type2'),
      t('common.problem.noRegisterTip.type3')
    ],
    3: [
      t('common.problem.noAccountTip.tip'),
      t('common.problem.noAccountTip.type1'),
      t('common.problem.noAccountTip.type2')
    ],
    4: [
      t('common.problem.noResetPassTip.tip'),
      t('common.problem.noResetPassTip.type1'),
      t('common.problem.noResetPassTip.type2')
    ],
    5: [t('common.problem.lockedTips')],
    6: []
  }

  const typeOperations = [
    {
      label: t('common.problem.noVerify'),
      value: 0
    },
    {
      label: t('common.problem.noLogin'),
      value: 1
    },
    {
      label: t('common.problem.noRegister'),
      value: 2
    },
    {
      label: t('common.problem.noAccount'),
      value: 3
    },
    {
      label: t('common.problem.noResetPass'),
      value: 4
    },
    {
      label: t('common.problem.locked'),
      value: 5
    },
    {
      label: t('common.problem.other'),
      value: 6
    }
  ]

  const [form] = Form.useForm()
  const { post } = useGuardHttp()
  const [uploadUrl, setUploadUrl] = useState([])
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewImage, setPreviewImage] = useState()
  const [fileList, setFileList] = useState<UploadFile<any>[]>([])
  const [typeProblem, setTypeProblem] = useState(0)
  const submitButtonRef = useRef<any>(null)
  const textMap = typeProblemMap[typeProblem]

  const onFinish = (values: any) => {
    submitButtonRef?.current?.onSpin(true)
    const params = {
      type: typeProblem,
      description: values.description,
      phone: values.identify,
      images: uploadUrl,
      appId: props.appId
    }
    // TODO 暂不支持国际化短信参数
    const context = post('/api/v2/feedback', params)
    context.then(res => {
      if (res.code === 200) {
        submitButtonRef?.current?.onSpin(false)
        props.onSuccess()
      } else {
        submitButtonRef?.current?.onSpin(false)
        message.error(res.message)
      }
    })
  }

  const handlePreview = async (file: any) => {
    let url
    if (file.status === 'error' || file.response) {
      url = await new Promise(resolve => {
        const reader = new FileReader()
        reader.readAsDataURL(file.originFileObj)
        reader.onload = () => resolve(reader.result)
      })
    } else {
      url = file.response.data.url
    }
    // setPreviewImage(file.url);
    // file 没有 url 属性，需要改成下面的用法
    // let url = file.response.data.url
    setPreviewImage(url)
    setPreviewVisible(true)
  }

  return (
    <div className="authing-g2-describe-questions authing-g2-form-required-item-icon-after">
      <Form
        name="resetPassword"
        layout="vertical"
        form={form}
        onFinish={onFinish}
        onFinishFailed={() => {
          submitButtonRef?.current?.onError()
        }}
        autoComplete="off"
      >
        <Form.Item
          validateTrigger={['onBlur', 'onChange']}
          className="authing-g2-input-form"
          name="identify"
          label={t('common.problem.form.phone')}
          validateFirst={true}
          initialValue={initData?.identify}
          rules={[
            ...fieldRequiredRule(t('common.problem.form.phone')),
            {
              validator: async (_, value) => {
                if (!value) {
                  return
                }
                if (validate('email', value) || validate('phone', value)) {
                  return
                } else {
                  throw new Error(t('login.inputCorrectPhoneOrEmail') as string)
                }
              }
            }
          ]}
        >
          <Input
            className="authing-g2-input"
            autoComplete="off"
            size="large"
            placeholder={t('login.inputPhoneOrEmail')}
            prefix={<IconFont type="authing-a-user-line1" style={{ color: '#878A95' }} />}
          />
        </Form.Item>
        <Form.Item
          validateTrigger={['onBlur', 'onChange']}
          className="authing-g2-input-form "
          label={t('common.problem.form.question')}
          name="questionPicker"
          initialValue={typeProblem}
        >
          <Select
            className="authing-g2-select"
            onChange={(value: number) => {
              setTypeProblem(value)
            }}
          >
            {typeOperations?.map(({ value, label }) => (
              // @ts-ignore
              <Select.Option
                key={value}
                value={value}
                className={`authing-g2-question-option ${
                  typeProblem === value ? 'authing-g2-question-option-active' : ''
                }`}
              >
                {label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <div className="authing-g2-input-form">
          {textMap?.map((item: any, index: any) => (
            <div key={index}>{item}</div>
          ))}
        </div>

        <Form.Item
          validateTrigger={['onBlur', 'onChange']}
          className="authing-g2-input-form"
          name="description"
          label={t('common.problem.form.questionDescript')}
        >
          <Input.TextArea
            className="authing-g2-questions-textarea"
            maxLength={200}
            showCount
            rows={4}
            style={{
              marginBottom: 10
            }}
          />
        </Form.Item>

        <div className="authing-g2-input-form">
          <div className="label-title">{t('common.problem.form.questionClip')}</div>
          <div className="g2-questions">
            <Upload
              action={`${props.host}/api/v2/upload?folder=photos`}
              listType="picture-card"
              accept="image/png, image/jpeg, image/jpg"
              className="authing-g2-questions-upload-self"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={(e: any) => {
                setFileList(e.fileList)
                const imgUrl: any = e.fileList.map((item: any) => {
                  const response = item.response
                  return response?.data.url
                })
                setUploadUrl(imgUrl)
              }}
              beforeUpload={(file: any) => {
                if (['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
                  return true
                }
                return Promise.reject(file)
              }}
              itemRender={(n: any, file: any) => {
                return (
                  <>
                    {file.status === 'uploading' ? (
                      <div
                        style={{
                          padding: 6,
                          borderRadius: 2,
                          border: '1px solid #d9d9d9'
                        }}
                      >
                        <Progress
                          showInfo={false}
                          style={{
                            margin: 1
                          }}
                          width={40}
                          type="circle"
                          percent={file.percent}
                        />
                      </div>
                    ) : (
                      n
                    )}
                  </>
                )
              }}
            >
              {fileList.length < 4 && <PlusOutlined />}
            </Upload>
          </div>
        </div>

        <Form.Item className="authing-g2-sumbit-form submit-form">
          <SubmitButton
            className="forget-password"
            text={t('common.problem.form.submit')}
            ref={submitButtonRef}
          />
        </Form.Item>
      </Form>

      <Modal
        visible={previewVisible}
        title={null}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  )
}
