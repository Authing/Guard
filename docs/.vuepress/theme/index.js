const get = require('lodash/get')

const transformInterpolation = (str, data) => {
  if (!str) {
    return str
  }
  return str.replace(/\{\{([\$\w\.]+?)\}\}/g, (matched, $1) => {
    return get(data, $1, matched)
  })
}

const transformFullHeaders = (headers, vm) => {
  if (!headers) {
    return headers
  }

  return headers.map((item) => ({
    ...item,
    title: transformInterpolation(item.title, vm),
    children: transformFullHeaders(item.children, vm),
  }))
}

// 注意，这个方法会修改源数据
const formatFrontMatter = (data, pageData) => {
  if (Array.isArray(data) || (typeof data === 'object' && data !== null)) {
    for (let i in data) {
      data[i] = formatFrontMatter(data[i], pageData)
    }

    return data
  }
  if (typeof data === 'string') {
    // console.log(data, transformInterpolation(data, pageData, pageData))
    return transformInterpolation(data, pageData)
  }

  return data
}

module.exports = {
  extend: '@vuepress/theme-default',
  extendPageData($page) {
    // 右侧目录用
    $page.fullHeaders = transformFullHeaders(
      resolveHeaders($page),
      $page._computed
    )

    // 提前将 title 找到，方便进行插值替换
    const siteTitle = $page._computed.$siteTitle
    let selfTitle = $page.frontmatter.home
      ? null
      : $page.frontmatter.title || $page.title // explicit title // inferred title
    $page.frontmatter.title = siteTitle
      ? selfTitle
        ? selfTitle
        : siteTitle
      : selfTitle || 'VuePress'

    // 替换所有模板插值
    $page.frontmatter = formatFrontMatter($page.frontmatter, $page._computed)
    $page.title = formatFrontMatter($page.title, $page._computed)
  },
}

function resolveHeaders(page) {
  const headers = groupHeaders(page.headers || [])
  return [
    {
      type: 'group',
      collapsable: false,
      title: page.title,
      path: null,
      children: headers.map((h) => ({
        type: 'auto',
        title: h.title,
        basePath: page.path,
        path: page.path + '#' + h.slug,
        children: h.children || [],
      })),
    },
  ]
}

const MIN_H = 3
function groupHeaders(headers) {
  headers = headers
    .map((h) => Object.assign({}, h))
    .filter((item) => item.level <= MIN_H)
  let lastH2
  headers.forEach((h) => {
    if (h.level === 2) {
      lastH2 = h
    } else if (lastH2) {
      ;(lastH2.children || (lastH2.children = [])).push(h)
    }
  })
  const maxH = Math.min(...headers.map((item) => item.level))

  return headers.filter((h) => {
    return h.level === maxH
  })
}
