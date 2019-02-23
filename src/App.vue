<template>
  <div id="_authing_login_form" @keyup.esc="handleClose" v-if="!removeDom">
    <div class="authing-loading-circle screen-center" id="page-loading"></div>
    <div class="authing-cover-layer" v-if="$parent.isMountedInModal && !closeForm"></div>
    <div class="_authing_container hide" id="_authing_login_form_content"
         :class="{'authing-login-form-modal': $parent.isMountedInModal}">
      <div v-if="!closeForm" class="authing-form-badge-bottom"
           :class="{'authing-form-badge-white': $parent.isMountedInModal}">
        <a href="https://authing.cn/?utm_source=form&amp;utm_campaign=badge&amp;utm_medium=widget" target="_blank"
           class="_authing_a authing-form-badge">
          <span>Protected with</span> <span class="authing-form-badge-logo"></span> <span>Authing</span>
        </a>
      </div>
      <div class="authing-login-form-wrapper" :class="{'z-index1000': $parent.isMountedInModal}">

        <div class="_authing_form-wrapper" :class="{
        'authing-loading-wrapper': loading || oAuthloading,
        animated: true,
        fast: true,
        fadeInUp: !closeForm,
        fadeOutDown: closeForm
      }">
          <div class="_authing_form-header">
            <span v-if="pageStack.length > 0" @click="handleGoBack" class="authing-lock-back-button"><svg focusable="false" enable-background="new 0 0 24 24" version="1.0" viewBox="0 0 24 24" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"> <polyline fill="none" points="12.5,21 3.5,12 12.5,3 " stroke="#000000" stroke-miterlimit="10" stroke-width="2"></polyline> <line fill="none" stroke="#000000" stroke-miterlimit="10" stroke-width="2" x1="22" x2="3.5" y1="12" y2="12"></line> </svg></span>
            <span @click="handleClose" v-if="!opts.hideClose" class="authing-lock-close-button"><svg focusable="false" enable-background="new 0 0 128 128" version="1.1" viewBox="0 0 128 128" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><polygon fill="#373737" points="123.5429688,11.59375 116.4765625,4.5185547 64.0019531,56.9306641 11.5595703,4.4882813     4.4882813,11.5595703 56.9272461,63.9970703 4.4570313,116.4052734 11.5244141,123.4814453 63.9985352,71.0683594     116.4423828,123.5117188 123.5126953,116.4414063 71.0732422,64.0019531   "></polygon></g></svg></span>
            <div class="_authing_form-header-bg"></div>
            <div class="_authing_form-header-welcome">
              <img class="form-header-logo"
                   :src="opts.logo">
              <div class="_authing_form-header-name" title="Authing">{{pageVisible.forgetPasswordVisible ? '重置密码' : opts.title}}
              </div>
            </div>
          </div>

          <div v-show="errVisible || authingOnError" class="authing-global-message authing-global-message-error">
              <span class="animated fadeInUp">
                <span>{{errMsg}}</span>
              </span>
          </div>

          <div v-show="successVisible" class="authing-global-message authing-global-message-success">
              <span class="animated fadeInUp">
                <span>{{successMsg}}</span>
              </span>
          </div>

          <div v-show="warnVisible" class="authing-global-message authing-global-message-info">
                <span class="animated fadeInUp">
                  <span>{{warnMsg}}</span>
                </span>
          </div>

          <div v-show="!authingOnError">
            <div class="authing-header-tabs-container">
              <ul class="authing-header-tabs">
                <li v-bind:class="{
                  'authing-header-tabs-current': pageVisible.wxQRCodeVisible || (opts.hideUP && opts.hideOAuth),
                  'width-55': !isScanCodeEnable || opts.hideUP || opts.forceLogin,
                  'width-100': (opts.hideUP && opts.hideOAuth),
                  'shadow-eee': (opts.hideUP && opts.hideOAuth),
                }" v-show="isScanCodeEnable && !opts.hideQRCode">
                  <a class="_authing_a" href="javascript:void(0)" @click="gotoWxQRCodeScanning">扫码登录</a>
                </li>
                <li 
                  v-show="!(opts.hideUP && opts.hideOAuth)"
                  v-bind:class="{
                  'authing-header-tabs-current': pageVisible.loginVisible,
                  'width-55': !isScanCodeEnable || opts.hideQRCode || opts.hideUP || opts.forceLogin,
                  'width-100': (opts.hideUP && opts.hideQRCode) || (opts.hideQRCode && opts.forceLogin),
                }">
                  <a class="_authing_a" href="javascript:void(0)" @click="gotoLogin">登录</a>
                </li>
                <li v-show="!opts.hideUP && !opts.forceLogin" v-bind:class="{
                  'authing-header-tabs-current': pageVisible.signUpVisible,
                  'width-55': !isScanCodeEnable || opts.hideQRCode
                }">
                  <a class="_authing_a" @click="gotoSignUp" href="javascript:void(0)">注册</a>
                </li>
              </ul>
            </div>

            <div class="authing-oauth-form"
                 v-show="!pageVisible.forgetPasswordVisible && !pageVisible.wxQRCodeVisible && !opts.hideOAuth">
              <div style="height: 60px;" v-show="oAuthloading">
                <div class="authing-loading-circle margin-top-11"></div>
              </div>

              <div v-for="(item) in OAuthList" :key="item._id" class="_authing_form-group">
                <div class="_authing-logmod__alter">
                  <div class="logmod__alter-container">
                    <a
                      :href="item.url"
                      :class="{'_authing_a': true, '_authing-connect': true, 'github': item.alias === 'github', 'wechat': item.alias === 'wechatpc'}">
                      <div class="_authing-connect__icon">
                        <i class="_authing_iconfont" v-if="item.alias === 'github'">&#xea0a;</i>
                        <i class="_authing_iconfont" v-if="item.alias === 'wechatpc'">&#xf262;</i>
                      </div>
                      <div class="_authing-connect__context">
                        <span>{{item.description}}</span>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
              <P class="_authing_form-tip" v-show="!oAuthloading && OAuthList.length > 0 && !opts.hideUP">或者</P>
            </div>

            <div class="form-body" v-show="!oAuthloading" :class="{height100: pageVisible.wxQRCodeVisible}">
              <form v-show="pageVisible.loginVisible && !opts.hideUP" action="#"
                    class="authing-form animate-box no-shadow">

                <div v-show="opts.forceLogin" class="authing_force_login_tips" style="text-align:center">
                  <p>输入帐号密码登录</p>
                  <p>如果您没有帐号，我们会自动创建</p>
                </div>

                <div class="_authing_form-group">
                  <input type="text" class="_authing_input _authing_form-control" id="login-username" v-model="loginForm.email"
                         :placeholder="opts.placeholder.email"
                         autocomplete="off" @keyup.enter="handleLogin">
                </div>
                <div class="_authing_form-group">
                  <input type="password" class="_authing_input _authing_form-control" id="login-password" v-model="loginForm.password"
                         :placeholder="opts.placeholder.password" autocomplete="off" @keyup.enter="handleLogin">
                </div>
                <div v-show="pageVisible.verifyCodeVisible" class="form-group verify-code">
                  <input type="text" class="_authing_input _authing_form-control" id="verify-code" v-model="verifyCode"
                         :placeholder="opts.placeholder.verfiyCode"
                         autocomplete="off" @keyup.enter="handleLogin">

                  <div class="_authing_verify-code-loading-circle" v-show="verifyCodeLoading"></div>
                  <img :src="verifyCodeUrl" id="verify-code-img" v-show="!verifyCodeLoading" @load="verifyCodeLoad">

                </div>
                <div class="row">

                  <div class="_authing_form-group" style="margin-bottom:0px;">
                    <label class="_authing_label" for="login-remember" style="width:100%">
                      <input class="_authing_input" type="checkbox" id="login-remember" style="vertical-align: middle; margin: 0"
                             v-model="rememberMe"><span
                      style="vertical-align: middle"> 记住我</span>
                    </label>
                  </div>


                  <div style="font-size:14px">
                    <a class="_authing_a" href="#" @click="gotoForgetPassword">忘记密码？</a>
                  </div>

                </div>

              </form>

              <form v-show="pageVisible.signUpVisible" action="#" class="authing-form no-shadow">
                <div v-show="!opts.hideUsername" class="_authing_form-group">
                  <input type="text" class="_authing_input _authing_form-control" id="sign-up-username" v-model="signUpForm.username"
                         :placeholder="opts.placeholder.username"
                         autocomplete="off" @keyup.enter="handleSignUp">
                </div>
                <div class="_authing_form-group">
                  <input type="email" class="_authing_input _authing_form-control" id="sign-up-email" v-model="signUpForm.email"
                         @blur="checkEmail" :placeholder="opts.placeholder.email"
                         autocomplete="off" @keyup.enter="handleSignUp">
                </div>
                <div class="_authing_form-group">
                  <input type="password" class="_authing_input _authing_form-control" id="sign-up-password" v-model="signUpForm.password"
                         :placeholder="opts.placeholder.password" autocomplete="off" @keyup.enter="handleSignUp">
                </div>
                <div class="_authing_form-group">
                  <input type="password" class="_authing_input _authing_form-control"
                         :class="{'err-hint': signUpForm.password!==signUpForm.rePassword}" id="sign-up-re-password"
                         v-model="signUpForm.rePassword"
                         :placeholder="opts.placeholder.password" autocomplete="off" @keyup.enter="handleSignUp">
                </div>
              </form>

              <form v-if="pageVisible.forgetPasswordVisible" class="authing-form no-shadow">
                <div v-if="pageVisible.forgetPasswordSendEmailVisible" class="_authing_form-group"
                     style="margin-top: -15px;">
                  <input type="text" class="_authing_input _authing_form-control"
                         id="forget-password-email" :placeholder="opts.placeholder.email"
                         autocomplete="off" v-model="forgetPasswordForm.email"
                         @keyup.enter="handleForgetPasswordSendEmail">
                </div>
                <div v-if="pageVisible.forgetPasswordVerifyCodeVisible" class="_authing_form-group"
                     style="margin-top: -15px;">
                  <input type="text" class="_authing_input _authing_form-control" id="forget-password-verify-code"
                         :placeholder="opts.placeholder.verfiyCode"
                         autocomplete="off" v-model="forgetPasswordForm.verifyCode"
                         @keyup.enter="handleSubmitForgetPasswordVerifyCode"
                  >
                </div>
                <div v-if="pageVisible.forgetPasswordNewPasswordVisible" class="_authing_form-group"
                     style="margin-top: -15px;">
                  <input type="password" class="_authing_input _authing_form-control" id="forget-password-new-password"
                         :placeholder="opts.placeholder.newPassword"
                         autocomplete="off" v-model="forgetPasswordForm.password"
                         @keyup.enter="handleSubmitForgetPasswordNewPassword">

                </div>
              </form>

              <form v-show="pageVisible.wxQRCodeVisible && !opts.hideQRCode" style="height:300px"
                    class="authing-form no-shadow">
                <div class="_authing_form-group" style="margin-top: -15px;">
                  <div id="qrcode-node"></div>
                </div>
              </form>
            </div>


            <div class="_authing_form-footer" v-show="!opts.hideUP" :class="{
              'no-height': pageVisible.wxQRCodeVisible
            }">
              <div class="authing-loading-circle" v-show="loading"></div>
              <button v-show="pageVisible.loginVisible && !loading" @click="handleLogin"
                      class="btn btn-primary">登录
              </button>
              <button v-show="pageVisible.signUpVisible && !loading" @click="handleSignUp"
                      class="btn btn-primary">注册
              </button>
              <button v-show="pageVisible.forgetPasswordSendEmailVisible && !loading"
                      @click="handleForgetPasswordSendEmail"

                      class="btn btn-primary">发送邮件
              </button>
              <button v-show="pageVisible.forgetPasswordVerifyCodeVisible && !loading"
                      @click="handleSubmitForgetPasswordVerifyCode"
                      class="btn btn-primary">提交验证码
              </button>
              <button v-show="pageVisible.forgetPasswordNewPasswordVisible && !loading"
                      @click="handleSubmitForgetPasswordNewPassword"
                      class="btn btn-primary">提交新密码
              </button>
            </div>

            <div class="_authing_form-footer-non-up" v-show="opts.hideUP"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'app',
    data() {
      return {

        validAuth: null,

        errMsg: '',
        successMsg: '',
        warnMsg: '',
        successVisible: false,
        errVisible: false,
        warnVisible: false,

        rememberMe: false,

        pageVisible: {
          wxQRCodeVisible: false,
          forgetPasswordVisible: false,
          loginVisible: false,
          oauthVisible: false,
          signUpVisible: false,
          verifyCodeVisible: false,
          forgetPasswordVerifyCodeVisible: false,
          forgetPasswordNewPasswordVisible: false,
          forgetPasswordSendEmailVisible: false,
        },

        pageStack: [],

        OAuthList: [],

        verifyCodeUrl: '',

        signUpForm: {
          username: '',
          password: '',
          email: '',
          rePassword: ''
        },
        loginForm: {
          email: '',
          password: '',
        },
        verifyCode: '',
        forgetPasswordForm: {
          email: '',
          verifyCode: '',
          password: ''
        },

        loading: false,
        oAuthloading: false,
        verifyCodeLoading: true,

        isWxQRCodeGenerated: false,

        isScanCodeEnable: false,

        opts: {},

        authingOnError: false,

        closeForm: false,
        removeDom: false,

        $authing: null,
      };
    },
    mounted: function () {
      var that = this;
      var auth = null;

      try {
        auth = new Authing({
          clientId: that.opts.clientId,
          secret: that.opts.secret,
          host: that.opts.host
        });
      } catch (err) {
        document.getElementById('page-loading').remove();
        document.getElementById('_authing_login_form_content').classList.remove('hide');
        that.authingOnError = true;
        that.errMsg = 'Error: ' + err;
        that.$authing.pub('authingUnload', err);
      }

      if (!auth) {
        return;
      }

      auth.then(function (validAuth) {
        document.getElementById('page-loading').remove();
        document.getElementById('_authing_login_form_content').classList.remove('hide');
        window.validAuth = validAuth;

        that.$authing.pub('authingLoad', validAuth);

        if (localStorage.getItem('_authing_username')) {
          that.rememberMe = true;
          that.loginForm.email = localStorage.getItem('_authing_username');
        }
        if (localStorage.getItem('_authing_password')) {
          that.loginForm.password = that.decrypt(localStorage.getItem('_authing_password'), $authing.opts.clientId);
        }

        if (!that.opts.hideOAuth) {
          that.oAuthloading = true;
          validAuth.readOAuthList()
            .then(function (data) {
              that.$authing.pub('oauthLoad', data);
              that.oAuthloading = false;

              var OAuthList = data.filter(function (item) {
                if (item.alias === 'wxapp') {
                  that.isScanCodeEnable = true;
                }
                return item.enabled === true && item.alias !== 'wxapp';
              });

              that.OAuthList = OAuthList;

              if (OAuthList.length === 0 && that.opts.hideUP) {
                that.opts.hideOAuth = true;
                that.gotoWxQRCodeScanning();
              }
            })
            .catch(function (err) {
              that.$authing.pub('oauthUnload', err);
              that.oAuthloading = true;
            });
        } else {
          if (!that.opts.hideQRCode) {
            that.isScanCodeEnable = true;
          }
        }

        if (that.opts.hideOAuth && that.opts.hideUP) {
          that.gotoWxQRCodeScanning();
        }
      })
        .catch(function (err) {
          let pageLoading = document.getElementById('page-loading');
          pageLoading && document.getElementById('page-loading').remove();
          document.getElementById('_authing_login_form_content').classList.remove('hide');
          that.authingOnError = true;
          that.errMsg = '初始化出错，请检查 clientID 和 Secret 是否正确';
          that.$authing.pub('authingUnload', err);
        });
    },
    created: function () {
      this.pageVisible.loginVisible = true;
      this.$authing = this.$parent.$data.$authing;
      this.opts = this.$authing.opts;

      document.onkeydown = (event) => {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if (e && e.keyCode === 27) {
          this.handleClose();
        }
      };
    },
    methods: {
      verifyCodeLoad: function () {
        this.verifyCodeLoading = false;
      },
      encryptMethod: function encryptMethod(str, key) {
        while (str.length > key.length) {
          key += key;
        }
        var r = key.substr(0, str.length);

        var i = 0;
        var arr = [];
        for (i = 0; i < str.length; i++) {
          arr.push(str.charCodeAt(i) ^ r.charCodeAt(i));
        }
        var uglyStr = '';
        arr.map(function (char) {
          uglyStr += String.fromCharCode(char);
        });
        return uglyStr;
      },
      encrypt: function encrypt(str, key) {
        var out = window.btoa(this.encryptMethod(str, key));
        return out;
      },
      decrypt: function decrypt(str, key) {
        str = window.atob(str);
        return this.encryptMethod(str, key);
      },
      removeAnimation: function removeAnimation(className) {
        document.getElementById(className).classList.remove('animated');
        document.getElementById(className).classList.remove('shake');
      },

      removeRedLine: function removeRedLine(className) {
        document.getElementById(className).classList.remove('err-hint');
      },

      addRedLine: function addRedLine(className) {
        document.getElementById(className).classList.add('err-hint');
      },

      addAnimation: function addAnimation(className) {
        var that = this;
        document.getElementById(className).classList.add('animated');
        document.getElementById(className).classList.add('shake');
        document.getElementById(className).classList.add('err-hint');
        setTimeout(function () {
          that.removeAnimation(className);
        }, 500);
      },
      removeGlobalMsg: function removeGlobalMsg() {
        this.warnVisible = false;
        this.errVisible = false;
        this.successVisible = false;
      },
      showGlobalSuccess: function showGlobalSuccess(msg) {
        this.warnVisible = false;
        this.errVisible = false;
        this.successVisible = true;
        this.successMsg = msg;
      },
      showGlobalErr: function showGlobalErr(msg) {
        this.successVisible = false;
        this.warnVisible = false;
        this.errVisible = true;
        this.errMsg = msg;
      },
      showGlobalWarn: function showGlobalWarn(msg) {
        this.successVisible = false;
        this.errVisible = false;
        this.warnVisible = true;
        this.warnMsg = msg;
      },
      setLoading: function loading() {
        this.loading = true;
      },
      unLoading: function unLoading() {
        this.loading = false;
      },
      getPageState: function getPageState() {
        return Object.assign({}, this.pageVisible);
      },
      turnOnPage: function turnOnPage(visible) {
        this.removeGlobalMsg();
        var i;
        for (i in this.pageVisible) {
          if (i === visible) {
            this.pageVisible[i] = true;
          } else {
            this.pageVisible[i] = false;
          }
        }
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
      gotoLogin: function gotoLogin() {
        this.pageStack.push(this.getPageState());
        this.turnOnPage('loginVisible');
      },
      gotoSignUp: function gotoSignUp() {
        this.pageStack.push(this.getPageState());
        this.turnOnPage('signUpVisible');
      },
      gotoForgetPassword: function gotoForgetPassword() {
        this.pageStack.push(this.getPageState());
        this.turnOnPage('forgetPasswordVisible');
        this.forgetPasswordForm.email = this.loginForm.email;
        this.pageVisible.forgetPasswordSendEmailVisible = true;
      },
      checkEmail: function checkEmail() {
        if (!this.$parent.emailExp.test(this.signUpForm.email)) {
          this.showGlobalErr('请输入正确格式的邮箱');
          this.addAnimation('sign-up-email');
          this.removeRedLine('sign-up-username');
          this.removeRedLine('sign-up-password');
          this.removeRedLine('sign-up-re-password');
        } else {
          this.removeRedLine('sign-up-email');
        }
      },
      handleSignUp: function handleSignUp() {
        var that = this;
        that.setLoading();

        if (!this.$authing.opts.hideUsername && !this.signUpForm.username) {
          this.showGlobalErr('请输入用户名');
          this.addAnimation('sign-up-username');
          this.removeRedLine('sign-up-email');
          this.removeRedLine('sign-up-password');
          this.removeRedLine('sign-up-re-password');
          that.unLoading();
          this.$authing.pub('registerError', '请输入用户名');
          return false;
        }
        if (!this.$parent.emailExp.test(this.signUpForm.email)) {
          this.showGlobalErr('请输入正确格式的邮箱');
          this.addAnimation('sign-up-email');
          this.removeRedLine('sign-up-username');
          this.removeRedLine('sign-up-password');
          this.removeRedLine('sign-up-re-password');
          that.unLoading();
          this.$authing.pub('registerError', '请输入正确格式的邮箱');
          return false;
        }
        if (!this.signUpForm.password) {
          this.showGlobalErr('请输入密码');
          this.addAnimation('sign-up-password');
          this.this.removeRedLine('sign-up-username');
          this.removeRedLine('sign-up-email');
          this.removeRedLine('sign-up-re-password');
          that.unLoading();
          this.$authing.pub('registerError', '请输入密码');
          return false;
        }
        if (this.signUpForm.password !== this.signUpForm.rePassword) {
          this.showGlobalErr('两次密码不一致');
          this.addAnimation('sign-up-re-password');
          this.removeRedLine('sign-up-username');
          this.removeRedLine('sign-up-email');
          this.removeRedLine('sign-up-password');
          that.unLoading();
          this.$authing.pub('registerError', '两次密码不一致');
          return false;
        }
        validAuth.register({
          email: this.signUpForm.email,
          username: this.signUpForm.username,
          password: this.signUpForm.password
        })
          .then(function (data) {
            that.unLoading();
            that.errVisible = false;
            that.gotoLogin();
            that.loginForm = {
              email: that.signUpForm.email,
              password: that.signUpForm.password
            };
            that.signUpForm = {
              username: '',
              password: '',
              email: '',
              rePassword: ''
            };
            that.rememberMe = false;
            that.showGlobalSuccess('注册成功');
            that.$authing.pub('register', data);
          })
          .catch(function (err) {
            that.unLoading();
            that.showGlobalErr(err.message.message);
            that.$authing.pub('registerError', err);
            if (err.message.code === 2026) {
              that.addAnimation('sign-up-email');
              that.emoveRedLine('sign-up-re-password');
              that.removeRedLine('sign-up-username');
              that.removeRedLine('sign-up-password');
            }
          });
      },
      handleLogin: function handleLogin() {
        var that = this;
        that.setLoading();
        var info = {
          email: this.loginForm.email,
          password: this.loginForm.password,
        };

        if (!this.$parent.emailExp.test(this.loginForm.email)) {
          this.showGlobalErr('请输入正确格式的邮箱');
          this.addAnimation('login-username');
          this.removeRedLine('login-password');
          this.removeRedLine('verify-code');
          that.unLoading();
          this.$authing.pub('loginError', '请输入正确格式的邮箱');
          return false;
        }
        if (!this.loginForm.password) {
          this.showGlobalErr('请输入密码');
          this.addAnimation('login-password');
          this.removeRedLine('verify-code');
          this.removeRedLine('login-username');
          that.unLoading();
          this.$authing.pub('loginError', '请输入密码');
          return false;
        }
        if (this.pageVisible.verifyCodeVisible) {
          info.verifyCode = this.verifyCode;
        }
        validAuth.login(info)
          .then(function (data) {
            if (that.rememberMe) {
              localStorage.setItem('_authing_username', that.loginForm.email);
              localStorage.setItem('_authing_password', that.encrypt(that.loginForm.password, $authing.opts.clientId));
            } else {
              localStorage.removeItem('_authing_username');
              localStorage.removeItem('_authing_password');
            }

            that.showGlobalSuccess('验证通过，欢迎你：' + data.username || data.email);
            that.$authing.pub('login', data);
            that.unLoading();
          })
          .catch(function (err) {
            that.unLoading();
            that.$authing.pub('loginError', err);
            that.showGlobalErr(err.message.message);
            // 验证码错误
            if (err.message.code === 2000 || err.message.code === 2001) {
              that.addAnimation('verify-code');
              that.removeRedLine('login-username');
              that.removeRedLine('login-password');

              that.verifyCodeLoading = true;
              that.pageVisible.verifyCodeVisible = true;
              that.verifyCodeUrl = err.message.data.url;
            }
            // 用户名错误
            else if (err.message.code === 2003 || err.message.code === 2204 || err.message.code === 2208) {
              that.addAnimation('login-username');
              that.removeRedLine('login-password');
              that.removeRedLine('verify-code');
            }
            // 用户名不存在
            else if (err.message.code === 2004) {
              // 如果开启登录时创建不存在的用户功能
              if (this.$authing.opts.forceLogin) {
                that.setLoading();
                validAuth.register({
                  email: that.loginForm.email,
                  password: that.loginForm.password,
                })
                  .then(function (data) {
                    that.unLoading();
                    that.showGlobalSuccess('验证通过，欢迎你：' + data.username || data.email);
                    this.$authing.pub('login', data);
                  })
                  .catch(function (err) {
                    that.unLoading();
                    that.showGlobalErr(err.message.message);
                    this.$authing.pub('loginError', err);
                  });
                return false;
              } else {
                that.addAnimation('login-username');
                that.removeRedLine('login-password');
                that.removeRedLine('verify-code');
              }
            }
            // 密码错误
            else if (err.message.code === 2006 || err.message.code === 2016 || err.message.code === 2027) {
              that.addAnimation('login-password');
              that.removeRedLine('verify-code');
              that.removeRedLine('login-username');
            }

          });
      },
      handleForgetPasswordSendEmail: function handleForgetPasswordSendEmail() {
        var that = this;
        that.setLoading();
        if (!this.$parent.emailExp.test(this.forgetPasswordForm.email)) {
          this.showGlobalErr('请输入正确格式的邮箱');
          this.addAnimation('forget-password-email');
          that.unLoading();
          this.$authing.pub('emailSentError', '请输入正确格式的邮箱');
          return false;
        }
        validAuth.sendResetPasswordEmail({
          email: this.forgetPasswordForm.email
        })
          .then(function (data) {
            that.$authing.pub('emailSent', data);
            that.unLoading();
            that.showGlobalSuccess('验证码已发送至您的邮箱：' + that.forgetPasswordForm.email);
            that.pageVisible.forgetPasswordSendEmailVisible = false;
            that.pageVisible.forgetPasswordVerifyCodeVisible = true;
          })
          .catch(function (err) {
            that.$authing.pub('emailSentError', err);
            that.unLoading();
            that.showGlobalErr(err.message);
          });
      },
      handleSubmitForgetPasswordVerifyCode: function handleSubmitForgetPasswordVerifyCode() {
        var that = this;
        that.setLoading();
        if (!this.forgetPasswordForm.verifyCode) {
          that.unLoading();
          this.addAnimation('forget-password-verify-code');
          
          that.showGlobalErr('请输入验证码');
          this.$authing.pub('resetPasswordError', '请输入验证码');
          return false;
        }
        validAuth.verifyResetPasswordVerifyCode({
          email: that.forgetPasswordForm.email,
          verifyCode: that.forgetPasswordForm.verifyCode
        })
          .then(function (data) {
            that.$authing.pub('resetPassword', data);
            that.unLoading();
            that.showGlobalSuccess(data.message);
            that.pageVisible.forgetPasswordVerifyCodeVisible = false;
            that.pageVisible.forgetPasswordNewPasswordVisible = true;
          })
          .catch(function (err) {
            that.$authing.pub('resetPasswordError', err);
            that.unLoading();
            that.addAnimation('forget-password-verify-code');
            that.showGlobalErr(err.message.message);
          });
      },
      handleSubmitForgetPasswordNewPassword: function handleSubmitForgetPasswordNewPassword() {
        var that = this;
        that.setLoading();
        validAuth.changePassword({
          email: that.forgetPasswordForm.email,
          password: that.forgetPasswordForm.password,
          verifyCode: that.forgetPasswordForm.verifyCode
        })
          .then(function (data) {
            that.$authing.pub('resetPassword', data);
            that.unLoading();
            that.showGlobalSuccess('修改密码成功');
            that.gotoLogin();
          })
          .catch(function (err) {
            that.$authing.pub('resetPasswordError', err);
            that.unLoading();
            that.showGlobalErr(err.message.message);
          });
      },
      gotoWxQRCodeScanning: function gotoWxQRCodeScanning() {
        if (!(this.opts.hideOAuth && this.opts.hideUP)) {
          this.pageStack.push(this.getPageState());
        }
        this.turnOnPage('wxQRCodeVisible');

        var scanOpts = this.$authing.opts.qrcodeScanning || {
          redirect: true,
          interval: 1500,
          tips: '使用 微信 或小程序 身份管家 扫码登录'
        };

        if (!this.isWxQRCodeGenerated) {
          validAuth.startWXAppScaning({
            mount: 'qrcode-node',

            onSuccess: function (res) {
              this.$authing.pub('scanning', res);
            },

            onError: function (err) {
              this.$authing.pub('scanningError', err);
            },

            onIntervalStarting: function (interval) {
              this.$authing.pub('scanningIntervalStarting', interval);
            },

            interval: scanOpts.interval,

            redirect: scanOpts.redirect,

            tips: scanOpts.tips
          });
          this.isWxQRCodeGenerated = true;
        }
      },
      handleClose: function handleClose() {
        if (this.opts.hideClose) {
          return false;
        }
        var that = this;
        this.closeForm = true;
        this.$authing.pub('formClosed');
        setTimeout(function () {
          that.removeDom = true;
        }, 800);
      }
    },
    watch: {
      rememberMe: function (newVal) {
        if (newVal === false) {
          localStorage.removeItem('_authing_username');
          localStorage.removeItem('_authing_password');
        }
      }
    }
  };

</script>

