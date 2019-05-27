<template>
  <div>
    <div v-show="!showPage">跳转中...</div>
    <div class="authorize" v-show="showPage">
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
                  :src="!formLoading ? appInfo['image'] : ''"
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
            <img v-show="false" alt="Vue logo" :src="appInfo.images">
            <div class="_authing_form_authorize_info">
              <div class="_div_authorize_block">
                <div class="_div_info_text">
                  <span>登录</span>
                  <a class="url" @click="() => { return false }">{{appInfo['name']}}</a>
                </div>
                <ul>
                  <template v-if="scopes.scopeMeanings.length > 0 && protocol === 'oidc'">
                    <div class="permission-list">
                      <li :key="scope" v-for="scope in scopes.scopeMeanings">获取你的{{scope}}</li>
                    </div>
                  </template>
                  <template v-if="scopes.scopeMeanings.length === 0 && protocol === 'oidc'">
                    <li>获取 scope 失败，会话可能过期，请重新登录</li>
                  </template>
                  <template v-if="protocol === 'saml'">
                    <li>获取你的基础信息</li>
                  </template>
                  <template v-if="protocol === 'oauth'">
                    <li>获取你的基础信息</li>
                  </template>
                </ul>
              </div>

              <div class="_div_line"/>
            </div>

            <div v-show="!formLoading" class="_authing_form-footer two_buttons">
              <button class="btn btn-primary" @click="redirectURL">授权登录</button>
              <button class="btn btn-primary btn-cancel" @click="cancelAuthorize">取消</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "authorize",
  components: {},
  computed: {
    ...mapGetters("data", ["appInfo", "isLogged"]),
    ...mapGetters("protocol", ["protocol", "params"]),
    ...mapGetters("loading", {
      formLoading: "form"
    })
  },
  created() {
    this.$authing = this.$root.$data.$authing;
    this.opts = this.$root.$data.$authing.opts;
  },
  mounted() {
    // 如果已经登录，准备直接跳转走
    if (this.isLogged && !(this.protocol === 'oidc' && this.params.consent !== 'none')) {
      this.showPage = false;
      this.redirectURL();
      return;
    }
    // 进入确权页面，查询所需权限列表
    if (this.protocol === "oidc") {
      this.queryOIDCScopes(this.params.uuid);
    }
    window.onresize = () => {
      return (() => {
        window.screenWidth = document.body.scrollWidth;
        this.screenWidth = window.screenWidth;
      })();
    };
  },
  methods: {
    ...mapActions("loading", ["changeLoading"]),
    redirectURL() {
      const host = this.$root.SSOHost;
      // 根据不同的协议，确权后执行不同的后续流程
      if (this.protocol === "oidc") {
        // 这两者是等价的
        location.href =
          this.scopes.redirectTo ||
          `${host}/oauth/oidc/auth/${this.params.uuid}`;
      } else if (this.protocol === "saml") {
        if (this.params.bindings === "post") {
          // 创建一个 form
          var form1 = document.createElement("form");
          form1.id = "saml-post";
          form1.name = "saml-post";

          // 添加到 body 中
          document.body.appendChild(form1);

          // 创建一个输入
          var input = document.createElement("input");
          // 设置相应参数
          input.type = "text";
          input.name = "SAMLRequest";
          input.value = this.params.SAMLRequest;

          // 将该输入框插入到 form 中
          form1.appendChild(input);

          // form 的提交方式
          form1.method = "POST";
          // form 提交路径
          form1.action = `${host}/oauth/saml/idp/${
            this.appInfo._id
          }/SingleSignOnService?authorization_header=${localStorage.getItem(
            "_authing_token"
          )}`;

          // 对该 form 执行提交
          form1.submit();
          // 删除该 form
          document.body.removeChild(form1);
        } else {
          location.href = `${host}/oauth/saml/idp/${
            this.appInfo._id
          }/SingleSignOnService?authorization_header=${localStorage.getItem(
            "_authing_token"
          )}&SAMLRequest=${encodeURIComponent(this.params.SAMLRequest)}&Signature=${
            encodeURIComponent(this.params.Signature)
          }&SigAlg=${encodeURIComponent(this.params.SigAlg)}`;
        }
      } else {
        // oauth
        // 因为只输入域名不输入任何参数，默认是 oauth，所以给这些字段设置一些默认值
        location.href = `${host}/authorize?app_id=${this.appInfo._id || this.$route.query.app_id || this.$route.query.client_id}&state=${
          this.params.state || Math.random().toString().slice(2)
        }&response_type=${this.params.response_type || 'code'}&redirect_uri=${
          this.params.redirect_uri || ''
        }&scope=${
          this.params.scope || 'profile'
        }&authorization_header=${localStorage.getItem(
          "_authing_token"
        )}&confirm_authorize=1`;
      }
    },

    cancelAuthorize() {
      // redirect to
      localStorage.setItem("appToken", "");

      window.history.back();
    },

    async queryOIDCScopes(uuid) {
      const url = `${
        window.location.origin
      }/oauth/oidc/interaction/${uuid}/login`;
      try {
        const result = await axios.post(url, null, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("_authing_token")}`
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
      } catch (err) {
        // location.href = location.pathname + 'error?message=缺少 OIDC 所必须的参数 uuid';
        console.log(err);
      }
    }
  },

  data() {
    return {
      screenWidth: document.body.scrollWidth,
      showPage: true,
      scopes: {
        scopeMeanings: []
      }
    };
  }
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
