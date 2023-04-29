export const GenerateSvg = (guardDocument: Document, svgString: string) => {
  const svgDOM = () => {
    const tempDiv = guardDocument.createElement('div')

    tempDiv.innerHTML = svgString

    const tempSVG = tempDiv.getElementsByTagName('svg')[0]

    tempSVG.setAttribute('aria-hidden', 'true')
    tempSVG.id = 'guard-svg-string'
    tempSVG.style.position = 'absolute'
    tempSVG.style.width = '0'
    tempSVG.style.height = '0'
    tempSVG.style.overflow = 'hidden'

    const body = guardDocument.body

    body.firstChild
      ? body.insertBefore(tempSVG, body.firstChild)
      : body.appendChild(tempSVG)
  }

  const readyState = guardDocument.readyState

  if (['complete', 'loaded', 'interactive'].includes(readyState)) {
    setTimeout(() => {
      svgDOM()
    }, 0)
  } else {
    const loadedFn = function () {
      guardDocument.removeEventListener('DOMContentLoaded', loadedFn)

      svgDOM()
    }

    guardDocument.addEventListener('DOMContentLoaded', loadedFn)
  }
}
