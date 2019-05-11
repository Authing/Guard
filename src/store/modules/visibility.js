const state = {
  successMsg: false,
  errorMsg: false,

  forgetPasswordSendEmail: false,
  forgetPasswordVerifyCode: false,
  forgetPasswordNewPassword: false,
  
}
const getters = {
  successMsg: state => state.successMsg,
  errorMsg: state => state.errorMsg,
  
  forgetPasswordSendEmail: state => state.forgetPasswordSendEmail,
  forgetPasswordVerifyCode: state => state.forgetPasswordVerifyCode,
  forgetPasswordNewPassword: state => state.forgetPasswordNewPassword,
}
const actions = {
  changeVisibility({commit}, {el, visibility}) {
    console.log('改变元素可见性')
    commit('setVisibility', {el, visibility})
  }
}

const mutations = {
  setVisibility(state, {el, visibility}) {
    state[el] = visibility
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}