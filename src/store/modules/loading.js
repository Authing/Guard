const state = {
  // 登录成功和错误提示
  loginVerifyCode: false,
  socialButtonsList: false,
  form: false,
  button: false,
  page: true,
}
const getters = {
  loginVerifyCode: state => state.loginVerifyCode,
  socialButtonsList: state => state.socialButtonsList,
  form: state => state.form,
  button: state => state.button,
  page: state => state.page,
}
const actions = {
  changeLoading({commit}, {el, loading}) {
    // console.log('改变元素 loading 状态')
    // console.log({el, loading})
    commit('setLoading', {el, loading})
  }
}

const mutations = {
  setLoading(state, {el, loading}) {
    state[el] = loading
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}