<template>
  <div id="_authing_login_form" @keyup.esc="handleClose" v-if="!removeDom">
    <div class="authing-loading-circle screen-center" v-if="pageLoading"></div>
    <div class="authing-cover-layer" v-if="$parent.isMountedInModal && !closeForm"></div>
    <div
      class="_authing_container"
      id="_authing_login_form_content"
      :class="{hide: pageLoading, 'authing-login-form-modal': $parent.isMountedInModal}"
    >
      <div
        v-if="!closeForm"
        class="authing-form-badge-bottom"
        :class="{'authing-form-badge-white': $parent.isMountedInModal}"
      >
        <a
          href="https://authing.cn/?utm_source=form&amp;utm_campaign=badge&amp;utm_medium=widget"
          target="_blank"
          class="_authing_a authing-form-badge"
        >
          <span>Protected with</span>
          <span class="authing-form-badge-logo"></span>
          <span>Authing</span>
        </a>
      </div>
      <div class="authing-login-form-wrapper" :class="{'z-index1000': $parent.isMountedInModal}">
        <div
          class="_authing_form-wrapper"
          :class="{
        'authing-loading-wrapper': formLoading || socialButtonsListLoading,
        animated: true,
        fast: true,
        fadeInUp: !closeForm,
        fadeOutDown: closeForm
      }"
        >
          <div class="_authing_form-header">
            <span v-if="pageStack.length > 0" @click="goBack" class="authing-lock-back-button">
              <svg
                focusable="false"
                enable-background="new 0 0 24 24"
                version="1.0"
                viewBox="0 0 24 24"
                xml:space="preserve"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
              >
                <polyline
                  fill="none"
                  points="12.5,21 3.5,12 12.5,3 "
                  stroke="#000000"
                  stroke-miterlimit="10"
                  stroke-width="2"
                ></polyline>
                <line
                  fill="none"
                  stroke="#000000"
                  stroke-miterlimit="10"
                  stroke-width="2"
                  x1="22"
                  x2="3.5"
                  y1="12"
                  y2="12"
                ></line>
              </svg>
            </span>
            <span @click="handleClose" v-if="!opts.hideClose" class="authing-lock-close-button">
              <svg
                focusable="false"
                enable-background="new 0 0 128 128"
                version="1.1"
                viewBox="0 0 128 128"
                xml:space="preserve"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
              >
                <g>
                  <polygon
                    fill="#373737"
                    points="123.5429688,11.59375 116.4765625,4.5185547 64.0019531,56.9306641 11.5595703,4.4882813     4.4882813,11.5595703 56.9272461,63.9970703 4.4570313,116.4052734 11.5244141,123.4814453 63.9985352,71.0683594     116.4423828,123.5117188 123.5126953,116.4414063 71.0732422,64.0019531   "
                  ></polygon>
                </g>
              </svg>
            </span>
            <div class="_authing_form-header-bg"></div>
            <div class="_authing_form-header-welcome">
              <img class="form-header-logo" :src="appLogo">
              <div
                class="_authing_form-header-name"
                title="Authing"
              >{{forgetPasswordVisible ? '重置密码' : appName}}</div>
            </div>
          </div>

          <GlobalMessage v-show="globalMessage" :message="globalMessage" :type="globalMessageType"/>

          <div v-show="!authingOnError">
            <div class="authing-header-tabs-container">
              <ul class="authing-header-tabs">
                <li
                  v-bind:class="{
                  'authing-header-tabs-current': wxQRCodeVisible || (opts.hideUP && opts.hideSocial),
                  'width-55': !isScanCodeEnable || opts.hideUP || opts.forceLogin,
                  'width-100': (opts.hideUP && opts.hideSocial),
                  'shadow-eee': (opts.hideUP && opts.hideSocial),
                }"
                  v-show="isScanCodeEnable && !opts.hideQRCode && !clientInfo.registerDisabled"
                >
                  <a class="_authing_a" href="javascript:void(0)" @click="gotoWxQRCodeScanning">扫码登录</a>
                </li>
                <li
                  v-show="!(opts.hideUP && opts.hideSocial)"
                  v-bind:class="{
                  'authing-header-tabs-current': emailLoginVisible || LDAPLoginVisible,
                  'width-55': !isScanCodeEnable || opts.hideQRCode || opts.hideUP || opts.forceLogin,
                  'width-100': (opts.hideUP && opts.hideQRCode) || (opts.hideQRCode && opts.forceLogin) || clientInfo.registerDisabled,
                }"
                >
                  <a class="_authing_a" href="javascript:void(0)" @click="gotoLogin">登录</a>
                </li>
                <li
                  v-show="!opts.hideUP && !opts.forceLogin && !clientInfo.registerDisabled"
                  v-bind:class="{
                  'authing-header-tabs-current': signUpVisible,
                  'width-55': !isScanCodeEnable || opts.hideQRCode
                }"
                >
                  <a class="_authing_a" @click="gotoSignUp" href="javascript:void(0)">注册</a>
                </li>
              </ul>
            </div>

            <div
              v-if="hasLDAP && (emailLoginVisible || LDAPLoginVisible)"
              class="ldap-radios"
              style="font-size: 13px;color:#777;padding: 0 11px;margin-top:11px;padding-top:6px"
            >
              <label>
                <input
                  type="radio"
                  name="ldap"
                  :checked="emailLoginVisible"
                  style="width: 12px;"
                  @click="gotoLogin"
                > 普通登录
              </label>
              <label>
                <input
                  type="radio"
                  name="ldap"
                  @click="gotoLDAPLogin"
                  :checked="LDAPLoginVisible"
                  style="width: 12px;margin-left:11px"
                > 使用 LDAP
              </label>
            </div>
            <EmailLogin v-show="emailLoginVisible"/>
            <LDAPLogin v-show="LDAPLoginVisible"/>
            <SignUp v-if="signUpVisible"/>
            <QRCode v-if="wxQRCodeVisible"/>
            <ForgetPassword v-if="forgetPasswordVisible"/>
            <PhoneCodeLogin v-if="phoneCodeLoginVisible"/>
            <!-- <div
              class="_authing_form-footer login"
              v-show="!opts.hideUP"
              :class="{
              'no-height': pageVisible.wxQRCodeVisible
            }"
            >
              
            </div>-->
            <div class="authing-loading-circle" v-show="formLoading"></div>

            <div class="_authing_form-footer-non-up" v-show="opts.hideUP"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import GraphQLClient from "../../graphql.js";
import EmailLogin from "./EmailLogin";
import LDAPLogin from "./LDAPLogin";
import QRCode from "./QRCode";
import SignUp from "./SignUp";
import GlobalMessage from "../components/GlobalMessage";
import ForgetPassword from "./forgetPassword/index";
import PhoneCodeLogin from "./PhoneCode";
import { mapGetters, mapActions } from "vuex";
export default {
  name: "app",
  components: {
    EmailLogin,
    SignUp,
    QRCode,
    ForgetPassword,
    GlobalMessage,
    PhoneCodeLogin,
    LDAPLogin
  },
  data() {
    return {
      appLogo: "",
      appName: "",
      clientInfo: {},

      rememberMe: false,

      verifyCodeLoading: true,

      isScanCodeEnable: false,

      opts: {},

      authingOnError: false,

      closeForm: false,
      removeDom: false,

      $authing: null,

      hasLDAP: false
    };
  },
  created() {
    this.$authing = this.$root.$data.$authing;
    this.opts = this.$root.$data.$authing.opts;
    // 将协议的 query 参数存入 vuex
    this.saveProtocol({
      protocol: this.opts.protocol || this.$route.query.protocol,
      params: {
        ...this.$route.query
      },
      isSSO: this.opts.isSSO
    });

    /* 先注释，没有 protocol 参数就默认为 oauth，上面已经处理
    if (!this.protocol) {
      this.$router.replace({
        name: "error",
        query: { message: "缺少协议参数 protocol", code: "id400" }
      });

    }
    */

    document.onkeydown = event => {
      var e = event || window.event || arguments.callee.caller.arguments[0];
      if (e && e.keyCode === 27) {
        this.handleClose();
      }
    };
  },
  async mounted() {
    if (this.opts.isSSO) {
      // 上来先查一下 appInfo
      const appInfo = await this.queryAppInfo();
      if (!appInfo) {
        this.$router.replace({
          name: "error",
          query: {
            message: [
              "应用不存在",
              "请确认传递了正确的 protocol query 参数，不传默认该地址为 OAuth 应用",
              "protocol 参数可选值为 oauth、oidc、saml"
            ]
          }
        });
        return;
      }
      switch (this.protocol) {
        case "oidc":
          if (!this.params.uuid) {
            // this.$router.replace({
            //   name: "error",
            //   query: {
            //     message: [
            //       "缺少 OIDC 所必须的参数 uuid",
            //       "OIDC 应用不能直接输入网址进行登录，需要带参数访问后端 URL，详情请看文档"
            //     ],
            //     doc: "https://docs.authing.cn/authing/advanced/oidc/oidc-authorization#shi-yong-shou-quan-ma-mo-shi-authorization-code-flow"
            //   }
            // });
            location.href = `https://${
              appInfo.domain
            }.authing.cn/oauth/oidc/auth?client_id=${
              appInfo.client_id
            }&redirect_uri=${
              appInfo.redirect_uris[0]
            }&scope=openid profile&response_type=code&state=${Math.random()
              .toString(26)
              .slice(2)}`;
            return;
          }
          break;
        case "saml":
          if (!this.params.SAMLRequest) {
            this.$router.replace({
              name: "error",
              query: {
                message: [
                  "缺少 SAML 所必须的参数 SAMLRequest",
                  "SAML 应用不能直接输入网址进行登录，需要带参数访问后端 URL，详情请看文档"
                ],
                doc:
                  "https://docs.authing.cn/authing/advanced/use-saml/configure-authing-as-sp-and-idp#kai-shi-shi-yong"
              }
            });
            return;
          }
      }

      this.saveAppInfo({ appInfo });
      this.opts.appId = appInfo._id;
      // 判断是否已经登录过了，已经登录就直接跳转确权页面，不再发送后面那些 http 请求
      if (this.isLogged()) {
        this.$router.push({
          name: "authorize",
          query: { ...this.$route.query }
        });
        this.saveLoginStatus({ isLogged: true });
        return;
      }

      const { code: errorCode } = this.$route.query;

      // token 错误或已经过期的情况
      if (errorCode && Number(errorCode) === 2207) {
        this.clearLocalStorage();
      }
    }
    try {
      // 获取应用的名称，图标等信息
      this.appName = this.opts.title || this.appInfo.name;
      window.title = `${this.appName} - Authing`;
      document.title = `${this.appName} - Authing`;
      this.appLogo = this.opts.logo || this.appInfo.image;
      this.clientId = this.appInfo.clientId;
    } catch (erro) {
      console.log(erro);
      that.authingOnError = true;
      that.$authing.pub("authing-unload", erro);
      this.$router.replace({ name: "error", query: { message: erro } });
      return;
    }
    var that = this;
    var auth = null;
    this.checkHasLDAP(that.clientId);

    try {
      auth = new Authing({
        clientId: that.clientId || that.opts.clientId,
        timestamp: that.opts.timestamp,
        nonce: that.opts.nonce,
        host: that.opts.host
      });
    } catch (err) {
      console.log(err);
      this.changeLoading({ el: "page", loading: false });

      that.authingOnError = true;
      that.errMsg = "Error: " + err;
      that.$authing.pub("authing-unload", err);
    }
    if (!auth) {
      return;
    }

    auth
      .then(validAuth => {
        that.clientInfo = validAuth.clientInfo;
        this.changeLoading({ el: "page", loading: false });

        // document
        //   .getElementById("_authing_login_form_content")
        //   .classList.remove("hide");
        window.validAuth = validAuth;

        that.$authing.pub("authing-load", validAuth);

        /*
        if (localStorage.getItem("_authing_username")) {
          that.rememberMe = true;
          that.loginForm.email = localStorage.getItem("_authing_username");
        }

        if (localStorage.getItem("_authing_password")) {
          that.loginForm.password = that.decrypt(
            localStorage.getItem("_authing_password"),
            $authing.opts.clientId
          );
        }
        */
        that.changeLoading({ el: "socialButtonsList", loading: true });
        validAuth
          .readOAuthList()
          .then(data => {
            that.$authing.pub("social-load", data);
            that.changeLoading({ el: "socialButtonsList", loading: false });
            // 刨去 微信扫码登录 的方式
            var socialButtonsList = data.filter(function(item) {
              if (item.alias === "wxapp") {
                that.isScanCodeEnable = true;
              }
              return item.enabled === true && item.alias !== "wxapp";
            });

            that.saveSocialButtonsList({ socialButtonsList });

            if (!that.opts.hideSocial) {
              return;
            }

            if (socialButtonsList.length === 0 && that.opts.hideUP) {
              that.opts.hideSocial = true;
              that.gotoWxQRCodeScanning();
            }
          })
          .catch(err => {
            console.log(err);
            that.$authing.pub("social-unload", err);
            that.changeLoading({ el: "form", loading: false });
          });

        if (that.opts.hideSocial && that.opts.hideUP) {
          that.gotoWxQRCodeScanning();
        }
      })
      .catch(err => {
        console.log(err);
        this.changeLoading({ el: "page", loading: false });
        this.$router.replace({
          name: "error",
          query: { message: "app_id 或 client_id 错误", code: "id404" }
        });
        that.authingOnError = true;
        that.$authing.pub("authing-unload", err);
      });
  },

  methods: {
    ...mapActions("visibility", [
      "gotoWxQRCodeScanning",
      "removeGlobalMsg",
      "gotoSignUp",
      "gotoLogin",
      "gotoLDAPLogin",
      "goBack"
    ]),
    ...mapActions("loading", ["changeLoading"]),
    ...mapActions("data", [
      "saveSocialButtonsList",
      "saveAppInfo",
      "saveLoginStatus"
    ]),
    ...mapActions("protocol", ["saveProtocol"]),
    getSecondLvDomain(hostname) {
      let exp = /(.*)\.authing\.cn/;
      let res = exp.exec(hostname);
      if (res) return res[1];
      return null;
    },
    async queryAppInfo(protocol) {
      protocol = protocol || this.protocol;
      let hostname = location.hostname;
      let domain =
        this.getSecondLvDomain(this.opts.domain) ||
        this.getSecondLvDomain(hostname);
      let appId =
        this.opts.appId ||
        this.$route.query.app_id ||
        this.$route.query.client_id;
      let operationName;
      let GraphQLClient_getAppInfo = new GraphQLClient({
        baseURL: this.opts.host.oauth
      });

      // 优先通过二级域名查找此应用信息
      if (domain && domain !== "sso") {
        // 如果没有提供 protocol 参数，就挨个查一遍吧
        if (!protocol) {
          let queries = [
            `query {
          QueryAppInfoByDomain(domain: "${domain}") {
              _id,
              name,
              image,
              clientId
          }
        }`,
            `query {
          QueryOIDCAppInfoByDomain(domain: "${domain}") {
              _id,
              name,
              image,
              client_id,
              redirect_uris,
              domain
          }
        }`,
            `query {
          QuerySAMLIdentityProviderInfoByDomain(domain: "${domain}") {
              _id,
              name,
              image,
              clientId
          }
        }`
          ];
          let appInfos = await Promise.all(
            queries.map(q => GraphQLClient_getAppInfo.request({ query: q }))
          );
          let [
            { QueryAppInfoByDomain },
            { QueryOIDCAppInfoByDomain },
            { QuerySAMLIdentityProviderInfoByDomain }
          ] = appInfos;
          this.saveProtocol({
            protocol: QuerySAMLIdentityProviderInfoByDomain
              ? "saml"
              : QueryOIDCAppInfoByDomain
              ? "oidc"
              : QueryAppInfoByDomain
              ? "oauth"
              : "",
            params: {
              ...this.$route.query
            }
          });
          return (
            QuerySAMLIdentityProviderInfoByDomain ||
            QueryOIDCAppInfoByDomain ||
            QueryAppInfoByDomain
          );
        }
        // 根据不同的 protocol 查找不同类型的 app
        switch (protocol) {
          case "oidc":
            operationName = "QueryOIDCAppInfoByDomain";
            break;
          case "oauth":
            operationName = "QueryAppInfoByDomain";
            break;
          case "saml":
            operationName = "QuerySAMLIdentityProviderInfoByDomain";
            break;
          default:
            this.$router.replace({
              name: "error",
              query: {
                message: [
                  "protocol query 参数错误",
                  "protocol 可选值为 oauth，oidc，saml"
                ],
                code: "id404"
              }
            });
            return;
        }
        const query = `query {
            ${operationName} (domain: "${domain}") {   
              _id,
              name,
              image,
              clientId
            }
          }`;
        try {
          let appInfo = await GraphQLClient_getAppInfo.request({ query });
          // console.log("queryAppInfo");
          // console.log(appInfo);
          // 返回对应的 app 信息
          switch (protocol) {
            case "oidc":
              return appInfo["QueryOIDCAppInfoByDomain"];
            case "oauth":
              return appInfo["QueryAppInfoByDomain"];
            case "saml":
              return appInfo["QuerySAMLIdentityProviderInfoByDomain"];
          }
        } catch (err) {
          console.log(err);
          this.$router.replace({
            name: "error",
            query: {
              message: [err.message.message || err.message],
              code: "id404"
            }
          });
        }
      } else if (appId) {
        // 如果没有二级域名，就通过 appId 查找
        try {
          switch (protocol) {
            case "oidc":
              operationName = "QueryOIDCAppInfoByAppID";
              break;
            case "oauth":
              operationName = "QueryAppInfoByAppID";
              break;
            case "saml":
              operationName = "QuerySAMLIdentityProviderInfoByAppID";
              break;
            default:
              this.$router.replace({
                name: "error",
                query: {
                  message: [
                    "protocol query 参数错误",
                    "protocol 可选值为 oauth，oidc，saml"
                  ],
                  code: "id404"
                }
              });
              return;
          }
          const query = `query {
          ${operationName} (appId: "${appId}") {
            _id,
            name,
            image,
            clientId
          }
        }`;
          let appInfo = await GraphQLClient_getAppInfo.request({ query });
          switch (protocol) {
            case "oidc":
              return appInfo["QueryOIDCAppInfoByAppID"];
            case "oauth":
              return appInfo["QueryAppInfoByAppID"];
            case "saml":
              return appInfo["QuerySAMLIdentityProviderInfoByAppID"];
          }
        } catch (err) {
          this.$router.replace({
            name: "error",
            query: {
              message: [err.message.message || err.message],
              code: "id404"
            }
          });
        }
      } else {
        // 使用 sso.authing.cn 又没有提供 appId clientId 的情况
        this.$router.replace({
          name: "error",
          query: { message: ["缺少 app_id 或 client_id"], code: "id404" }
        });
      }
    },
    async checkHasLDAP(clientId) {
      let operationName = "QueryClientHasLDAPConfigs";
      let query =
        `query {
              ${operationName} (clientId: "` +
        clientId +
        `") {   
                result,
              }
            }
        `;

      let GraphQLClient_getInfo = new GraphQLClient({
        baseURL: this.opts.host.oauth
      });

      try {
        const hasLDAP = await GraphQLClient_getInfo.request({ query });
        this.hasLDAP = hasLDAP.QueryClientHasLDAPConfigs.result;
      } catch (erro) {
        console.log(erro);
      }
    },
    clearLocalStorage() {
      localStorage.removeItem("appToken");
      localStorage.removeItem("_authing_username");
      localStorage.removeItem("_authing_password");
      localStorage.removeItem("_authing_token");
    },

    handleGoBack: function handleGoBack() {
      var lastState = this.pageStack.pop();
      if (lastState) {
        this.pageVisible = Object.assign({}, lastState);
      }
      if (this.loading) {
        this.unLoading();
      }
    },
    handleClose: function handleClose() {
      if (this.opts.hideClose) {
        return false;
      }
      var that = this;
      this.closeForm = true;
      this.$authing.pub("form-closed");
      setTimeout(function() {
        that.removeDom = true;
      }, 800);
    },
    isLogged() {
      let appToken = localStorage.getItem("appToken");

      if (appToken) {
        try {
          appToken = JSON.parse(appToken);
          let accessToken = appToken[this.opts.appId].accessToken;
          let payload = accessToken.split(".")[1];
          let decoded = window.atob(payload);
          let expired = parseInt(Date.now() / 1000) > decoded.exp;
          if (expired) {
            delete appToken[this.opts.appId];
            localStorage.removeItem("_authing_token");
            localStorage.setItem("appToken", appToken);
          }
        } catch (error) {
          console.log(error);
          appToken = {};
          localStorage.removeItem("appToken");
        }
      } else {
        appToken = {};
      }

      return appToken[this.opts.appId] && appToken[this.opts.appId].accessToken;
    }
  },
  computed: {
    ...mapGetters("visibility", {
      emailLoginVisible: "emailLogin",
      wxQRCodeVisible: "wxQRCode",
      signUpVisible: "signUp",
      forgetPasswordVisible: "forgetPassword",
      phoneCodeLoginVisible: "phoneCodeLogin",
      LDAPLoginVisible: "LDAPLogin",
      pageStack: "pageStack"
    }),
    ...mapGetters("data", ["globalMessage", "globalMessageType", "appInfo"]),
    ...mapGetters("loading", {
      socialButtonsListLoading: "socialButtonsList",
      formLoading: "form",
      pageLoading: "page"
    }),
    ...mapGetters("protocol", ["protocol", "params"])
  },
  watch: {
    rememberMe: function(newVal) {
      if (newVal === false) {
        localStorage.removeItem("_authing_username");
        localStorage.removeItem("_authing_password");
      }
    }
  }
};
</script>

<style>
/* @media screen and (min-width: 480px) {
  ._authing_form-footer.phone-code-wrapper {
    position: absolute;
    right: 22px;
    margin-top: 0px !important;
  }
} */

@media screen and (max-width: 480px) {
  ._authing_form-footer.phone-code-wrapper {
    position: relative;
  }

  /* #login-phoneCode {
    margin-top: 55px;
  } */
}
</style>