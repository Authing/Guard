import React, { ReactElement, CSSProperties, ReactNode } from 'react'

import ReactDOM from 'react-dom'

export interface IRenderer {
  container: Element,
  element: ReactElement
}

const cachedRoots: Element[] = []

function render (renderer: IRenderer) {
  const { container, element } = renderer

  const cacheIndex = cachedRoots.findIndex(item => {
    return item === container
  })

  if (cacheIndex > -1) {
    cachedRoots.splice(cacheIndex, 1, container)
  } else {
    cachedRoots.push(container)
  }

  return ReactDOM.render(element, container)
}

function unmount (container: Element) {
  const cache = cachedRoots.find(item => {
    return item === container
  })

  if (cache) {
    ReactDOM.unmountComponentAtNode(cache)
  }
}

export {
  React,
  CSSProperties,
  ReactNode,
  render,
  unmount
}
