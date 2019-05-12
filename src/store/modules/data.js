const state = {
  // 登录成功和错误提示信息
  globalMessage: "",
  globalMessageType: "",

  signUpEmail: "",
  signUpPassword: "",

  forgetPasswordEmail: "",
  forgetPasswordVerifyCode: "",
  socialButtonsList: []
};
const getters = {
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
  }
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
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
