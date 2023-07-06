import Axios from 'axios'
import dayjs from 'dayjs'

const feishuAxios = Axios.create()
export const feishuFeedback = ({
  helpful,
  customReason,
  reasonList,
  docUrl,
  docTitle,
} = {}) => {
  const title = helpful ? '文档被赞啦' : '文档被踩啦'

  const content = [
    [
      {
        tag: 'text',
        text: `时间：${dayjs().format('YYYY-MM-DD HH:mm:ss')}`,
      },
    ],
    [
      {
        tag: 'text',
        text: '文档标题：',
      },
      {
        tag: 'text',
        text: docTitle || '未知文档标题',
      },
    ],
    [
      {
        tag: 'text',
        text: '文档链接：',
      },
      {
        tag: 'text',
        text: docUrl || '未知链接',
      },
    ],
  ]

  if (reasonList) {
    reasonList.forEach((rea, index) => {
      content.push([
        {
          tag: 'text',
          text: `被踩理由 ${index + 1}：`,
        },
        {
          tag: 'text',
          text: rea,
        },
      ])
    })
  }

  if (customReason) {
    content.push([
      {
        tag: 'text',
        text: `反馈详情：${customReason}`,
      },
    ])
  }

  return feishuAxios.post(
    `https://open.feishu.cn/open-apis/bot/v2/hook/f5e7517d-07cb-4519-ab6c-577ad8653ca2`,
    {
      msg_type: 'post',
      content: {
        post: {
          zh_cn: {
            title,
            content,
          },
        },
      },
    }
  )
}
