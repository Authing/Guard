const pageVisibilities = [
  "forgetPassword",
  "forgetPasswordSendEmail",
  "forgetPasswordVerifyCode",
  "forgetPasswordNewPassword",
  "wxQRCode",
  "emailLogin",
  "signUp",
  "signUpByPhone",
  "phoneCodeLogin",
  "phonePasswordLogin",
  "LDAPLogin",
  "MFACode"
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
  // 通过手机号登录页
  phoneCodeLogin: false,
  phonePasswordLogin: false,
  // email 登录页
  emailLogin: true,
  // 注册页
  signUp: false,
  signUpByPhone:false,
  MFACode: false,

  // -----------------------------
  // EmailLogin 页面中 LDAP 登录选项可见性
  LDAPLogin: false,
  // 登录频繁时，要求用户输入验证码
  loginVerifyCode: false
  // 登录成功和错误提示
  // globalSuccess: false,
  // globalError: false,
  // globalWarn: false,
};
const getters = {
  // globalSuccess: state => state.globalSuccess,
  // globalError: state => state.globalError,
  // globalWarn: state => state.globalWarn,
  pageStack: state => state.pageStack,

  wxQRCode: state => state.wxQRCode,
  emailLogin: state => state.emailLogin,
  phoneCodeLogin: state => state.phoneCodeLogin,
  phonePasswordLogin: state => state.phonePasswordLogin,
  signUp: state => state.signUp,
  signUpByPhone: state => state.signUpByPhone,
  LDAPLogin: state => state.LDAPLogin,
  loginVerifyCode: state => state.loginVerifyCode,
  MFACode: state => state.MFACode,
  forgetPassword: state =>
    state.forgetPasswordSendEmail ||
    state.forgetPasswordVerifyCode ||
    state.forgetPasswordNewPassword,
  forgetPasswordSendEmail: state => state.forgetPasswordSendEmail,
  forgetPasswordVerifyCode: state => state.forgetPasswordVerifyCode,
  forgetPasswordNewPassword: state => state.forgetPasswordNewPassword
};
const actions = {
  changeVisibility({ commit }, { el, visibility }) {
    // console.log("改变元素可见性");
    // console.log({ el, visibility });
    commit("setVisibility", { el, visibility });
  },
  removeGlobalMsg() {
    commit("removeGlobalMsg");
  },
  gotoWxQRCodeScanning({ commit }) {
    commit("turnOnPage", { page: "wxQRCode" });
  },
  gotoSignUp({ commit }) {
    commit("turnOnPage", { page: "signUp" });
  },
  gotoSignUpByPhone({commit}){
    commit("turnOnPage", { page: "signUpByPhone"});
  },
  gotoLogin({ commit }) {
    commit("turnOnPage", { page: "emailLogin" });
  },
  gotoLDAPLogin({ commit }) {
    commit("turnOnPage", { page: "LDAPLogin" });
  },
  gotoForgetPassword({ commit }) {
    commit("turnOnPage", { page: "forgetPasswordSendEmail" });
  },
  gotoUsingPhonePassword({ commit }) {
    commit("turnOnPage", { page: "phonePasswordLogin" });
  },
  gotoUsingPhone({ commit }) {
    commit("turnOnPage", { page: "phoneCodeLogin" });
  },
  gotoForgetPasswordVerifyCode({ commit }) {
    commit("turnOnPage", { page: "forgetPasswordVerifyCode" });
  },
  gotoForgetPasswordNewPassword({ commit }) {
    commit("turnOnPage", { page: "forgetPasswordNewPassword" });
  },
  gotoMFACode({commit}) {
    commit("turnOnPage", { page: "MFACode", keepMessage: true });
  },
  turnOnPage({ commit }, { page }) {
    // commit("removeGlobalMsg");

    commit("turnOnPage", { page });
  },
  goBack({ commit }) {
    commit("goBack");
  }
};

const mutations = {
  // 设置某个元素的可见性
  setVisibility(state, { el, visibility }) {
    state[el] = visibility;
  },
  // 移除所有登录成功和错误提示
  // removeGlobalMsg() {
  //   state.globalWarn = false;
  //   state.globalError = false;
  //   state.globalSuccess = false;
  // },
  // showGlobalSuccess() {
  //   state.globalWarn = false;
  //   state.globalError = false;
  //   state.globalSuccess = true;
  // },
  // showGlobalErr() {
  //   state.globalWarn = false;
  //   state.globalError = true;
  //   state.globalSuccess = false;
  // },
  // showGlobalWarn() {
  //   state.globalWarn = true;
  //   state.globalError = false;
  //   state.globalSuccess = false;
  // },
  turnOnPage(state, { page, keepMessage }) {
    // 切换页面时删除 GlobalMessage
    if(!keepMessage)
      this.dispatch("data/showGlobalMessage", { type: "", message: "" });
    // page 是 pageVisibilities 中的一个字符串
    state.pageStack.push(
      pageVisibilities.reduce((acc, val) => {
        return { ...acc, [val]: state[val] };
      }, {})
    );
    pageVisibilities.map(item => {
      state[item] = false;
    });
    state[page] = true;
  },
  goBack(state) {
    this.dispatch("data/showGlobalMessage", { type: "", message: "" });
    let prev = state.pageStack.pop();
    pageVisibilities.map(item => {
      state[item] = prev[item];
    });
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
