const state = {
  // 登录成功和错误提示信息
  globalMessage: "",
  globalMessageType: "",

  signUpEmail: "",
  signUpPassword: "",

  forgetPasswordEmail: "",
  forgetPasswordVerifyCode: "",
  socialButtonsList: [],
  appInfo: {},
  userInfo: {},
  isLogged: false
};
const getters = {
  appInfo: state => state.appInfo,
  userInfo: state => state.userInfo,
  isLogged: state => state.isLogged,
  globalMessage: state => state.globalMessage,
  globalMessageType: state => state.globalMessageType,
  socialButtonsList: state => state.socialButtonsList,
  // 注册时填写的邮箱和密码，用于自动填充
  signUpEmail: state => state.signUpEmail,
  signUpPassword: state => state.signUpPassword,

  // 重置密码时填的 email
  forgetPasswordEmail: state => state.forgetPasswordEmail,
  forgetPasswordVerifyCode: state => state.forgetPasswordVerifyCode
};
const actions = {
  saveLoginStatus({commit}, {isLogged}) {
    commit('setLoginStatus', {isLogged})
  },
  recordLoginInfo({state, commit}, userInfo) {
    let appToken = localStorage.getItem("appToken");
    let appId = state.appInfo._id
    if (appToken) {
      try {
        appToken = JSON.parse(appToken);
      } catch (error) {
        appToken = {};
      }
    } else {
      appToken = {};
    }

    appToken[appId] = {
      accessToken: userInfo.token,
      userInfo: userInfo
    };

    localStorage.setItem("appToken", JSON.stringify(appToken));
    commit("setLoginInfo", {userInfo})
  },
  showGlobalMessage({ commit }, { type, message }) {
    commit("setGlobalMessage", { type, message });
  },
  saveSignUpInfo({ commit }, { email, password }) {
    commit("setSignUpInfo", { email, password });
  },
  saveForgetPasswordEmail({ commit }, { email }) {
    commit("setForgetPasswordEmail", { email });
  },
  saveForgetPasswordVerifyCode({ commit }, { verifyCode }) {
    commit("setForgetPasswordVerifyCode", { verifyCode });
  },
  saveSocialButtonsList({ commit }, { socialButtonsList }) {
    commit("setSocialButtonsList", { socialButtonsList });
  },
  saveAppInfo({ commit }, { appInfo }) {
    commit("setAppInfo", { appInfo });
  },
  removeAnimation(_, className) {
    document.getElementById(className).classList.remove("animated");
    document.getElementById(className).classList.remove("shake");
  },
  removeRedLine(_, className) {
    document.getElementById(className).classList.remove("err-hint");
  },
  addRedLine(_, className) {
    document.getElementById(className).classList.add("err-hint");
  },
  addAnimation(_, className) {
    document.getElementById(className).classList.add("animated");
    document.getElementById(className).classList.add("shake");
    document.getElementById(className).classList.add("err-hint");
    setTimeout(function() {
      actions.removeAnimation(_, className);
    }, 500);
  },
};

const mutations = {
  setGlobalMessage(state, { type, message }) {
    state.globalMessage = message;
    state.globalMessageType = type;
  },
  setSignUpInfo(state, { email, password }) {
    state.signUpEmail = email;
    state.signUpPassword = password;
  },
  setForgetPasswordEmail(state, { email }) {
    state.forgetPasswordEmail = email;
  },
  setForgetPasswordVerifyCode(state, { verifyCode }) {
    state.forgetPasswordVerifyCode = verifyCode;
  },
  setSocialButtonsList(state, { socialButtonsList }) {
    state.socialButtonsList = [...socialButtonsList];
  },
  setAppInfo(state, { appInfo }) {
    state.appInfo = { ...appInfo };
  },
  setLoginInfo(state, { userInfo }) {
    state.userInfo = { ...userInfo };
  },
  setLoginStatus(state, { isLogged }) {
    state.isLogged = isLogged;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
