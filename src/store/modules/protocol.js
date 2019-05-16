const state = {
  // 登录成功和错误提示
  protocol: ""
};
const getters = {
  protocol: state => state.protocol
};
const actions = {
  saveProtocol({ commit }, { protocol }) {
    commit("setProtocol", { protocol });
  },
  handleProtocolProcess({ state }, routes) {
    switch (state.protocol) {
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
    routes.push({ name: "authorize", query: { uuid, protocol: "oidc" } });
    // location.href = `${this.userAuthorizeURL}&context=OIDC&uuid=${uuid}`;
  },
  handleSAMLProcess(_, routes) {}
};

const mutations = {
  setProtocol(state, { protocol }) {
    state.protocol = protocol;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
