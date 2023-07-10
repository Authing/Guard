const BRAND_NAME_ZH_CN = 'Authing'


const zhCnNavBar = {
  '/guide/': [
    {
      title: '使用指南',
      collapsable: false,
      children: [
        {
          title: '介绍',
          path: '/guide/'
        },
        {
          title: '安装',
          path: '/guide/install'
        },
        {
          title: '快速开始',
          path: '/guide/quick-start'
        },
        {
          title: '初始配置',
          path: '/guide/config'
        },
        {
          title: '类型定义',
          path: '/guide/types'
        }
      ]
    },
    {
      title: '基础',
      collapsable: false,
      children: [
        {
          title: '创建一个 Authing 应用',
          path: 'https://docs.authing.cn/v2/guides/app-new/create-app/create-app.html'
        },
        {
          title: '了解 Guard 使用模式',
          path: '/guide/essentials/mode'
        },
        {
          title: '控制台配置与本地配置',
          path: '/guide/essentials/console-local-relationship'
        }
      ]
    },
    {
      title: 'API',
      collapsable: false,
      children: [
        {
          title: '登录',
          path: '/guide/essentials/login'
        },
        {
          title: '登出',
          path: '/guide/essentials/logout'
        },
        {
          title: '获取用户信息',
          path: '/guide/essentials/trackSession'
        },
        {
          title: '切换视图',
          path: '/guide/essentials/change-view'
        },
        {
          title: '事件',
          path: '/guide/essentials/events'
        },
        {
          title: '切换语言',
          path: '/guide/essentials/change-language'
        },
        {
          title: '自定义样式',
          path: '/guide/essentials/change-content-css'
        },
        {
          title: '刷新 Token',
          path: '/guide/essentials/refresh-token'
        },
        {
          title: '操作登录注册协议',
          path: '/guide/essentials/agreemetns'
        }
      ]
    },
    {
      title: '高级功能',
      collapsable: false,
      children: [
        {
          title: '使用 JS SDK',
          path: '/guide/essentials/js-sdk'
        },
        {
          title: 'SSO 单点登录',
          path: '/guide/essentials/sso'
        },
        {
          title: '第三方身份源登录',
          path: '/guide/essentials/social'
        },
        {
          title: 'MFA 多因素认证',
          path: '/guide/essentials/mfa'
        },
        {
          title: '配置安全域',
          path: '/guide/essentials/safe-domain'
        },
        {
          title: '私有化部署',
          path: '/guide/essentials/privatization'
        }
      ]
    }
  ]
}



const addPrefixToLink = (navbar, prefix) => {
  if (!navbar) {
    return;
  }
  return navbar.map((item) => ({
    ...item,
    path: item.path && `${prefix}${item.path}`,
    children:
      item.children &&
      item.children.map((link) => {
        if (typeof link === 'string') {
          return `${prefix}${link}`;
        }
        return {
          ...link,
          path: `${prefix}${link.path}`,
          children: addPrefixToLink(link.children, prefix)
        };
      })
  }));
};


module.exports = {
  zhCnNavBar,
  BRAND_NAME_ZH_CN
}
