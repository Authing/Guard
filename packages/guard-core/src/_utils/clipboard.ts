import { i18n } from './locales'

// https://juejin.im/post/6844903857290477582
export const copyToClipboard = (str: string) => {
  const el = document.createElement('textarea') // 创建一个 <textarea> 元素
  el.value = str // 设置它的值为你想复制的字符串
  el.setAttribute('readonly', '') // 设置为只读以防止干扰
  el.style.position = 'absolute'
  el.style.left = '-9999px' // 移出屏幕外以使其不可见
  document.body.appendChild(el) // 插入 <textarea> 元素到 HTML 文档中
  try {
    const selected =
      document.getSelection()!.rangeCount > 0 // 检查是否之前曾选中过内容
        ? document.getSelection()!.getRangeAt(0) // 如果找到，则保存选中
        : false // 标记为  false 以表示不存在之前选中的内容
    el.select() // 选中 <textarea> 的内容
    document.execCommand('copy') // 复制 - 仅当作为用户操作的响应结果时才可以工作(比如，点击事件)
    el && el.parentNode?.removeChild(el) // 移除 <textarea> 元素
    if (selected) {
      // 如果在复制前已存在选中的内容
      document.getSelection()!.removeAllRanges() // 取消 HTML 文档中所有的选中部分
      document.getSelection()!.addRange(selected) // 恢复原来的选中
    }
  } catch (e) {
    console.warn(i18n.t('common.copyFailed'))
  }
}
