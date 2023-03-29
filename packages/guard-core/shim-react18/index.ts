import React, { ReactNode, CSSProperties } from 'react'

import { createRoot, Root } from 'react-dom/client'

export interface IRenderer {
  container: Element,
  element: ReactNode
}

interface ICachedRoot {
  container: Element
  root: Root
}

const cachedRoots: ICachedRoot[] = []

function render (renderer: IRenderer) {
  const { container, element } = renderer

  const root: Root = createRoot(container)

  const cacheIndex = cachedRoots.findIndex(item => {
    return item.container === container
  })

  if (cacheIndex > -1) {
    cachedRoots.splice(cacheIndex, 1, {
      root,
      container
    })
  } else {
    cachedRoots.push({
      container,
      root
    })
  }

  root.render(element)
}

function unmount (container: Element) {
  const cache = cachedRoots.find(item => {
    return item.container === container
  })

  if (cache) {
    cache.root.unmount()
  }
}

export {
  React,
  ReactNode,
  CSSProperties,
  render,
  unmount
}
