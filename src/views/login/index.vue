<template>
  <div id="_authing_login_form" @keyup.esc="handleClose" v-if="!removeDom">
    <div class="authing-loading-circle screen-center" v-if="pageLoading"></div>
    <div
      class="authing-cover-layer"
      v-if="$parent.isMountedInModal && !closeForm"
    ></div>
    <div
      class="_authing_container"
      id="_authing_login_form_content"
      :class="{
        hide: pageLoading,
        'authing-login-form-modal': $parent.isMountedInModal
      }"
    >
      <div
        v-if="!closeForm"
        class="authing-form-badge-bottom"
        :class="{ 'authing-form-badge-white': $parent.isMountedInModal }"
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
      <div
        class="authing-login-form-wrapper"
        :class="{ 'z-index1000': $parent.isMountedInModal }"
      >
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
                />
                <line
                  fill="none"
                  stroke="#000000"
                  stroke-miterlimit="10"
                  stroke-width="2"
                  x1="22"
                  x2="3.5"
                  y1="12"
                  y2="12"
                />
              </svg>
            </span>
            <span
              @click="handleClose"
              v-if="!opts.hideClose"
              class="authing-lock-close-button"
            >
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
                  />
                </g>
              </svg>
            </span>
            <div class="_authing_form-header-bg"></div>
            <div class="_authing_form-header-welcome">
              <img class="form-header-logo" :src="appLogo" />
              <div class="_authing_form-header-name" title="Authing">
                {{ forgetPasswordVisible ? "重置密码" : appName }}
              </div>
            </div>
          </div>

          <GlobalMessage
            v-show="globalMessage"
            :message="globalMessage"
            :type="globalMessageType"
          />

          <div v-show="!authingOnError">
            <div class="authing-header-tabs-container">
              <ul class="authing-header-tabs">
                <li
                  v-bind:class="{
                    'authing-header-tabs-current':
                      wxQRCodeVisible || (opts.hideUP && opts.hideSocial),
                    'width-55': headerTabCount === 2,
                    'width-100': headerTabCount === 1,
                    'shadow-eee': opts.hideUP && opts.hideSocial
                  }"
                  v-show="
                    isScanCodeEnable &&
                      !opts.hideQRCode &&
                      (!clientInfo.registerDisabled ||
                        clientInfo.showWXMPQRCode)
                  "
                >
                  <a
                    class="_authing_a"
                    href="javascript:void(0)"
                    @click="gotoWxQRCodeScanning"
                    >扫码登录</a
                  >
                </li>
                <li
                  v-show="!(opts.hideUP && opts.hideSocial)"
                  v-bind:class="{
                    'authing-header-tabs-current':
                      emailLoginVisible || LDAPLoginVisible,
                    'width-55': headerTabCount === 2,
                    'width-100': headerTabCount === 1
                  }"
                >
                  <a
                    class="_authing_a"
                    href="javascript:void(0)"
                    @click="gotoLogin"
                    >登录</a
                  >
                </li>
                <li
                  v-show="
                    !opts.hideUP &&
                      !opts.forceLogin &&
                      !clientInfo.registerDisabled &&
                      !opts.hideRegister
                  "
                  v-bind:class="{
                    'authing-header-tabs-current': signUpVisible,
                    'width-55': headerTabCount === 2
                  }"
                >
                  <a
                    class="_authing_a"
                    @click="gotoSignUp"
                    href="javascript:void(0)"
                    >注册</a
                  >
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
                />
                普通登录
              </label>
              <label>
                <input
                  type="radio"
                  name="ldap"
                  @click="gotoLDAPLogin"
                  :checked="LDAPLoginVisible"
                  style="width: 12px;margin-left:11px"
                />
                使用 LDAP
              </label>
            </div>
            <EmailLogin v-show="emailLoginVisible" :opts="opts" />
            <LDAPLogin v-show="LDAPLoginVisible" />
            <SignUp v-if="signUpVisible" />
            <QRCode v-if="wxQRCodeVisible" />
            <ForgetPassword v-if="forgetPasswordVisible" />
            <PhoneLogin v-if="phoneCodeLoginVisible" />
            <MFACode v-if="MFACodeVisible" />
            <SignUpByPhone v-if="signUpByPhoneVisible" />
            <!-- <div
              class="_authing_form-footer login"
              v-show="!opts.hideUP"
              :class="{
              'no-height': pageVisible.wxQRCodeVisible
            }"
            >
              
            </div>-->
            <div class="authing-loading-circle" v-show="formLoading"></div>

            <!-- <div class="_authing_form-footer-non-up" v-show="opts.hideUP"></div> -->
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
import PhoneLogin from "./PhoneLogin";
import SignUpByPhone from "./SignUpByPhone";
import MFACode from "./MFACode";
// import SSO from "@authing/sso";
import { mapGetters, mapActions } from "vuex";
export default {
  name: "app",
  components: {
    EmailLogin,
    SignUp,
    QRCode,
    ForgetPassword,
    GlobalMessage,
    LDAPLogin,
    MFACode,
    SignUpByPhone,
    PhoneLogin
  },
  data() {
    return {
      redirectToProfile: false,
      appLogo: "",
      appName: "",
      defaultLogo: "https://usercontents.authing.cn/client/logo@2.png",
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
    // 判断 opts 中是否传入了自定义 css
    if (this.opts.css) {
      let styleNode = document.createElement("style");
      styleNode.type = "text/css";
      let content = document.createTextNode(this.opts.css);
      styleNode.appendChild(content);
      document.head.appendChild(styleNode);
    }

    if (this.opts.isSSO) {
      if (this.$route.query.profile) {
        this.redirectToProfile = true;
      }
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
      // 如果启用了自定义 css
      if (appInfo.css) {
        let styleNode = document.createElement("style");
        styleNode.type = "text/css";
        let content = document.createTextNode(appInfo.css);
        styleNode.appendChild(content);
        document.head.appendChild(styleNode);
      }

      // 如果启用了自定义配置
      if (appInfo.customStyles) {
        // 在这里根据自定义配置修改相应界面
        this.opts = this.$root.$data.$authing.opts = {
          ...this.$root.$data.$authing.opts,
          ...appInfo.customStyles
        };
      }

      switch (this.protocol) {
        case "oidc":
          if (!this.params.uuid) {
            // 如果用户直接输入网址，什么参数也不带
            // 把 ssoHost 域名第一部分替换成 oidc 应用的 domain 再作为地址
            let ssoHostArr = this.opts.SSOHost.split(".");
            let head = ssoHostArr.shift();
            let isHttps = false;
            if (~head.indexOf("https")) {
              isHttps = true;
            }
            ssoHostArr.unshift(appInfo.domain);
            let ssoHost = ssoHostArr.join(".");
            // 这么写是为了动态生成这个链接，否则私有部署会出问题
            location.href = `${
              isHttps ? "https://" : "http://"
            }${ssoHost}/oauth/oidc/auth?client_id=${
              appInfo.client_id
            }&redirect_uri=${encodeURIComponent(
              appInfo.redirect_uris[0]
            )}&scope=openid profile&response_type=code&state=${Math.random()
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
      if (await this.isLogged()) {
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
      this.appName = this.opts.title || this.appInfo.name || "Guard";
      window.title = `${this.appName} - Authing`;
      document.title = `${this.appName} - Authing`;
      this.appLogo = this.opts.logo || this.appInfo.image || this.defaultLogo;
      this.clientId = this.appInfo.clientId;
    } catch (erro) {
      console.log(erro);
      that.authingOnError = true;
      that.$authing.pub("authing-unload", erro);
      this.$router.replace({ name: "error", query: { message: erro } });
      return;
    }
    var that = this;
    this.checkHasLDAP(that.clientId);

    let auth = new Authing({
      userPoolId: that.clientId || that.opts.clientId,
      useSelfWxapp: that.opts.useSelfWxapp,
      host: that.opts.host,
      onInitError: err => {
        this.changeLoading({ el: "page", loading: false });

        this.authingOnError = true;
        this.showGlobalMessage({
          type: "error",
          message: "Error: " + err.message
        });
        this.$authing.pub("authing-unload", err);
      }
    });

    let userPoolSettings = await auth.getUserPoolSettings(
      that.clientId || that.opts.clientId
    );
    this.clientInfo = userPoolSettings;
    this.changeLoading({ el: "page", loading: false });

    window.validAuth = auth;
    window.validAuth.clientInfo = userPoolSettings;
    this.$authing.pub("authing-load", validAuth);
    if (that.opts.hideSocial && that.opts.hideUP) {
      that.gotoWxQRCodeScanning();
    }
    try {
      if (this.opts.hideSocial === false) {
        // 不隐藏社会化登录时，才加载社会化登录列表
        this.changeLoading({ el: "socialButtonsList", loading: true });
        let data = await auth.readOAuthList({ useGuard: true });
        this.changeLoading({ el: "socialButtonsList", loading: false });

        // 刨去 微信扫码登录 的方式
        // 如果是 native 端，只保留移动应用
        let socialButtonsList = data.filter(item => {
          if (item.alias === "wxapp") {
            this.isScanCodeEnable = true;
          }

          if (!that.opts.isNative) {
            return (
              item.enabled === true &&
              !["wxapp", "wechatapp", "wechatmp"].includes(item.alias)
            );
          } else {
            return (
              item.enabled === true &&
              (item.alias === "wechatios" ||
                item.alias === "alipaymobile" ||
                item.alias === "wechatandroid")
            );
          }
        });

        socialButtonsList = socialButtonsList.map(item => {
          if (
            item.alias === "alipaymobile" ||
            item.alias === "wechatios" ||
            item.alias === "wechatandroid"
          ) {
            item.isNative = true;
          }
          return item;
        });

        this.$authing.pub("social-load", socialButtonsList);

        this.saveSocialButtonsList({ socialButtonsList });

        // if (!this.opts.hideSocial) {
        //   return;
        // }

        if (socialButtonsList.length === 0 && this.opts.hideUP) {
          // 如果没开启社会化登录，同时指定隐藏用户密码登录，就自动转到小程序扫码登录
          this.opts.hideSocial = true;
          this.gotoWxQRCodeScanning();
        }
      }
    } catch (err) {
      this.$authing.pub("social-unload", err);
      this.changeLoading({ el: "form", loading: false });
    }
  },
  destroyed() {
    sessionStorage.removeItem("jump2Profile");
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
      "saveLoginStatus",
      "showGlobalMessage"
    ]),
    ...mapActions("protocol", ["saveProtocol"]),
    getSecondLvDomain(hostname) {
      if (!hostname) return null;
      let hostnameSplit = hostname.split(".");
      // 只有域名部分由三部分以上组成才算拥有二级域名
      if (hostnameSplit.length >= 3) {
        return hostnameSplit[0];
      }
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
                _id
                name
                image
                domain
                clientId
                css
              }
            }`,
            `query {
              QueryOIDCAppInfoByDomain(domain: "${domain}") {
                _id,
                name
                image
                client_id
                redirect_uris
                domain
                css
                customStyles {
                  forceLogin
                  hideQRCode
                  hideUP
                  hideUsername
                  hideRegister
                  hidePhone
                  hideSocial
                  hideClose
                  placeholder {
                    username
                    email
                    password
                    confirmPassword
                    verfiyCode
                    newPassword
                    phone
                    phoneCode
                  }
                  qrcodeScanning {
                    interval
                    tips
                  }
                }
              }
            }`,
            `query {
              QuerySAMLIdentityProviderInfoByDomain(domain: "${domain}") {
                _id,
                name,
                image,
                domain
                clientId
                css
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
            },
            isSSO: this.opts.isSSO
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
                code: "4004"
              }
            });
            return;
        }

        let query;
        if (operationName !== "QueryOIDCAppInfoByDomain") {
          query = `query {
            ${operationName} (domain: "${domain}") {   
              _id
              name
              domain
              image
              clientId
              css
            }
          }`;
        } else {
          query = `query {
            ${operationName} (domain: "${domain}") {   
              _id
              name
              domain
              image
              clientId
              css
              customStyles {
                forceLogin
                hideQRCode
                hideUP
                hideUsername
                hideRegister
                hidePhone
                hideSocial
                hideClose
                placeholder {
                  username
                  email
                  password
                  confirmPassword
                  verfiyCode
                  newPassword
                  phone
                  phoneCode
                }
                qrcodeScanning {
                  interval
                  tips
                }
              }
            }
          }`;
        }

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
          // 如果没有提供 protocol 参数，就挨个查一遍吧
          if (!protocol) {
            let queries = [
              `query {
                QueryAppInfoByAppID(appId: "${appId}") {
                  _id
                  domain
                  name
                  image
                  clientId
                  css
                }
              }`,
              `query {
                QueryOIDCAppInfoByAppID(appId: "${appId}") {
                  _id
                  name
                  image
                  client_id
                  redirect_uris
                  domain
                  css
                  customStyles {
                    forceLogin
                    hideQRCode
                    hideUP
                    hideUsername
                    hideRegister
                    hidePhone
                    hideSocial
                    hideClose
                    placeholder {
                      username
                      email
                      password
                      confirmPassword
                      verfiyCode
                      newPassword
                      phone
                      phoneCode
                    }
                    qrcodeScanning {
                      interval
                      tips
                    }
                  }
                }
              }`,
              `query {
                  QuerySAMLIdentityProviderInfoByAppID(appId: "${appId}") {
                    _id
                    domain
                    name
                    image
                    clientId
                    css
                }
              }`
            ];
            let appInfos = await Promise.all(
              queries.map(q => GraphQLClient_getAppInfo.request({ query: q }))
            );
            let [
              { QueryAppInfoByAppID },
              { QueryOIDCAppInfoByAppID },
              { QuerySAMLIdentityProviderInfoByAppID }
            ] = appInfos;
            this.saveProtocol({
              protocol: QuerySAMLIdentityProviderInfoByAppID
                ? "saml"
                : QueryOIDCAppInfoByAppID
                ? "oidc"
                : QueryAppInfoByAppID
                ? "oauth"
                : "",
              params: {
                ...this.$route.query
              },
              isSSO: this.opts.isSSO
            });
            return (
              QuerySAMLIdentityProviderInfoByAppID ||
              QueryOIDCAppInfoByAppID ||
              QueryAppInfoByAppID
            );
          }

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

          let query;
          if (operationName !== "QueryOIDCAppInfoByAppID") {
            query = `query {
              ${operationName} (appId: "${appId}") {
                _id,
                name,
                image,
                clientId
                css
              }
            }`;
          } else {
            query = `query {
              ${operationName} (appId: "${appId}") {
                _id,
                name,
                image,
                clientId
                css
                customStyles {
                  forceLogin
                  hideQRCode
                  hideUP
                  hideUsername
                  hideRegister
                  hidePhone
                  hideSocial
                  hideClose
                  placeholder {
                    username
                    email
                    password
                    confirmPassword
                    verfiyCode
                    newPassword
                    phone
                    phoneCode
                  }
                  qrcodeScanning {
                    interval
                    tips
                  }
                }
              }
            }`;
          }
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
          console.log(err);
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
      let query = `query {
              ${operationName} (clientId: "${clientId}") {   
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

    handleClose() {
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
    async isLogged() {
      let appToken = localStorage.getItem("appToken");

      if (appToken) {
        try {
          appToken = JSON.parse(appToken);
          let accessToken = appToken[this.opts.appId].accessToken;
          let payload = accessToken.split(".")[1];
          let decoded = window.atob(payload);
          decoded = JSON.parse(decoded);
          let expired = parseInt(Date.now() / 1000) > decoded.exp;
          if (expired) {
            delete appToken[this.opts.appId];
            localStorage.removeItem("_authing_token");
            localStorage.setItem("appToken", appToken);
          }
        } catch (error) {
          // console.log(error);
          appToken = {};
          localStorage.removeItem("appToken");
        }
      } else {
        appToken = {};
      }
      //是不是 sso.authing.cn 这种总的域名
      // let isSSOAuthing = location.hostname.match(/^sso\./);
      // baseDomain = authing.cn 这种后面的部分的域名
      // let auth = new SSO({
      //   appId: this.appInfo._id,
      //   appType: this.protocol,
      //   appDomain: isSSOAuthing
      //     ? "sso." + this.opts.baseDomain
      //     : this.appInfo.domain + "." + this.opts.baseDomain
      //   // dev: true
      // });
      // let sess = await auth.trackSession();
      let sess = { session: null };
      if (!sess.session) {
        localStorage.removeItem("_authing_token");
        localStorage.removeItem("_authing_userInfo");
        localStorage.removeItem("_authing_clientInfo");
        try {
          let appToken = localStorage.getItem("appToken");
          let obj = JSON.parse(appToken);
          delete obj[this.opts.appId];
          localStorage.setItem("appToken", JSON.stringify(obj));
        } catch (err) {
          // 什么也不做，吞掉 error
        }
        return false;
      }
      return appToken[this.opts.appId] && appToken[this.opts.appId].accessToken;
    }
  },
  computed: {
    headerTabCount() {
      let arr = ["scan-wx-mp", "login", "register"];
      if (
        !this.isScanCodeEnable ||
        this.opts.hideQRCode ||
        (this.clientInfo.registerDisabled && !this.clientInfo.showWXMPQRCode)
      ) {
        let idx = arr.findIndex(v => v === "scan-wx-mp");
        if (~idx) {
          arr.splice(idx, 1);
        }
      }

      if (this.opts.hideSocial && this.opts.hideUP) {
        let idx = arr.findIndex(v => v === "login");
        if (~idx) {
          arr.splice(idx, 1);
        }
      }
      if (
        this.opts.hideUP ||
        this.opts.forceLogin ||
        this.clientInfo.registerDisabled ||
        this.opts.hideRegister
      ) {
        let idx = arr.findIndex(v => v === "register");
        if (~idx) {
          arr.splice(idx, 1);
        }
      }
      return arr.length;
    },
    ...mapGetters("visibility", {
      emailLoginVisible: "emailLogin",
      wxQRCodeVisible: "wxQRCode",
      signUpVisible: "signUp",
      signUpByPhoneVisible: "signUpByPhone",
      forgetPasswordVisible: "forgetPassword",
      phoneCodeLoginVisible: "phoneCodeLogin",
      phonePasswordLoginVisible: "phonePasswordLogin",
      isPhoneLogin: "",
      LDAPLoginVisible: "LDAPLogin",
      pageStack: "pageStack",
      MFACodeVisible: "MFACode"
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
