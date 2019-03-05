<template>
  <div>
    <div class="authorize">
      <div class="_authing_container" id="_authing_login_form_content">
        <div class="authing-login-form-wrapper">
          <div class="_authing_form-wrapper animated fast fadeInUp _authing_authorize_container">
            <div class="_authing_form-header">
              <!-- <div class="_authing_delta_bg"></div> -->
              <div class="_authing_logo_bar">
                <img class="_authing_logo_icon" src="../assets/wtf.png">
                <div class="_authing_logo_text">Authing</div>
              </div>
              <div class="_authing_form-header-bg wrong_bg">
                <div>抱歉，似乎出错了</div>
              </div>
            </div>
            <img v-show="false" alt="Vue logo" src="../assets/logo.png">
            <div class="_authing_form_authorize_info">
              <div class="_div_authorize_block2">
                <div class="_div_info_text green">
                  <span>错误信息</span>
                </div>
                <ul>
                  <li>{{errorMessage}}</li>
                </ul>
              </div>

              <div class="_div_line"/>
              <div class="_see_doctor">
                参见开发文档：<a href="https://docs.authing.cn/#/oauthProvider/new" target="_blank">docs.authing.cn</a>
              </div>
            </div>
            <div class="_authing_form-footer _authing_form-footer2">
              <button class="btn" @click="returnBack">返回</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- </div> -->
</template>

<script>
export default {
  data() {
    return {
      errorMessage: "抱歉, 似乎出错了"
    };
  },

  mounted() {
    this.checkError();
  },

  methods: {
    checkError() {
      const message = this.$route.query.message || "抱歉，似乎出错了";
      this.errorMessage = message;
    },

    returnBack() {
      $route.back(-1);
      this.returnOrNot()
    },

    returnOrNot() {
      if(window.history.length <= 1) {
        alert(1)
      }
    }
  }
};
</script>


<style>
@font-face {
  font-family: "icomoon";
  src: url("./fonts/icomoon/icomoon.eot?srf3rx");
  src: url("./fonts/icomoon/icomoon.eot?srf3rx#iefix")
      format("embedded-opentype"),
    url("./fonts/icomoon/icomoon.ttf?srf3rx") format("truetype"),
    url("./fonts/icomoon/icomoon.woff?srf3rx") format("woff"),
    url("./fonts/icomoon/icomoon.svg?srf3rx#icomoon") format("svg");
  font-weight: normal;
  font-style: normal;
}
/* =======================================================
*
* 	Template Style 
*
* ======================================================= */
body {
  font-family: "Inconsolata", Arial, sans-serif;
  font-weight: 400;
  font-size: 18px;
  line-height: 1.7;
  color: #333333;
  background: #fff;
  height: 100vh;
}

#page {
  position: relative;
  overflow-x: hidden;
  width: 100%;
  height: 100%;
  -webkit-transition: 0.5s;
  -o-transition: 0.5s;
  transition: 0.5s;
  display: flex;
  justify-content: center;
  align-items: center;
}

a {
  color: #dd356e;
  -webkit-transition: 0.5s;
  -o-transition: 0.5s;
  transition: 0.5s;
  border: none;
  outline: none;
  text-decoration: none;
}
a:hover,
a:active,
a:focus {
  color: #dd356e;
  outline: none;
  text-decoration: none;
}

p {
  margin-bottom: 30px;
}

h1,
h2,
h3,
h4,
h5,
h6,
figure {
  color: #000;
  font-family: "Inconsolata", Arial, sans-serif;
  font-weight: 400;
  margin: 0 0 20px 0;
}

::-webkit-selection {
  color: #fff;
  background: #dd356e;
}

::-moz-selection {
  color: #fff;
  background: #dd356e;
}

::selection {
  color: #fff;
  background: #dd356e;
}

.fh5co-nav {
  background: #fff;
}
.fh5co-nav .top-menu {
  padding: 28px 0;
}
.fh5co-nav #fh5co-logo {
  font-size: 32px;
  margin: 0;
  padding: 0;
  text-transform: uppercase;
  font-weight: 700;
  font-family: "Inconsolata", Arial, sans-serif;
}
.fh5co-nav #fh5co-logo a span {
  color: #dd356e;
}
.fh5co-nav a {
  padding: 5px 10px;
  color: #000;
}
@media screen and (max-width: 768px) {
  .fh5co-nav .menu-1 {
    display: none;
  }
}
.fh5co-nav ul {
  padding: 0;
  margin: 5px 0 0 0;
}
.fh5co-nav ul li {
  padding: 0;
  margin: 0;
  list-style: none;
  display: inline;
}
.fh5co-nav ul li a {
  font-size: 18px;
  padding: 30px 15px;
  color: rgba(0, 0, 0, 0.7);
  -webkit-transition: 0.5s;
  -o-transition: 0.5s;
  transition: 0.5s;
}
.fh5co-nav ul li a:hover,
.fh5co-nav ul li a:focus,
.fh5co-nav ul li a:active {
  color: black;
}
.fh5co-nav ul li.has-dropdown {
  position: relative;
}
.fh5co-nav ul li.has-dropdown .dropdown {
  width: 140px;
  -webkit-box-shadow: 0px 14px 33px -9px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 14px 33px -9px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 14px 33px -9px rgba(0, 0, 0, 0.75);
  z-index: 1002;
  visibility: hidden;
  opacity: 0;
  position: absolute;
  top: 40px;
  left: 0;
  text-align: left;
  background: #000;
  padding: 20px;
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  -ms-border-radius: 4px;
  border-radius: 4px;
  -webkit-transition: 0s;
  -o-transition: 0s;
  transition: 0s;
}
.fh5co-nav ul li.has-dropdown .dropdown:before {
  bottom: 100%;
  left: 40px;
  border: solid transparent;
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
  border-bottom-color: #000;
  border-width: 8px;
  margin-left: -8px;
}
.fh5co-nav ul li.has-dropdown .dropdown li {
  display: block;
  margin-bottom: 7px;
}
.fh5co-nav ul li.has-dropdown .dropdown li:last-child {
  margin-bottom: 0;
}
.fh5co-nav ul li.has-dropdown .dropdown li a {
  padding: 2px 0;
  display: block;
  color: #999999;
  line-height: 1.2;
  text-transform: none;
  font-size: 13px;
  letter-spacing: 0;
}
.fh5co-nav ul li.has-dropdown .dropdown li a:hover {
  color: #fff;
}
.fh5co-nav ul li.has-dropdown:hover a,
.fh5co-nav ul li.has-dropdown:focus a {
  color: #000;
}
.fh5co-nav ul li.btn-cta a {
  padding: 30px 0px !important;
  color: #fff;
}
.fh5co-nav ul li.btn-cta a span {
  background: #dd356e;
  padding: 4px 10px;
  display: -moz-inline-stack;
  display: inline-block;
  zoom: 1;
  *display: inline;
  -webkit-transition: 0.3s;
  -o-transition: 0.3s;
  transition: 0.3s;
  -webkit-border-radius: 100px;
  -moz-border-radius: 100px;
  -ms-border-radius: 100px;
  border-radius: 100px;
}
.fh5co-nav ul li.btn-cta a:hover span {
  -webkit-box-shadow: 0px 14px 20px -9px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 14px 20px -9px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 14px 20px -9px rgba(0, 0, 0, 0.75);
}
.fh5co-nav ul li.active > a {
  color: #000 !important;
  position: relative;
}
.fh5co-nav ul li.active > a:after {
  position: absolute;
  bottom: 25px;
  left: 0;
  right: 0;
  content: "";
  width: 30px;
  height: 2px;
  background: #dd356e;
  margin: 0 auto;
}

#fh5co-counter,
.fh5co-bg,
.product {
  background-size: cover;
  background-position: top center;
  background-repeat: no-repeat;
  position: relative;
}

.fh5co-video {
  overflow: hidden;
}
@media screen and (max-width: 992px) {
  .fh5co-video {
    height: 450px;
  }
}
.fh5co-video a {
  z-index: 1001;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -45px;
  margin-left: -45px;
  width: 90px;
  height: 90px;
  display: table;
  text-align: center;
  background: #fff;
  -webkit-box-shadow: 0px 14px 30px -15px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 14px 30px -15px rgba(0, 0, 0, 0.75);
  -ms-box-shadow: 0px 14px 30px -15px rgba(0, 0, 0, 0.75);
  -o-box-shadow: 0px 14px 30px -15px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 14px 30px -15px rgba(0, 0, 0, 0.75);
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  -ms-border-radius: 50%;
  border-radius: 50%;
}
.fh5co-video a i {
  text-align: center;
  display: table-cell;
  vertical-align: middle;
  font-size: 40px;
}
.fh5co-video .overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  -webkit-transition: 0.5s;
  -o-transition: 0.5s;
  transition: 0.5s;
}
.fh5co-video:hover .overlay {
  background: rgba(0, 0, 0, 0.7);
}
.fh5co-video:hover a {
  -webkit-transform: scale(1.1);
  -moz-transform: scale(1.1);
  -ms-transform: scale(1.1);
  -o-transform: scale(1.1);
  transform: scale(1.1);
}

#fh5co-header .display-tc,
.fh5co-cover .display-tc {
  display: table-cell !important;
  vertical-align: middle;
}
#fh5co-header .display-tc h1,
#fh5co-header .display-tc h2,
.fh5co-cover .display-tc h1,
.fh5co-cover .display-tc h2 {
  margin: 0;
  padding: 0;
  color: black;
}
#fh5co-header .display-tc h1,
.fh5co-cover .display-tc h1 {
  margin-bottom: 20px;
  font-size: 54px;
  line-height: 1.3;
  font-weight: 300;
}
@media screen and (max-width: 768px) {
  #fh5co-header .display-tc h1,
  .fh5co-cover .display-tc h1 {
    font-size: 30px;
  }
}
#fh5co-header .display-tc h2,
.fh5co-cover .display-tc h2 {
  font-size: 20px;
  line-height: 1.5;
  margin-bottom: 30px;
}

.fh5co-heading {
  margin-bottom: 5em;
}
.fh5co-heading.fh5co-heading-sm {
  margin-bottom: 2em;
}
.fh5co-heading h2 {
  font-size: 40px;
  margin-bottom: 20px;
  line-height: 1.5;
  color: #000;
}
.fh5co-heading p {
  font-size: 18px;
  line-height: 1.5;
  color: #828282;
}
.fh5co-heading span {
  display: block;
  margin-bottom: 10px;
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 2px;
}

.nopadding {
  padding: 0 !important;
  margin: 0 !important;
}

.js .animate-box {
  opacity: 0;
}

/*# sourceMappingURL=style.css.map */
</style>
