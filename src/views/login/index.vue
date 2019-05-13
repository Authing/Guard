<template>
  <div id="_authing_login_form" @keyup.esc="handleClose" v-if="!removeDom">
    <div class="authing-loading-circle screen-center" id="page-loading"></div>
    <div class="authing-cover-layer" v-if="$parent.isMountedInModal && !closeForm"></div>
    <div
      class="_authing_container hide"
      id="_authing_login_form_content"
      :class="{'authing-login-form-modal': $parent.isMountedInModal}"
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
            <span
              v-if="pageStack.length > 0"
              @click="goBack"
              class="authing-lock-back-button"
            >
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
              <img class="form-header-logo" :src="opts.logo">
              <div
                class="_authing_form-header-name"
                title="Authing"
              >{{forgetPasswordVisible ? '重置密码' : opts.title}}</div>
            </div>
          </div>
          
          <GlobalMessage v-show="globalMessage" :message="globalMessage" :type="globalMessageType"/>
          
          <div v-show="!authingOnError">
            <div class="authing-header-tabs-container">
              <ul class="authing-header-tabs">
                <li
                  v-bind:class="{
                  'authing-header-tabs-current': wxQRCodeVisible || (opts.hideUP && opts.hideOAuth),
                  'width-55': !isScanCodeEnable || opts.hideUP || opts.forceLogin,
                  'width-100': (opts.hideUP && opts.hideOAuth),
                  'shadow-eee': (opts.hideUP && opts.hideOAuth),
                }"
                  v-show="isScanCodeEnable && !opts.hideQRCode && !clientInfo.registerDisabled"
                >
                  <a class="_authing_a" href="javascript:void(0)" @click="gotoWxQRCodeScanning">扫码登录</a>
                </li>
                <li
                  v-show="!(opts.hideUP && opts.hideOAuth)"
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
              style="font-size: 13px;color:#777;padding: 0 11px;"
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
              <div class="authing-loading-circle" v-show="loading"></div>
              
            </div>-->

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
      clientInfo: {},
      validAuth: null,

      errMsg: "",
      successMsg: "",
      warnMsg: "",
      successVisible: false,
      errVisible: false,
      warnVisible: false,

      rememberMe: false,

      verifyCodeLoading: true,

      isWxQRCodeGenerated: false,

      isScanCodeEnable: false,

      opts: {},

      authingOnError: false,

      closeForm: false,
      removeDom: false,

      $authing: null,

      loginMethod: "common",
      hasLDAP: false
    };
  },
  async mounted() {
    var that = this;
    var auth = null;

    const { context, code: errorCode } = this.$route.query;

    // token 错误或已经过期的情况
    if (errorCode && Number(errorCode) === 2207) {
      this.clearLocalStorage();
    }

    let operationName;
    if (context === "OIDC") {
      operationName = "QueryOIDCAppInfoByAppID";
    } else if (context === "SAMLIdP") {
      operationName = "QuerySAMLIdentityProviderInfoByAppID";
    } else {
      operationName = "QueryAppInfoByAppID";
    }
    let query =
      `query {
            ${operationName} (appId: "` +
      that.opts.appId +
      `") {   
              _id,
              clientId,
              name,
              image
            }
          }
      `;

    let GraphQLClient_getInfo = new GraphQLClient({
      baseURL: that.opts.host.oauth
    });

    try {
      const oAuthAppInfo = await GraphQLClient_getInfo.request({ query });

      if (
        !(
          oAuthAppInfo.QueryAppInfoByAppID ||
          oAuthAppInfo.QueryOIDCAppInfoByAppID ||
          oAuthAppInfo.QuerySAMLIdentityProviderInfoByAppID
        )
      ) {
        that.authingOnError = true;
        that.errMsg = "Error: 找不到此应用";
        that.$authing.pub("authingUnload", "找不到此应用");
        throw that.errMsg;
      }
      let info;
      if (context === "OIDC") {
        info = oAuthAppInfo.QueryOIDCAppInfoByAppID;
      } else if (context === "SAMLIdP") {
        info = oAuthAppInfo.QuerySAMLIdentityProviderInfoByAppID;
      } else {
        info = oAuthAppInfo.QueryAppInfoByAppID;
      }
      that.opts.title = that.opts.title || info.name;
      window.title = `${that.opts.title} - Authing`;
      document.title = `${that.opts.title} - Authing`;
      that.opts.logo = that.opts.logo || info.image;
      that.opts.clientId = info.clientId;
    } catch (erro) {
      that.authingOnError = true;
      that.errMsg = "Error: " + erro;
      that.$authing.pub("authingUnload", erro);
    }

    this.checkHasLDAP(that.opts.clientId);

    try {
      auth = new Authing({
        clientId: that.opts.clientId,
        timestamp: that.opts.timestamp,
        nonce: that.opts.nonce,
        host: that.opts.host
      });
    } catch (err) {
      document.getElementById("page-loading").remove();
      document
        .getElementById("_authing_login_form_content")
        .classList.remove("hide");
      that.authingOnError = true;
      that.errMsg = "Error: " + err;
      that.$authing.pub("authingUnload", err);
    }

    if (!auth) {
      return;
    }

    auth
      .then(function(validAuth) {
        that.clientInfo = validAuth.clientInfo;
        document.getElementById("page-loading").remove();
        document
          .getElementById("_authing_login_form_content")
          .classList.remove("hide");
        window.validAuth = validAuth;

        that.$authing.pub("authenticated", validAuth);

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

        that.changeLoading({ el: "socialButtonsList", loading: true });
        validAuth
          .readOAuthList()
          .then(data => {
            that.$authing.pub("oauthLoad", data);
            that.changeLoading({ el: "socialButtonsList", loading: false });
            // 刨去 微信扫码登录 的方式
            var socialButtonsList = data.filter(function(item) {
              if (item.alias === "wxapp") {
                that.isScanCodeEnable = true;
              }
              return item.enabled === true && item.alias !== "wxapp";
            });

            that.saveSocialButtonsList({ socialButtonsList });

            if (!that.opts.hideOAuth) {
              return;
            }

            if (socialButtonsList.length === 0 && that.opts.hideUP) {
              that.opts.hideOAuth = true;
              that.gotoWxQRCodeScanning();
            }
          })
          .catch(err => {
            console.log(err);
            that.$authing.pub("oauthUnload", err);
            that.changeLoading({ el: "form", loading: true });
          });

        if (that.opts.hideOAuth && that.opts.hideUP) {
          that.gotoWxQRCodeScanning();
        }
      })
      .catch(function(err) {
        let pageLoading = document.getElementById("page-loading");
        pageLoading && document.getElementById("page-loading").remove();
        document
          .getElementById("_authing_login_form_content")
          .classList.remove("hide");
        that.authingOnError = true;
        that.errMsg = "初始化出错，请检查 clientID 是否正确";
        that.$authing.pub("authenticatedOnError", err);
      });
  },
  created: function() {
    this.$authing = this.$root.$data.$authing;
    this.opts = this.$authing.opts;

    document.onkeydown = event => {
      var e = event || window.event || arguments.callee.caller.arguments[0];
      if (e && e.keyCode === 27) {
        this.handleClose();
      }
    };
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
    ...mapActions("data", ["saveSocialButtonsList"]),
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
        this.changeVisibility;
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

    getPageState: function getPageState() {
      return Object.assign({}, this.pageVisible);
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

    recordLoginInfo: function(userInfo) {
      let appToken = localStorage.getItem("appToken");

      if (appToken) {
        try {
          appToken = JSON.parse(appToken);
        } catch (error) {
          appToken = {};
        }
      } else {
        appToken = {};
      }

      appToken[appId] = {
        accessToken: userInfo.token,
        userInfo: userInfo
      };

      localStorage.setItem("appToken", JSON.stringify(appToken));
    },
    handleClose: function handleClose() {
      if (this.opts.hideClose) {
        return false;
      }
      var that = this;
      this.closeForm = true;
      this.$authing.pub("formClosed");
      setTimeout(function() {
        that.removeDom = true;
      }, 800);
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
    ...mapGetters("data", ["globalMessage", "globalMessageType"]),
    ...mapGetters("loading", {
      socialButtonsListLoading: "socialButtonsList",
      formLoading: "form"
    })
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