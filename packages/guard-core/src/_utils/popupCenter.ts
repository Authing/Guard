import { getGuardWindow } from '../Guard/core/useAppendConfig'

/**
 * 在屏幕中心弹出新窗口加载 url
 * @param url
 * @param param1
 */
export const popupCenter = (
  url: string,
  { w, h }: { w: number; h: number } = { w: 585, h: 649 }
) => {
  const guardWindow = getGuardWindow()

  if (!guardWindow) return

  const document = guardWindow.document

  // Fixes dual-screen position                             Most browsers      Firefox
  const dualScreenLeft =
    guardWindow.screenLeft !== undefined ? guardWindow.screenLeft : guardWindow.screenX
  const dualScreenTop =
    guardWindow.screenTop !== undefined ? guardWindow.screenTop : guardWindow.screenY

  const width = guardWindow.innerWidth
    ? guardWindow.innerWidth
    : document.documentElement.clientWidth
      ? document.documentElement.clientWidth
      : guardWindow.screen.width

  const height = guardWindow.innerHeight
    ? guardWindow.innerHeight
    : document.documentElement.clientHeight
      ? document.documentElement.clientHeight
      : guardWindow.screen.height

  const systemZoom = width / guardWindow.screen.availWidth
  const left = (width - w) / 2 / systemZoom + dualScreenLeft
  const top = (height - h) / 2 / systemZoom + dualScreenTop
  const newWindow = guardWindow.open(
    url,
    '_blank',
    `
      toolbar=no,
      menubar=no,
      scrollbars=no,
      resizable=no,
      location=no,
      status=no
      width=${w / systemZoom}, 
      height=${h / systemZoom}, 
      top=${top}, 
      left=${left}
    `
  )

  newWindow?.focus()
}
