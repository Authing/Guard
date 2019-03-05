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
                src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1551630965363&di=c1f7c4ac42b2d24a4779f91778db123b&imgtype=0&src=http%3A%2F%2Fgss0.baidu.com%2F9fo3dSag_xI4khGko9WTAnF6hhy%2Fzhidao%2Fpic%2Fitem%2Fb3fb43166d224f4a12c9bac202f790529922d18b.jpg"
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
          <img v-show="false" alt="Vue logo" src="../assets/logo.png">
          <div class="_authing_form_authorize_info">
            <div class="_div_authorize_block">
              <div class="_div_info_text">
                <span>登录</span>
                <a class="url" href="http://weixin.qq.com">weixin.qq.com</a>
              </div>
              <ul>
                <li>获取你的基本信息（昵称、头像等）</li>
                <li>获取你的邮箱</li>
                <li>获取你的手机号</li>
              </ul>
            </div>

            <div class="_div_line"/>
          </div>

          <div class="_authing_form-footer two_buttons">
            <button class="btn btn-primary" @click="redirectURL">授权登录</button>
            <button class="btn btn-primary btn-cancel" @click="cancelAuthorize">取消</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
//const GraphQLClient = require("../../src/graphql.js");
//var axios = require("axios");
//import {GraphQLClient,axios} from "../../src/graphql.js";

export default {
  name: "authorize",
  components: {},

  methods: {
    QueryAppInfoByAppID() {
      // let query = `query {
      //               QueryAppInfoByAppID (appId: "5c7253efe21948de32723725") {
      //                   _id,
      //                   name,
      //                   image,
      //                   redirectUris,
      //                   clientId,
      //                   description,
      //               }
      //             }`;
      // axios.post("https://oauth.authing.cn/graphql", {query}).then(e=>{   //正常写法
      //   console.log(e)
      // });

      /*
        let a = new GraphQLClient({           //错误代码
        baseUrl: 'https://oauth.authing.cn/graphql'
        });
        a.request({query}).then(e=>{
          console.log(e)
        })
      
      
      */

    },

    redirectURL() {
      // redirect to $HOST/authorize to get Authorization Code
      const state = this.$route.query.state || "";
      const appId = this.$route.query.app_id || "";
      const redirectURI = this.$route.query.redirect_uri || "";
      const responseType = this.$route.query.response_type || "";
      const scope = this.$route.query.scope || "";
      const host = this.$root.SSOHost || "https://sso.authing.cn";
      location.href = `${host}/authorize?app_id=${appId}&state=${state}&response_type=${responseType}&redirect_uri=${redirectURI}&scope=${scope}&authorization_header=${localStorage.getItem('_authing_token')}`;
      //this.methods.QueryAppInfoByAppID();
    },

    cancelAuthorize() {
      // redirect to
    }
  },

  data() {
    return {
      screenWidth: document.body.scrollWidth
    };
  },

  mounted() {
    const that = this;
    window.onresize = () => {
      //console.log(that.screenWidth);
      return (() => {
        window.screenWidth = document.body.scrollWidth;
        that.screenWidth = window.screenWidth;
      })();
    };
  }
};
</script>
