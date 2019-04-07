<template>
  <div class="authorize">
    <div class="_authing_container" id="_authing_login_form_content">
      <div class="authing-login-form-wrapper">
        <div class="_authing_form-wrapper animated fast fadeInUp _authing_authorize_container">
          <div class="_authing_form-header">
            <div class="_authing_delta_bg"></div>
            <div class="_authing_logo_bar">
              <img class="_authing_logo_icon" src="../assets/wtf.png">
              <div class="_authing_logo_text">Authing</div>
            </div>
            <div class="_authing_item_logo_bar">
              <img
                class="_authing_delta_circle"
                :style="{marginTop: screenWidth >= 463 ? '60px' : ((580 - screenWidth + 15) * (170 / 580) + 170) / 4 + 'px'}"
                :src="!pageLoading ? authInfo['image'] : ''"
              >
            </div>

            <!---->
            <!---->
            <div class="_authing_form-header-bg"></div>
            <!-- <div class="_authing_form-header-welcome">
              <img src="https://usercontents.authing.cn/client/logo@2.png" class="form-header-logo">
              <div title="Authing" class="_authing_form-header-name">Authing</div>
            </div>-->
          </div>
          <img v-show="false" alt="Vue logo" :src="authInfo.images">
          <div class="_authing_form_authorize_info">
            <div class="_div_authorize_block">
              <div class="_div_info_text">
                <span>登录</span>
                <a
                  class="url"
                  @click="() => { return false }"
                >{{authInfo['name']}}</a>
              </div>
              <ul>
                <template v-if="scopes.scopeMeanings.length > 0 && $route.query.authorize_type === 'oidc'">
                  <div  class="permission-list">
                  <li :key="scope" v-for="scope in scopes.scopeMeanings">获取你的{{scope}}</li>
                  </div>
                </template>
                <template v-if="scopes.scopeMeanings.length === 0 && $route.query.authorize_type === 'oidc'">
                  <li>获取 scope 失败，会话可能过期，请重新登录</li>
                </template>
              </ul>
            </div>

            <div class="_div_line"/>
          </div>

          <div v-show="!pageLoading" class="_authing_form-footer two_buttons">
            <button class="btn btn-primary" @click="redirectURL">授权登录</button>
            <button class="btn btn-primary btn-cancel" @click="cancelAuthorize">取消</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GraphQLClient from "../graphql.js";
import axios from 'axios';

export default {
  name: "authorize",
  components: {},

  methods: {
    // call server for AppInfo
    queryAppInfoByAppID() {
      this.pageLoading = true;
      const uuid = this.$route.query.uuid;
      const appId = this.$route.query.app_id || this.$route.query.client_id;
      if (!appId) {
        location.href = '/login/error?message=请提供 app_id 或 client_id&code=id404';
      }
      let operationName;
      if(uuid) {
        operationName = 'QueryOIDCAppInfoByAppID';
      } else {
        operationName = 'QueryAppInfoByAppID';
      }
      let self = this;
      let query =
        `query {
                    ${operationName} (appId: "` + appId + `") {   
                        _id,
                        name,
                        image,
                        redirectUris,
                        clientId,
                        description,
                    }
                  }`;

      let GraphQLClient_getInfo = new GraphQLClient({
        baseURL: this.$root.opts.host.oauth,
      });
      GraphQLClient_getInfo.request({ query })
        .then(e => {
          self.authInfo = uuid ? e.QueryOIDCAppInfoByAppID : e.QueryAppInfoByAppID;

          try {
            self.pageError = (
              "clientId"      in self.authInfo &&
              "description"   in self.authInfo &&
              "image"         in self.authInfo &&
              "name"          in self.authInfo &&
              "redirectUris"  in self.authInfo
            );
          } catch {
            self.pageError = true;
          }

          self.pageLoading = false;
        })
        .catch(() => {
          self.pageError = true;
        });
    },

    redirectURL() {
      // redirect to $HOST/authorize to get Authorization Code
      const state = this.$route.query.state || "";
      const appId = this.$route.query.app_id || this.$route.query.client_id || '';
      const redirectURI = this.$route.query.redirect_uri || "";
      const responseType = this.$route.query.response_type || "code";
      const scope =
        this.$route.query.scope || Math.ceil(Math.random() * Math.pow(10, 6));
      const host = this.$root.SSOHost;
      console.log(this.isOIDC)
      if (this.isOIDC) {
        location.href = this.scopes.redirectTo;
      }else {
        location.href = `${host}/authorize?app_id=${appId}&state=${state}&response_type=${responseType}&redirect_uri=${redirectURI}&scope=${scope}&authorization_header=${localStorage.getItem(
          "_authing_token"
        )}&confirm_authorize=1`;
      }
    },

    cancelAuthorize() {
      // redirect to
      localStorage.setItem('appToken', '')

      window.history.back()
    },

    async queryOIDCInfo(uuid) {
      const oauthLoginUrl = `${window.location.origin}/oauth/oidc/interaction/${uuid}/login`;
      try {
        const result = await axios.post(oauthLoginUrl, null, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('_authing_token')}`,
          },
          withCredentials: true
        });
        /*
          {
          scope: 'openid profile ....',
          scopeMeanings: ['用户标识', '基础资料(包括 昵称，姓名，出生日期等)' ,'...']
          redirectTo: 'http://localhost:5556/oauth/oidc/auth/ca763762-0b42-4f23-aaf9-f0e9909fa68a'
          }
        */
        this.scopes = result.data;
      }catch(err) {
        // location.href = location.pathname + 'error?message=缺少 OIDC 所必须的参数 uuid';
      }
    },
  },

  data() {
    return {
      screenWidth: document.body.scrollWidth,
      authInfo: {
        clientId: "59f86b4832eb28071bdd9214",
        description: null,
        image: "https://usercontents.authing.cn/client/logo@2.png",
        name: "Authing SSO",
        redirectUris: ["https://authing.cn/oauth/direct"],
        _id: "5c7253efe21948de32723725"
      },
      pageLoading: false,
      pageError: false,

      isOIDC: false,
      scopes: {
        scopeMeanings: []
      },
    };
  },

  mounted() {
    const authorizeType = this.$route.query.authorize_type;
    const uuid = this.$route.query.uuid;
    console.log(authorizeType, uuid)
    if (authorizeType === 'oidc' && uuid) {
      this.isOIDC = true;
      this.queryOIDCInfo(uuid);
    }else {
      this.queryAppInfoByAppID();
    }
    window.onresize = () => {
      return (() => {
        window.screenWidth = document.body.scrollWidth;
        this.screenWidth = window.screenWidth;
      })();
    };
  },
};
</script>

<style>
  .permission-list {
    max-height: 170px;
    overflow-y: scroll;
    list-style-position: inside;
    margin-left: -15px;
  }
</style>
