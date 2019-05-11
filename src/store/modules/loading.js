const state = {
  // 登录成功和错误提示
  verifyCode: false,
}
const getters = {
  verifyCode: state => state.verifyCode,
}
const actions = {
  changeLoading({commit}, {el, loading}) {
    console.log('改变元素 loading 状态' + {el, loading} )
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