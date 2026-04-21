// ============================================
// AWS Amplify v6 兼容层
// 解决 @aws-amplify/ui 与 aws-amplify v6 的 API 差异
// ============================================

// 使用动态 require 来避免静态导入的问题
const Auth = require('aws-amplify/auth')

// 导出所有需要的函数
module.exports = {
  ...Auth,
  // 确保 resendSignUpCode 被正确导出
  resendSignUpCode: Auth.resendSignUpCode || Auth.default?.resendSignUpCode || function() {
    throw new Error('resendSignUpCode is not available in current Amplify version')
  }
}

// 同时导出默认对象
module.exports.default = module.exports
