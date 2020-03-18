const state = {
  // 登录成功和错误提示
  protocol: "",
  params: {
    response_type: "code",
    redirect_uri: "",
    state: Math.random()
      .toString()
      .slice(2),
    scope: ""
  },
  isSSO: false
};

const getters = {
  protocol: state => state.protocol,
  params: state => state.params,
};
const actions = {
  saveProtocol({ commit }, { protocol, params, isSSO }) {
    commit("setProtocol", { protocol, params, isSSO });
  },
  handleProtocolProcess({ state }, { router }) {
    if (state.isSSO) {
      if (sessionStorage.getItem('jump2Profile')) {
        router.push({ name: 'profile' })
        return
      }
      if (sessionStorage.getItem('jumpRegedit')) {
        router.push({ name: 'regedit' })
        return
      }
      if (sessionStorage.getItem('jumpTeaIentity')) {
        router.push({ name: 'teaIdentity' })
        return
      }
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
    } else {
      return;
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
          query: { message: ["缺少 OIDC 所必须的参数 uuid"] }
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
  handleSAMLProcess({ state }, { router }) {
    try {
      router.push({
        name: "authorize",
        query: {
          ...state.params
        }
      });
    } catch (err) {
      console.log(err);
    }
  }
};

const mutations = {
  setProtocol(state, { protocol, params, isSSO }) {
    state.protocol = protocol;
    state.params = { ...params };
    state.isSSO = isSSO;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
