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
  handleProtocolProcess({ state }, {route, router}) {
    switch (state.protocol) {
      case "oauth":
        this.dispatch("protocol/handleOAuthProcess", {route, router});
        break;
      case "oidc":
        this.dispatch("protocol/handleOIDCProcess", {route, router});
        break;
      case "saml":
        this.dispatch("protocol/handleSAMLProcess", {route, router});
        break;
    }
  },
  handleOAuthProcess(_, {route, router}) {
    try {
      let appId = route.query.app_id || route.query.client_id;
      let redirectURI = route.query.redirect_uri;
      let responseType = route.query.response_type;
      let scope = route.query.scope;
      let authorizationHeader = localStorage.getItem("_authing_token");
      router.push({
        name: "authorize",
        query: {
          protocol: "oauth",
          app_id: appId,
          redirect_uri: redirectURI,
          response_type: responseType,
          scope,
          authorization_header: authorizationHeader
        }
      });
    } catch(err) {
      console.log(err)
    }
  },
  handleOIDCProcess(_, {route, router}) {
    try {
      let uuid = route.query.uuid;
      if (!uuid) {
        route.replace({
          name: "error",
          query: { message: "缺少 OIDC 所必须的参数 uuid" }
        });
      }
      router.push({ name: "authorize", query: { uuid, protocol: "oidc" } });
    } catch (err) {
      console.log(err)
    }

    // location.href = `${this.userAuthorizeURL}&context=OIDC&uuid=${uuid}`;
  },
  handleSAMLProcess(_, route) {}
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
