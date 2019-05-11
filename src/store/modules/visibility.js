const pageVisibilities = [
  "forgetPassword",
  "forgetPasswordSendEmail",
  "forgetPasswordVerifyCode",
  "forgetPasswordNewPassword",
  "wxQRCode",
  "EmailLogin",
  "SignUp",
  "loginByPhoneCode"
];
const state = {
  pageStack: [],
  // 用于页面切换的可见性设置 ---------
  // 重置密码
  forgetPassword: false, // 下面三项一个为 true，此项就为 true
  forgetPasswordSendEmail: false,
  forgetPasswordVerifyCode: false,
  forgetPasswordNewPassword: false,
  // 小程序二维码登录页
  wxQRCode: false,
  // email 登录页
  emailLogin: false,
  // 注册页
  signUp: false,
  // 通过手机号登录页
  loginByPhoneCode: false,
  // -----------------------------
  // EmailLogin 页面中 LDAP 登录选项可见性
  hasLDAP: false,
  // 登录频繁时，要求用户输入验证码
  loginVerifyCode: false,
  // 登录成功和错误提示
  globalSuccess: false,
  globalError: false,
  globalWarn: false
};
const getters = {
  globalSuccess: state => state.globalSuccess,
  globalError: state => state.globalError,
  globalWarn: state => state.globalWarn,

  wxQRCode: state => state.wxQRCode,
  emailLogin: state => state.emailLogin,
  signUp: state => state.signUp,
  loginByPhoneCode: state => state.loginByPhoneCode,
  hasLDAP: state => state.hasLDAP,
  loginVerifyCode: state => state.loginVerifyCode,

  forgetPassword: state => state.forgetPassword,
  forgetPasswordSendEmail: state => state.forgetPasswordSendEmail,
  forgetPasswordVerifyCode: state => state.forgetPasswordVerifyCode,
  forgetPasswordNewPassword: state => state.forgetPasswordNewPassword
};
const actions = {
  changeVisibility({ commit }, { el, visibility }) {
    console.log("改变元素可见性" + { el, visibility });
    commit("setVisibility", { el, visibility });
  },
  removeGlobalMsg() {
    commit("removeGlobalMsg");
  },
  gotoWxQRCodeScanning({ commit }) {
    commit("turnOnPage", { page: "wxQRCode" });
  },
  turnOnPage({ commit }, { page }) {
    commit("removeGlobalMsg");
    commit("turnOnPage", { page });
  }
};

const mutations = {
  // 设置某个元素的可见性
  setVisibility(state, { el, visibility }) {
    state[el] = visibility;
  },
  // 移除所有登录成功和错误提示
  removeGlobalMsg() {
    state.globalWarn = false;
    state.globalError = false;
    state.globalSuccess = false;
  },
  showGlobalSuccess() {
    state.globalWarn = false;
    state.globalError = false;
    state.globalSuccess = true;
  },
  showGlobalErr() {
    state.globalWarn = false;
    state.globalError = true;
    state.globalSuccess = false;
  },
  showGlobalWarn() {
    state.globalWarn = true;
    state.globalError = false;
    state.globalSuccess = false;
  },
  turnOnPage(state, { page }) {
    // page 是 pageVisibilities 中的一个字符串
    pageVisibilities.map(item => {
      state[item] = false;
    });
    state[page] = true;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
