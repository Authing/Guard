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

              <div v-for="(item, index) in OAuthList" :key="item._id" class="_authing_form-group">
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

        opts: $authing.opts,

        authingOnError: false,

        closeForm: false,
        removeDom: false,
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
        $authing.pub('authingUnload', err);
      }

      if (!auth) {
        return;
      }

      auth.then(function (validAuth) {
        document.getElementById('page-loading').remove();
        document.getElementById('_authing_login_form_content').classList.remove('hide');
        window.validAuth = validAuth;

        $authing.pub('authingLoad', validAuth);

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
              $authing.pub('oauthLoad', data);
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
              $authing.pub('oauthUnload', err);
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
          document.getElementById('page-loading').remove();
          document.getElementById('_authing_login_form_content').classList.remove('hide');
          that.authingOnError = true;
          that.errMsg = '初始化出错，请检查 clientID 和 Secret 是否正确';
          $authing.pub('authingUnload', err);
        });
    },
    created: function () {
      this.pageVisible.loginVisible = true;
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
        console.log('verifyCode loaded');
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
        if (!emailExp.test(this.signUpForm.email)) {
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

        if (!$authing.opts.hideUsername && !this.signUpForm.username) {
          this.showGlobalErr('请输入用户名');
          this.addAnimation('sign-up-username');
          this.removeRedLine('sign-up-email');
          this.removeRedLine('sign-up-password');
          this.removeRedLine('sign-up-re-password');
          that.unLoading();
          $authing.pub('registerError', '请输入用户名');
          return false;
        }
        if (!emailExp.test(this.signUpForm.email)) {
          this.showGlobalErr('请输入正确格式的邮箱');
          this.addAnimation('sign-up-email');
          this.removeRedLine('sign-up-username');
          this.removeRedLine('sign-up-password');
          this.removeRedLine('sign-up-re-password');
          that.unLoading();
          $authing.pub('registerError', '请输入正确格式的邮箱');
          return false;
        }
        if (!this.signUpForm.password) {
          this.showGlobalErr('请输入密码');
          this.addAnimation('sign-up-password');
          this.this.removeRedLine('sign-up-username');
          this.removeRedLine('sign-up-email');
          this.removeRedLine('sign-up-re-password');
          that.unLoading();
          $authing.pub('registerError', '请输入密码');
          return false;
        }
        if (this.signUpForm.password !== this.signUpForm.rePassword) {
          this.showGlobalErr('两次密码不一致');
          this.addAnimation('sign-up-re-password');
          this.removeRedLine('sign-up-username');
          this.removeRedLine('sign-up-email');
          this.removeRedLine('sign-up-password');
          that.unLoading();
          $authing.pub('registerError', '两次密码不一致');
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
            $authing.pub('register', data);
          })
          .catch(function (err) {
            that.unLoading();
            that.showGlobalErr(err.message.message);
            $authing.pub('registerError', err);
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

        if (!emailExp.test(this.loginForm.email)) {
          this.showGlobalErr('请输入正确格式的邮箱');
          this.addAnimation('login-username');
          this.removeRedLine('login-password');
          this.removeRedLine('verify-code');
          that.unLoading();
          $authing.pub('loginError', '请输入正确格式的邮箱');
          return false;
        }
        if (!this.loginForm.password) {
          this.showGlobalErr('请输入密码');
          this.addAnimation('login-password');
          this.removeRedLine('verify-code');
          this.removeRedLine('login-username');
          that.unLoading();
          $authing.pub('loginError', '请输入密码');
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
            $authing.pub('login', data);
            that.unLoading();
          })
          .catch(function (err) {
            that.unLoading();
            $authing.pub('loginError', err);
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
              if ($authing.opts.forceLogin) {
                that.setLoading();
                console.log('turn on forceLogin');
                validAuth.register({
                  email: that.loginForm.email,
                  password: that.loginForm.password,
                })
                  .then(function (data) {
                    that.unLoading();
                    that.showGlobalSuccess('验证通过，欢迎你：' + data.username || data.email);
                    $authing.pub('login', data);
                  })
                  .catch(function (err) {
                    that.unLoading();
                    that.showGlobalErr(err.message.message);
                    $authing.pub('loginError', err);
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
        if (!emailExp.test(this.forgetPasswordForm.email)) {
          this.showGlobalErr('请输入正确格式的邮箱');
          this.addAnimation('forget-password-email');
          that.unLoading();
          $authing.pub('emailSentError', '请输入正确格式的邮箱');
          return false;
        }
        validAuth.sendResetPasswordEmail({
          email: this.forgetPasswordForm.email
        })
          .then(function (data) {
            $authing.pub('emailSent', data);
            that.unLoading();
            that.showGlobalSuccess('验证码已发送至您的邮箱：' + that.forgetPasswordForm.email);
            that.pageVisible.forgetPasswordSendEmailVisible = false;
            that.pageVisible.forgetPasswordVerifyCodeVisible = true;
          })
          .catch(function (err) {
            $authing.pub('emailSentError', err);
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
          ;
          that.showGlobalErr('请输入验证码');
          $authing.pub('resetPasswordError', '请输入验证码');
          return false;
        }
        validAuth.verifyResetPasswordVerifyCode({
          email: that.forgetPasswordForm.email,
          verifyCode: that.forgetPasswordForm.verifyCode
        })
          .then(function (data) {
            $authing.pub('resetPassword', data);
            that.unLoading();
            that.showGlobalSuccess(data.message);
            that.pageVisible.forgetPasswordVerifyCodeVisible = false;
            that.pageVisible.forgetPasswordNewPasswordVisible = true;
          })
          .catch(function (err) {
            $authing.pub('resetPasswordError', err);
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
            $authing.pub('resetPassword', data);
            that.unLoading();
            that.showGlobalSuccess('修改密码成功');
            that.gotoLogin();
          })
          .catch(function (err) {
            $authing.pub('resetPasswordError', err);
            that.unLoading();
            that.showGlobalErr(err.message.message);
          });
      },
      gotoWxQRCodeScanning: function gotoWxQRCodeScanning() {
        if (!(this.opts.hideOAuth && this.opts.hideUP)) {
          this.pageStack.push(this.getPageState());
        }
        this.turnOnPage('wxQRCodeVisible');

        var scanOpts = $authing.opts.qrcodeScanning || {
          redirect: true,
          interval: 1500,
          tips: '使用 微信 或小程序 身份管家 扫码登录'
        };

        if (!this.isWxQRCodeGenerated) {
          validAuth.startWXAppScaning({
            mount: 'qrcode-node',

            onSuccess: function (res) {
              $authing.pub('scanning', res);
            },

            onError: function (err) {
              $authing.pub('scanningError', err);
            },

            onIntervalStarting: function (interval) {
              $authing.pub('scanningIntervalStarting', interval);
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
        $authing.pub('formClosed');
        setTimeout(function () {
          that.removeDom = true;
        }, 800);
      }
    },
    watch: {
      rememberMe: function (newVal, oldVal) {
        if (newVal === false) {
          localStorage.removeItem('_authing_username');
          localStorage.removeItem('_authing_password');
        }
      }
    }
  };

</script>
<style>
  /* =======================================================
  *
  * 	Animation
  *
  * ======================================================= */

  @-webkit-keyframes fadeOutDown {
    from {
      opacity: 1;
    }

    to {
      opacity: 0;
      -webkit-transform: translate3d(0, 100%, 0);
      transform: translate3d(0, 100%, 0);
    }
  }

  @keyframes fadeOutDown {
    from {
      opacity: 1;
    }

    to {
      opacity: 0;
      -webkit-transform: translate3d(0, 100%, 0);
      transform: translate3d(0, 100%, 0);
    }
  }

  .fadeOutDown {
    -webkit-animation-name: fadeOutDown;
    animation-name: fadeOutDown;
  }

  @-webkit-keyframes fadeInUp {
    from {
      opacity: 0;
      -webkit-transform: translate3d(0, 100%, 0);
      transform: translate3d(0, 100%, 0);
    }

    to {
      opacity: 1;
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      -webkit-transform: translate3d(0, 100%, 0);
      transform: translate3d(0, 100%, 0);
    }

    to {
      opacity: 1;
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }
  }

  @-webkit-keyframes shake {
    from,
    to {
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }

    10%,
    30%,
    50%,
    70%,
    90% {
      -webkit-transform: translate3d(-10px, 0, 0);
      transform: translate3d(-10px, 0, 0);
    }

    20%,
    40%,
    60%,
    80% {
      -webkit-transform: translate3d(10px, 0, 0);
      transform: translate3d(10px, 0, 0);
    }
  }

  @keyframes shake {
    from,
    to {
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }

    10%,
    30%,
    50%,
    70%,
    90% {
      -webkit-transform: translate3d(-10px, 0, 0);
      transform: translate3d(-10px, 0, 0);
    }

    20%,
    40%,
    60%,
    80% {
      -webkit-transform: translate3d(10px, 0, 0);
      transform: translate3d(10px, 0, 0);
    }
  }

  @-webkit-keyframes rotate {
    0% {
      -webkit-transform: rotate(0deg);
    }

    100% {
      -webkit-transform: rotate(360deg);
    }
  }

  @-webkit-keyframes rotate {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }

    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }

  @keyframes rotate {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }

    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }

  .shake {
    -webkit-animation-name: shake;
    animation-name: shake;
  }

  .fadeInUp {
    -webkit-animation-name: fadeInUp;
    animation-name: fadeInUp;
  }

  .animated {
    -webkit-animation-duration: 1s;
    animation-duration: 1s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
  }

  .animated.infinite {
    -webkit-animation-iteration-count: infinite;
    animation-iteration-count: infinite;
  }

  .animated.delay-1s {
    -webkit-animation-delay: 1s;
    animation-delay: 1s;
  }

  .animated.delay-2s {
    -webkit-animation-delay: 2s;
    animation-delay: 2s;
  }

  .animated.delay-3s {
    -webkit-animation-delay: 3s;
    animation-delay: 3s;
  }

  .animated.delay-4s {
    -webkit-animation-delay: 4s;
    animation-delay: 4s;
  }

  .animated.delay-5s {
    -webkit-animation-delay: 5s;
    animation-delay: 5s;
  }

  .animated.fast {
    -webkit-animation-duration: 800ms;
    animation-duration: 800ms;
  }

  .animated.faster {
    -webkit-animation-duration: 500ms;
    animation-duration: 500ms;
  }

  .animated.slow {
    -webkit-animation-duration: 2s;
    animation-duration: 2s;
  }

  .animated.slower {
    -webkit-animation-duration: 3s;
    animation-duration: 3s;
  }

  @media (prefers-reduced-motion) {
    .animated {
      -webkit-animation: unset !important;
      animation: unset !important;
      -webkit-transition: none !important;
      transition: none !important;
    }
  }

  /* =======================================================
  *
  * 	Style
  *
  * ======================================================= */

  * {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box
  }

  :after, :before {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box
  }

  ._authing_login_form {
    font-size: 10px;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    font-family: Avenir,Helvetica,Arial,'sans-serif';
    font-size: 14px;
    line-height: 1.42857143;
    color: #333;
    background-color: #f0f0f0;
    margin: 0px;
    padding: 0px;
    color: #2c3e50;
  }

  button, input, select, textarea {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit
  }

  a._authing_a {
    color: #337ab7;
    text-decoration: none;
    outline: 0;
    font-weight: 300;
  }

  ._authing-btn {
    outline: 0;
  }

  button._authing_button::-moz-focus-inner, input._authing_input::-moz-focus-inner {
    padding: 0;
    border: 0
  }

  p._authing_p {
    margin: 0 0 10px
  }

  input._authing_input {
    line-height: normal
  }

  input._authing_input[type=checkbox], input._authing_input[type=radio] {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding: 0
  }

  input._authing_input[type=number]::-webkit-inner-spin-button, input._authing_input[type=number]::-webkit-outer-spin-button {
    height: auto
  }

  input._authing_input[type=search] {
    -webkit-box-sizing: content-box;
    -moz-box-sizing: content-box;
    box-sizing: content-box;
    -webkit-appearance: textfield
  }

  input._authing_input[type=search]::-webkit-search-cancel-button, input._authing_input[type=search]::-webkit-search-decoration {
    -webkit-appearance: none
  }

  ._authing_form-group {
    margin-bottom: 15px
  }

  ._authing_form-control {
    display: block;
    width: 100%;
    height: 34px;
    padding: 6px 12px;
    font-size: 14px;
    line-height: 1.42857143;
    color: #555;
    background-color: #fff;
    background-image: none;
    border: 1px solid #ccc;
    border-radius: 4px;
    -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
    -webkit-transition: border-color ease-in-out .15s, -webkit-box-shadow ease-in-out .15s;
    -o-transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
    transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s
  }

  ._authing_form-control:focus {
    border-color: #66afe9;
    outline: 0;
    -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(102, 175, 233, .6);
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(102, 175, 233, .6)
  }

  ._authing_form-control::-moz-placeholder {
    color: #999;
    opacity: 1
  }

  ._authing_form-control:-ms-input-placeholder {
    color: #999
  }

  ._authing_form-control::-webkit-input-placeholder {
    color: #999
  }

  ._authing_form-control::-ms-expand {
    background-color: transparent;
    border: 0
  }

  ._authing_form-control[disabled], ._authing_form-control[readonly], fieldset[disabled] ._authing_form-control {
    background-color: #eee;
    opacity: 1
  }

  ._authing_form-control[disabled], fieldset[disabled] ._authing_form-control {
    cursor: not-allowed
  }

  ._authing-logmod__alter {
    display: block;
    position: relative;
    margin-top: 7px;
  }

  ._authing-logmod__alter::after {
    clear: both;
    content: "";
    display: table;
  }

  ._authing-logmod__alter ._authing-connect:last-child {
    border-radius: 0 0 4px 4px;
  }

  ._authing-logmod__alter ._authing-connect:first-child {
    border-radius: 4px 4px 4px 4px;
  }

  ._authing-connect {
    overflow: hidden;
    position: relative;
    display: block;
    width: 100%;
    height: 42px;
    line-height: 42px;
    text-decoration: none;
  }

  ._authing-connect::after {
    clear: both;
    content: "";
    display: table;
  }

  ._authing-connect:focus, ._authing-connect:hover, ._authing-connect:visited {
    color: #FFF;
    text-decoration: none;
  }

  ._authing-connect__icon {
    vertical-align: middle;
    float: left;
    width: 50px;
    text-align: center;
    font-size: 22px;
  }

  ._authing-connect__context {
    vertical-align: middle;
    text-align: center;
    font-size: 14px;
    font-weight: 300;    
  }

  ._authing-connect.github {
    background: #0099CC;
    color: #FFF;
  }

  ._authing-connect.wechat {
    background: #009900;
    color: #FFF;
  }

  ._authing-connect.github a {
    color: #FFF;
  }

  ._authing-connect.wechat a {
    color: #FFF;
  }

  ._authing-connect.github ._authing-connect__icon {
    background: #006699;
  }

  ._authing-connect.wechat ._authing-connect__icon {
    background: #006600;
  }

  .authing-form, ._authing_form-wrapper {
    padding: 22px;
    -webkit-box-shadow: -4px 7px 46px 2px rgba(0, 0, 0, 0.1);
    -moz-box-shadow: -4px 7px 46px 2px rgba(0, 0, 0, 0.1);
    -o-box-shadow: -4px 7px 46px 2px rgba(0, 0, 0, 0.1);
    box-shadow: -4px 7px 46px 2px rgba(0, 0, 0, 0.1);
    background: #FFFFFF;
  }

  ._authing_form-wrapper {
    padding: 0px;
    margin-top: 4em;
    border-radius: 5px;
  }

  @media screen and (max-width: 768px) {
    .authing-form {
      padding: 15px;
    }
  }

  .authing-form h2 {
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 20px;
    margin: 0 0 30px 0;
    color: #000000;
  }

  .authing-form .form-group p {
    font-size: 14px;
    color: #9f9f9f;
    font-weight: 300;
  }

  .authing-form .form-group p a {
    color: #000000;
  }

  .authing-form label {
    font-weight: 300;
    font-size: 14px;
    font-weight: 300;
  }

  .authing-form ._authing_form-control {
    font-size: 16px;
    font-weight: 300;
    height: 50px;
    padding-left: 0;
    padding-right: 0;
    border: none;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
    -o-box-shadow: none;
    box-shadow: none;
    -webkit-border-radius: 0px;
    -moz-border-radius: 0px;
    -ms-border-radius: 0px;
    border-radius: 0px;
    -moz-transition: all 0.3s ease;
    -o-transition: all 0.3s ease;
    -webkit-transition: all 0.3s ease;
    -ms-transition: all 0.3s ease;
    transition: all 0.3s ease;
  }

  .authing-form ._authing_form-control::-webkit-input-placeholder {
    color: rgba(0, 0, 0, 0.3);
    text-transform: uppercase;
  }

  .authing-form ._authing_form-control::-moz-placeholder {
    color: rgba(0, 0, 0, 0.3);
    text-transform: uppercase;
  }

  .authing-form ._authing_form-control:-ms-input-placeholder {
    color: rgba(0, 0, 0, 0.3);
    text-transform: uppercase;
  }

  .authing-form ._authing_form-control:-moz-placeholder {
    color: rgba(0, 0, 0, 0.3);
    text-transform: uppercase;
  }

  .authing-form ._authing_form-control:focus, .authing-form ._authing_form-control:active {
    border-bottom: 1px solid rgba(0, 0, 0, 0.4);
  }

  ._authing_form-footer {
    margin-bottom: 0px;
    height: 60px;
  }

  ._authing_form-footer.no-height {
    height: 0px;
  }

  ._authing_form-footer .btn {
    width: 100%;
    border: none;
  }

  ._authing_form-wrapper {
    background: #FFFFFF;
  }

  ._authing_form-header {
    text-align: center;
    padding: 11px;
    height: 118px;
    color: #333;
    position: relative;
    background: #fff;
    border-radius: 5px 5px 0 0;
    overflow: hidden;
    box-sizing: border-box;
  }

  ._authing_form-header-bg {
    position: absolute;
    height: 118px;
    width: 100%;
    overflow: hidden;
    top: 0;
    left: 0;
    pointer-events: none;
    background: rgba(241, 241, 241, 0.8);
  }

  ._authing_form-header-welcome {
    font-size: 18px;
    position: relative;
  }

  .form-header-logo {
    width: auto;
    height: 58px;
    display: inline-block;
    margin: 0 0 11px;
    vertical-align: middle;
    -webkit-transition: margin-top 0.4s;
    transition: margin-top 0.4s;
  }

  ._authing_form-header-name {
    font-size: 22px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    padding: 0 10px;
    line-height: 30px;
    font-family: Avenir,Helvetica,Arial,sans-serif;
    letter-spacing: 2px;
    font-weight: 300;
  }

  .authing-oauth-form {
    padding: 22px;
    background: #FFFFFF;
    padding-bottom: 0px;
    padding-top: 0px;
  }

  .authing-form.no-shadow {
    box-shadow: none !important;
    -webkit-box-shadow: none !important;
  }

  .authing-header-tabs-container {
    margin: 0px 0px 20px;
    height: 40px;
  }

  .authing-header-tabs {
    background: #fff;
    padding: 0;
    margin: 0;
    font-size: 13px;
    letter-spacing: 0.7px;
    box-shadow: 0 1px 0 0 rgba(92, 102, 111, 0.2);
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -ms-flex-direction: row;
    flex-direction: row;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -ms-flex-line-pack: center;
    align-content: center;
    -webkit-box-align: stretch;
    -ms-flex-align: stretch;
    align-items: stretch;
  }

  .authing-header-tabs li {
    width: 33.33%;
    display: block;
    list-style: none;
    float: left;
    padding: 0;
    margin: 0;
    text-align: center;
    cursor: pointer;
  }

  .authing-header-tabs li.width-55 {
    width: 50%;
  }

  .authing-header-tabs li.width-100 {
    width: 100%;
  }

  .authing-header-tabs li.shadow-eee {
    box-shadow: 0 1px 0 0 #eee!important;
  }

  .authing-header-tabs li a {
    padding: 11px 10px;
    display: block;
    text-decoration: none;
    color: rgba(92, 102, 111, 0.6);
  }

  .authing-header-tabs li.authing-header-tabs-current {
    box-shadow: 0 1px 0 0 #5c666f;
    cursor: default;
  }

  .authing-header-tabs li.authing-header-tabs-current a {
    color: #5c666f;
  }

  .authing-lock-back-button, .authing-lock-close-button {
    box-sizing: content-box !important;
    background: #fff;
    border-radius: 100px;
    height: 10px;
    width: 10px;
    position: absolute;
    top: 14px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    color: #333;
    z-index: 100;
    border: 6px solid #fff;
    cursor: pointer;
    line-height: 0;
  }

  .authing-lock-back-button {
    left: 14px;
  }

  .authing-lock-close-button {
    right: 14px;
  }

  .authing-global-message {
    color: #fff;
    text-align: center;
    padding: 10px;
    line-height: 1.8;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
  }

  .authing-global-message.authing-global-message-error {
    background: #ff3e00;
  }

  .authing-global-message.authing-global-message-success {
    background: #7ed321;
  }

  .authing-global-message.authing-global-message-info {
    background: #44c7f4;
  }

  .authing-loading-container {
    -webkit-animation: fadeIn 0.75s ease-in-out !important;
    animation: fadeIn 0.75s ease-in-out !important;
    position: absolute;
    width: 54px;
    height: 54px;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }

  .authing-loading-wrapper ._authing_form-footer .btn {
    background-color: #eee !important;
    -webkit-transition: background 0.5s ease;
    transition: background 0.5s ease;
    cursor: initial;
    pointer-events: none;
  }

  .authing-loading-wrapper .form-body, .authing-loading-wrapper .authing-oauth-form, .authing-loading-wrapper .authing-header-tabs-container {
    opacity: 0.3;
    pointer-events: none;
  }

  .authing-loading-circle {
    position: absolute;
    margin-top: 15px;
    left: calc(50% - 15px);
    width: 30px;
    height: 30px;
    border-width: 2px;
    border-style: solid;
    border-color: rgba(0, 0, 0, 0.4) rgba(0, 0, 0, 0.4) rgba(0, 0, 0, 0.2) rgba(0, 0, 0, 0.2);
    opacity: 0.9;
    border-radius: 20px;
    -webkit-animation: rotate 1s linear infinite;
    animation: rotate 1s linear infinite;
  }

  ._authing_verify-code-loading-circle {
    margin-top: 15px;
    flex-shrink: 0;
    width: 30px;
    height: 30px;
    border-width: 2px;
    border-style: solid;
    border-color: rgba(0, 0, 0, 0.4) rgba(0, 0, 0, 0.4) rgba(0, 0, 0, 0.2) rgba(0, 0, 0, 0.2);
    opacity: 0.9;
    border-radius: 20px;
    -webkit-animation: rotate 1s linear infinite;
    animation: rotate 1s linear infinite;
  }

  .authing-loading-circle.margin-top-11 {
    margin-top: 0px !important;
  }

  .authing-login-form-wrapper {
    width: 320px;
    margin: 0 auto;
  }

  ._authing_form-footer {
    position: relative;
  }
  @media screen and (max-height: 390px) {
    .form-body {
      height: auto !important;
    }
    ._authing_form-footer {
      position: static !important;
    }
  }
  @media screen and (max-height: 495px) and (max-width: 480px) {
    .form-body {
      overflow-y: scroll;
      height: calc(100vh - 350px)
    }

    ._authing_form-footer {
      position: absolute;
      bottom: 0px;
    }
  }

  ._authing_form-footer .btn {
    width: 100%;
    border-radius: 0px;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    height: 60px;
    font-size: 16px;
    background: #00a1ea;
    box-shadow: none!important;
    font-weight: 200;
    color: #fff;
    outline: 0;
    cursor: pointer;
  }

  ._authing_form-footer .btn:hover, ._authing_form-footer .btn:focus, ._authing_form-footer .btn:active {
    background: #0184bf !important;
    outline: 0;
  }

  @media screen and (max-width: 480px) {
    ._authing_form-footer {
      position: absolute;
      bottom: 0;
    }

    ._authing_container {
      padding: 0px;
    }

    .authing-login-form-wrapper {
      width: 100%;
      height: 100vh;
    }

    ._authing_form-wrapper {
      margin-top: 0px;
      height: 100%;
    }

    ._authing_form-header {
      border-radius: 0px;
    }

    ._authing_form-footer {

      width: 100%;
      border-radius: 0px;
    }

    .form-head-content {
      /*box-sizing: border-box;*/
      /*min-height: calc(100vh - 178px);*/
    }

    ._authing_form-footer .btn {
      border-bottom-left-radius: 0px!important;
      border-bottom-right-radius: 0px!important;
      box-shadow: none!important;
    }

    .authing-form-badge-bottom {
      display: none;
    }
  }

  .screen-center {
    position: absolute;
    top: calc(50% - 15px);
    left: calc(50% - 15px);
  }

  ._authing_form-footer-non-up {
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    height: 6px;
  }

  @font-face {
    font-family: '_authing_iconfont';  /* project id 803924 */
    src: url('//at.alicdn.com/t/font_803924_073p7nal4zk.eot');
    src: url('//at.alicdn.com/t/font_803924_073p7nal4zk.eot?#iefix') format('embedded-opentype'),
    url('//at.alicdn.com/t/font_803924_073p7nal4zk.woff') format('woff'),
    url('//at.alicdn.com/t/font_803924_073p7nal4zk.ttf') format('truetype'),
    url('//at.alicdn.com/t/font_803924_073p7nal4zk.svg#iconfont') format('svg');
  }

  ._authing_iconfont {
    font-family: "_authing_iconfont" !important;
    font-size: 24px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -webkit-text-stroke-width: 0.2px;
    -moz-osx-font-smoothing: grayscale;
  }

  .hide {
    display: none;
  }

  .verify-code {
    display: flex;
  }

  .err-hint {
    border-bottom: 1px solid red !important;
  }

  .full-width {
    width: 100%;
  }

  .marginTop11 {
    margin-top: 11px;
  }

  ._authing_form-tip {
    text-align: center;
    font-size: 11px;
    font-weight: 300;
    margin-bottom: 0px;
  }

  .row {
    display: flex;
    justify-content: space-between;
  }

  .authing-form-badge-bottom {
    position: fixed;
    bottom: 15px;
    left: 15px;
    z-index: -1;
    text-align: center;
    padding: 6px 10px;
    border-radius: 3px;
    background: rgba(255, 255, 255, 0.1);
    -webkit-box-shadow: 2px -2px 5px #eaeaea;
    -moz-box-shadow: 2px -2px 5px #eaeaea;
    box-shadow: 2px -2px 5px #eaeaea;
  }

  .authing-form-badge-bottom a.authing-form-badge {
    display: inline-block;
    color: #2c2d33;
    font-size: 14px;
    font-weight: 300;
  }

  .authing-form-badge-bottom a.authing-form-badge:hover {
    outline: 0 !important;
  }

  .authing-form-badge-bottom a.authing-form-badge:focus {
    outline: none !important;
  }

  span.authing-form-badge-logo {
    background-image: url('https://cdn.authing.cn/authing-logo.png');
    display: inline-block;
    width: 14px;
    height: 14px;
    background-size: cover;
  }

  /* cover layer */
  .authing-cover-layer {
    position: fixed;
    left: 0px;
    top: 0px;
    background: #f0f0f0;
    width: 100%; /*宽度设置为100%，这样才能使隐藏背景层覆盖原页面*/
    height: 100vh;
    filter: alpha(opacity=80); /*设置透明度为60%*/
    opacity: 0.8; /*非IE浏览器下设置透明度为60%*/
    z-Index: 999;
  }

  .authing-form-badge-white {
    background: #fff !important;
    z-index: 1000;
  }

  .z-index1000 {
    position: relative;
    z-index: 1000;
  }

  .height100 {
    height: 100%;
  }

  .authing-login-form-modal {
    position: absolute;
    width: 100%;
    top: 0;
    height: 100%;
  }

  #authing__retry a {
    font-weight: 300;
  }
</style>
