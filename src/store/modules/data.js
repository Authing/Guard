const state = {
  // 登录成功和错误提示信息
  globalMessage: "",
  globalMessageType: "",

  signUpEmail: "",
  signUpPassword: "",
  signUpPhone: "",
  signUpUsername: "",
  forgetPasswordEmail: "",
  forgetPasswordVerifyCode: "",
  socialButtonsList: [],
  appInfo: {},
  userInfo: {},
  isLogged: false,

  // 用于登录过程中，碰到需要输入 MFA 时，存储下上一步的用户名和密码
  loginFormStash: {
    email: "",
    password: "",
    MFACode: "",
    verifyCode: "",
    username: ""
  },
  // 用于社会化登录过程中，碰到需要输入 MFA 时，存储 unionid 以便再次登录
  loginOpt: {
    unionid: "",
    email: "",
    lastIP: ""
  },
  // 如果因 MFA 问题导致登录流程终端，记录一下当前是用户名密码登录还是社会化登录 UP social
  loginType: ""
};
const getters = {
  appInfo: state => state.appInfo,
  userInfo: state => state.userInfo,
  isLogged: state => state.isLogged,
  globalMessage: state => state.globalMessage,
  globalMessageType: state => state.globalMessageType,
  socialButtonsList: state => state.socialButtonsList,
  // 注册时填写的信息，用于自动填充
  signUpUsername: state => state.signUpUsername,
  signUpEmail: state => state.signUpEmail,
  signUpPassword: state => state.signUpPassword,
  signUpPhone: state => state.signUpPhone,
  // 重置密码时填的 email
  forgetPasswordEmail: state => state.forgetPasswordEmail,
  forgetPasswordVerifyCode: state => state.forgetPasswordVerifyCode,
  loginFormStash: state => state.loginFormStash,
  loginOpt: state => state.loginOpt,
  loginType: state => state.loginType
};
const actions = {
  saveLoginStatus({ commit }, { isLogged }) {
    commit("setLoginStatus", { isLogged });
  },
  recordLoginInfo({ state, commit, rootState }, userInfo) {
    if (rootState.protocol.isSSO) {
      let appToken = localStorage.getItem("appToken");
      let appId = state.appInfo._id;
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
      localStorage.setItem("_authing_userInfo", JSON.stringify(userInfo));
      localStorage.setItem(
        "_authing_clientInfo",
        JSON.stringify(state.appInfo)
      );
      localStorage.setItem("appToken", JSON.stringify(appToken));
    }
    commit("setLoginInfo", { userInfo });
  },
  showGlobalMessage({ commit }, { type, message }) {
    commit("setGlobalMessage", { type, message });
  },
  saveSignUpInfo({ commit }, { email, phone, password, username }) {
    commit("setSignUpInfo", { email, phone, password, username });
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
  }
};

const mutations = {
  setGlobalMessage(state, { type, message }) {
    state.globalMessage = message;
    state.globalMessageType = type;
  },
  setSignUpInfo(state, { email, phone, password, username }) {
    state.signUpPhone = phone;
    state.signUpEmail = email;
    state.signUpPassword = password;
    state.signUpUsername = username;
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
  },
  setLoginFormStash(state, { email, password, verifyCode, MFACode, username }) {
    state.loginFormStash = {
      email,
      password,
      verifyCode,
      MFACode,
      username
    };
  },
  setLoginOpt(state, { email, unionid, lastIP }) {
    state.loginOpt = {
      email,
      unionid,
      lastIP
    };
  },
  setLoginType(state, { loginType }) {
    state.loginType = loginType;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
