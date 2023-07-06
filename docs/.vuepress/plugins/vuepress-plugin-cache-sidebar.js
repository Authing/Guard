module.exports = function cacheSidebarPlugin(options, ctx) {
  const navMap = {}
  const customPageRegularPathMap = {}
  const pageRegularPathMap = {}
  const regularPaths = []

  return {
    ready() {
      ctx.pages.forEach((page) => {
        pageRegularPathMap[page.regularPath] = page
        regularPaths.push(page.regularPath)
      })

      regularPaths.forEach((path) => {
        const langPath = path.startsWith('/en/') ? '/en/' : '/'

        ctx.themeConfig.locales[langPath].nav.forEach((nav) => {
          if (!customPageRegularPathMap[nav.link]) {
            customPageRegularPathMap[nav.link] = {}
          }

          if (path.indexOf(nav.link) === 0) {
            if (!navMap[nav.link]) {
              navMap[nav.link] = resolveSidebarItems(
                pageRegularPathMap[path],
                path,
                ctx.getSiteData(),
                langPath
              )
            } else {
              customPageRegularPathMap[nav.link].list = navMap[nav.link]
            }
          }
        })
      })
    },
    clientDynamicModules() {
      return {
        name: 'sidebar-caches.js',
        content: `export const sidebarList = ${JSON.stringify(customPageRegularPathMap)}`
      }
    }
  }
}

const hashRE = /#.*$/
const extRE = /\.(md|html)$/
const endingSlashRE = /\/$/
const outboundRE = /^[a-z]+:/i

function resolveSidebarItems(page, regularPath, site, localePath) {
  const { pages, themeConfig } = site

  const localeConfig =
    localePath && themeConfig.locales
      ? themeConfig.locales[localePath] || themeConfig
      : themeConfig

  const pageSidebarConfig =
    page.frontmatter.sidebar || localeConfig.sidebar || themeConfig.sidebar
  if (pageSidebarConfig === 'auto') {
    return resolveHeaders(page)
  }

  const sidebarConfig = localeConfig.sidebar || themeConfig.sidebar
  if (!sidebarConfig) {
    return []
  } else {
    const { base, config } = resolveMatchingConfig(regularPath, sidebarConfig)
    if (config === 'auto') {
      return resolveHeaders(page)
    }
    return config
      ? config.map((item, index) =>
          resolveItem(item, pages, base, 1, `${index}`)
        )
      : []
  }
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

function resolveMatchingConfig(regularPath, config) {
  if (Array.isArray(config)) {
    return {
      base: '/',
      config: config,
    }
  }
  for (const base in config) {
    if (ensureEndingSlash(regularPath).indexOf(encodeURI(base)) === 0) {
      return {
        base,
        config: config[base],
      }
    }
  }
  return {}
}

function ensureEndingSlash(path) {
  return /(\.html|\/)$/.test(path) ? path : path + '/'
}

function isExternal(path) {
  return outboundRE.test(path)
}

function resolvePage(pages, rawPath, base, dataIndex) {
  if (isExternal(rawPath)) {
    return {
      type: 'external',
      path: rawPath,
    }
  }
  if (base) {
    rawPath = resolvePath(rawPath, base)
  }
  const path = normalize(rawPath)
  for (let i = 0; i < pages.length; i++) {
    if (normalize(pages[i].regularPath) === path) {
      pages[i].dataIndex = dataIndex
      return Object.assign({}, pages[i], {
        type: 'page',
        path: ensureExt(pages[i].path),
        dataIndex: dataIndex,
      })
    }
  }
  console.error(
    `[vuepress] No matching page found for sidebar item '${rawPath}'`
  )
  return {}
}

function ensureExt(path) {
  if (isExternal(path)) {
    return path
  }
  const hashMatch = path.match(hashRE)
  const hash = hashMatch ? hashMatch[0] : ''
  const normalized = normalize(path)

  if (endingSlashRE.test(normalized)) {
    return path
  }
  return normalized + '.html' + hash
}

function normalize(path) {
  return decodeURI(path).replace(hashRE, '').replace(extRE, '')
}

function resolvePath(relative, base, append) {
  const firstChar = relative.charAt(0)
  if (firstChar === '/') {
    return relative
  }

  if (firstChar === '?' || firstChar === '#') {
    return base + relative
  }

  const stack = base.split('/')

  // remove trailing segment if:
  // - not appending
  // - appending to trailing slash (last segment is empty)
  if (!append || !stack[stack.length - 1]) {
    stack.pop()
  }

  // resolve relative path
  const segments = relative.replace(/^\//, '').split('/')
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i]
    if (segment === '..') {
      stack.pop()
    } else if (segment !== '.') {
      stack.push(segment)
    }
  }

  // ensure leading slash
  if (stack[0] !== '') {
    stack.unshift('')
  }

  return stack.join('/')
}

function resolveItem(item, pages, base, groupDepth = 1, dataIndex = '') {
  if (typeof item === 'string') {
    return resolvePage(pages, item, base, dataIndex)
  } else if (Array.isArray(item)) {
    return Object.assign(resolvePage(pages, item[0], base, dataIndex), {
      title: item[1],
    })
  } else {
    const children = item.children || []
    if (children.length === 0 && item.path) {
      return Object.assign(resolvePage(pages, item.path, base, dataIndex), {
        title: item.title,
      })
    }
    return {
      type: 'group',
      path: item.path,
      title: item.title,
      sidebarDepth: item.sidebarDepth,
      initialOpenGroupIndex: item.initialOpenGroupIndex,
      redirect: item.redirect,
      dataIndex: dataIndex,
      children: children.map((child, index) =>
        resolveItem(child, pages, base, groupDepth + 1, `${dataIndex}-${index}`)
      ),
      collapsable: item.collapsable !== false,
    }
  }
}
