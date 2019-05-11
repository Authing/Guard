const state = {
  // 登录成功和错误提示信息
  globalMessage: '',
  globalMessageType: '',

  socialButtonsList: []
}
const getters = {
  globalMessage: state => state.globalMessage,
  globalMessageType: state => state.globalMessageType,
  socialButtonsList: state => state.socialButtonsList,
}
const actions = {
  changeLoading({commit}, {el, loading}) {
    console.log('改变元素 loading 状态')
    console.log({el, loading})
    commit('setLoading', {el, loading})
  },
  showGlobalMessage({commit}, {type, message}) {
    commit('setGlobalMessage', {type, message})
  }
}

const mutations = {
  setLoading(state, {el, loading}) {
    state[el] = loading
  },
  setGlobalMessage(state, {type, message}) {
    state.globalMessage = message
    state.globalMessageType = type
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}