const state = {
  // 登录成功和错误提示信息
  globalMessage: '',
  globalMessageType: '',

  signUpEmail: '',
  signUpPassword: '',
  socialButtonsList: [],
}
const getters = {
  globalMessage: state => state.globalMessage,
  globalMessageType: state => state.globalMessageType,
  socialButtonsList: state => state.socialButtonsList,
  signUpEmail: state => state.signUpEmail,
  signUpPassword: state => state.signUpPassword,
}
const actions = {
  showGlobalMessage({commit}, {type, message}) {
    commit('setGlobalMessage', {type, message})
  },
  saveSignUpInfo({commit}, {email, password}) {
    commit('setSignUpInfo', {email, password})
  }
}

const mutations = {
  setGlobalMessage(state, {type, message}) {
    state.globalMessage = message
    state.globalMessageType = type
  },
  setSignUpInfo(state, {email, password}) {
    state.signUpEmail = email
    state.signUpPassword = password
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}