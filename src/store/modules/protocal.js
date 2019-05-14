const state = {
  // 登录成功和错误提示
  protocal: ""
};
const getters = {
  protocal: state => state.protocal
};
const actions = {
  saveProtocal({ commit }, { protocal }) {
    commit("setProtocal", { protocal });
  },
  handleProtocalProcess({ state }, routes) {
    switch (state.protocal) {
      case "oauth":
        this.handleOAuthProcess(routes);
        break;
      case "oidc":
        this.handleOIDCProcess(routes);
        break;
      case "saml":
        this.handleSAMLProcess(routes);
        break;
    }
  },
  handleOAuthProcess(_, routes) {},
  handleOIDCProcess(_, routes) {
    let uuid = routes.query.uuid;
    if (!uuid) {
      routes.replace({
        name: "error",
        query: { message: "缺少 OIDC 所必须的参数 uuid" }
      });
    }
    routes.push({ name: "authorize", query: { uuid, protocal: "oidc" } });
    // location.href = `${this.userAuthorizeURL}&context=OIDC&uuid=${uuid}`;
  },
  handleSAMLProcess(_, routes) {}
};

const mutations = {
  setProtocal(state, { protocal }) {
    state.protocal = protocal;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
