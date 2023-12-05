var replace = require('replace-in-file')
var path = require('path')

// 处理 antd reset css 问题
const removeAntdGlobalStyles = () => {
  console.log('\n🔥 开始处理 antd reset css 🔥')

  const shimAntd4Dir = path.resolve(__dirname, '../shim-antd4')

  // const shimAntd5Dir = path.resolve(__dirname, '../shim-antd5')

  const options = {
    files: [
      `${shimAntd4Dir}/node_modules/antd/lib/style/core/index.less`,
      `${shimAntd4Dir}/node_modules/antd/es/style/core/index.less`
      // `${shimAntd5Dir}/node_modules/antd/lib/style/core/index.less`,
      // `${shimAntd5Dir}/node_modules/antd/es/style/core/index.less`
    ],
    from: "@import 'global';",
    to: ''
  }

  replace(options)
    .then(() => {
      console.log('[INFO] Successfully Removed Antd Global Styles')
    })
    .catch(e => {
      console.error('[ERR] Error removing Antd Global Styles:', e)
      process.exit(1)
    })
}

removeAntdGlobalStyles()
