const state = {
  // 登录成功和错误提示
  protocol: "",
  params: {}
};
const getters = {
  protocol: state => state.protocol,
  params: state => state.params
};
const actions = {
  saveProtocol({ commit }, { protocol, params }) {
    commit("setProtocol", { protocol, params });
  },
  handleProtocolProcess({ state }, { router }) {
    switch (state.protocol) {
      case "oauth":
        this.dispatch("protocol/handleOAuthProcess", { router });
        break;
      case "oidc":
        this.dispatch("protocol/handleOIDCProcess", { router });
        break;
      case "saml":
        this.dispatch("protocol/handleSAMLProcess", { router });
        break;
    }
  },
  handleOAuthProcess({ state }, { router }) {
    try {
      // let appId = state.params.app_id || state.params.client_id;
      // let redirectURI = state.params.redirect_uri;
      // let responseType = state.params.response_type;
      // let scope = state.params.scope;
      let authorizationHeader = localStorage.getItem("_authing_token");
      router.push({
        name: "authorize",
        query: {
          ...state.params,
          authorization_header: authorizationHeader
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
  handleOIDCProcess({ state }, { router }) {
    try {
      // let appId = state.params.app_id || state.params.client_id;
      // let redirectURI = state.params.redirect_uri;
      // let responseType = state.params.response_type;
      // let scope = state.params.scope;
      // // let authorizationHeader = localStorage.getItem("_authing_token");
      // let nonce = state.params.nonce;
      // let prompt = state.params.prompt;
      // let _state = state.params.state;

      let uuid = state.params.uuid;
      if (!uuid) {
        router.replace({
          name: "error",
          query: { message: "缺少 OIDC 所必须的参数 uuid" }
        });
      } else {
        router.push({
          name: "authorize",
          query: {
            ...state.params
          }
        });
      }
    } catch (err) {
      console.log(err);
    }
  },
  handleSAMLProcess(_, { router }) {}
};

const mutations = {
  setProtocol(state, { protocol, params }) {
    state.protocol = protocol;
    state.params = { ...params };
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
