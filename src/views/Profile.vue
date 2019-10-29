<template>
  <div class="profile-page">
    <Modal />
    <div class="profile-edit_box">
      <div class="profile-top_bar">
        <span class="authing-lock-back-button" @click="returnPage">
          <!--  style="800200  border-color: #fd7951; background: #fd7951"  -->
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
              stroke="#000"
              stroke-miterlimit="10"
              stroke-width="2"
            />
            <line
              fill="none"
              stroke="#000"
              stroke-miterlimit="10"
              stroke-width="2"
              x1="22"
              x2="3.5"
              y1="12"
              y2="12"
            />
          </svg>
        </span>

        <span class="authing-lock-back-button" @click="quitLogin" style="left: 44px">
          <!-- ;border-color: #fcce4f; background: #fcce4f -->
          <svg
            t="1557666285087"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="2035"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            width="10"
            height="10"
          >
            <!-- <defs>
              <style type="text/css"></style>
            </defs>-->
            <path
              d="M71.30000001 531.9c1.4 1.8 3.1 3.4 4.79999999 4.9l179 178.9c12.5 12.5 32.90000001 12.5 45.4 0s12.5-32.90000001 0-45.4l-126-126L602.7 544.3l0.1 0c18.2 0 32.9-14.8 32.9-33s-14.7-33-32.9-33c-0.3-0.1-0.5 0-0.7 0l-427.8 0 126-126c12.3-12.3 12.3-32.4 0-44.7l-0.7-0.70000001c-12.3-12.3-32.4-12.3-44.7 1e-8l-181.99999999 182c-11.7 11.7-12.29999999 30.6-1.6 43z"
              fill="#000"
              p-id="2036"
              data-spm-anchor-id="a313x.7781069.0.i1"
              class="selected"
            />
            <path
              d="M461.70000001 225c18 0 32.7-14.7 32.7-32.7l0-63.8L894.8 128.5 894.8 895.3l-400.4 0 1e-8-63.1c0-18-14.7-32.7-32.7-32.7s-32.7 14.7-32.70000001 32.7L429 927.7c0 3.49999999 0.6 6.8 1.6 10 4.2 13.3 16.6 23 31.2 23L927.4 960.7c18 0 32.7-14.7 32.7-32.70000001l0-831.9c0-14.2-9.2-26.3-21.8-30.8-3.6-1.4-7.5-2.1-11.5-2.09999999l-463.2 0c-0.6 0-1.3-0.1-1.9-0.1-18 0-32.7 14.7-32.7 32.7l0 96.5c0 18 14.7 32.7 32.70000001 32.7z"
              fill="#000"
              p-id="2037"
              data-spm-anchor-id="a313x.7781069.0.i0"
              class="selected"
            />
            <path
              d="M767.2 511.3a33 32.9 90 1 0-65.8 0 33 32.9 90 1 0 65.8 0Z"
              fill="#000000"
              p-id="2038"
              data-spm-anchor-id="a313x.7781069.0.i3"
              class="selected"
            />
          </svg>
        </span>
      </div>
      <div
        class="msgBar"
        :style="(successShow ? 'height: 44px;' : 'height: 0px;') + 'background: ' + ((tipsType == 'warn' && '#ff3e00') || (tipsType == 'info' && '#00a1ea') || '#00a1ea')"
      >{{showInfo}}</div>

      <div class="profile-nav_bar">
        <div
          class="item"
          style="cursor: pointer"
          :class="nowPage !== 0 ? 'unhover' : ''"
          @click="pageChange(0)"
        >基本资料</div>
        <div
          class="item"
          style="cursor: pointer"
          :class="nowPage !== 1 ? 'unhover' : ''"
          @click="pageChange(1)"
        >详细资料</div>
        <div
          class="item"
          style="cursor: pointer"
          :class="nowPage !== 2 ? 'unhover' : ''"
          @click="pageChange(2)"
        >令牌设置</div>
      </div>

      <div class="profile-good_page" v-if="nowPage == 0">
        <div class="profile-bar">
          <div class="profile-left_bar">
            <div class="authing-form">
              <input
                type="text"
                class="_authing_input _authing_form-control"
                :placeholder="opt.nickName"
                v-model="profileForm.nickName"
                autocomplete="off"
                @keyup.enter="saveInfo"
              />
              <input
                type="text"
                class="_authing_input _authing_form-control"
                :placeholder="opt.phoneNumber"
                v-model="profileForm.phoneNumber"
                autocomplete="off"
                @keyup.enter="saveInfo"
              />
            </div>
          </div>
          <div class="profile-right_bar">
            <div class="profile-avatar_box" @click="choosePhoto">
              <img :src="profileForm.avatarUrl" class="avatar" style="cursor: pointer" />
              <span style="cursor: pointer">修改头像</span>
            </div>
          </div>
        </div>

        <div class="profile-big_bar">
          <div class="authing-form" style="padding: 0 22px;">
            <div class="profile-input_with_label">
              <span>邮箱</span>
              <input
                type="text"
                class="_authing_input _authing_form-control"
                :placeholder="opt.eMail"
                v-model="profileForm.eMail"
                autocomplete="off"
                @keyup.enter="saveInfo"
              />
            </div>

            <div class="profile-input_with_label">
              <span>公司名</span>
              <input
                type="text"
                class="_authing_input _authing_form-control"
                :placeholder="opt.companyName"
                v-model="profileForm.companyName"
                autocomplete="off"
                @keyup.enter="saveInfo"
              />
            </div>

            <div class="profile-input_with_label">
              <span>旧密码</span>
              <input
                type="password"
                class="_authing_input _authing_form-control"
                :placeholder="opt.oldPassWord"
                v-model="profileForm.oldPassWord"
                autocomplete="off"
                @keyup.enter="saveInfo"
              />
            </div>

            <div class="profile-input_with_label">
              <span>新密码</span>
              <input
                type="password"
                class="_authing_input _authing_form-control"
                :placeholder="opt.passWord"
                v-model="profileForm.passWord"
                autocomplete="off"
                @keyup.enter="saveInfo"
              />
            </div>

            <div class="profile-input_with_label">
              <span>确认密码</span>
              <input
                type="password"
                class="_authing_input _authing_form-control"
                :placeholder="opt.passWord2"
                v-model="profileForm.passWord2"
                autocomplete="off"
                @keyup.enter="saveInfo"
              />
            </div>
          </div>
        </div>
        <div class="whitePage" v-if="loading"></div>
      </div>

      <div class="profile-settings_page" style="overflow-y: hidden !important;" v-if="nowPage == 2">
        <!-- <v-tour
          v-if="MFAchecked && typeof(MFA.enable) == 'boolean' && !MFA.enable"
          name="profile_tour"
          :steps="tourSteps"
          :options="tourOptions"
          :callbacks="tourCallBacks"
        ></v-tour>-->

        <div id="imgbar" class="profile-user_info">
          <span class="profile-label">开启动态令牌</span>
          <span class="profile-label_info row-flex-end">
            <label class="switch">
              <input type="checkbox" v-model="MFAchecked" @change="handleChangeMFA"/>
              <div class="slider round"></div>
            </label>
          </span>
        </div>
        <div v-if="MFAchecked" class="profile-user_info">
          <span class="profile-label">应用备注</span>
          <span class="profile-label_info row-flex-end authing-form without-padding">
            <input
              type="text"
              class="_authing_input _authing_form-control mini_input"
              style="text-align: right"
              :placeholder="clientInfo.name ? clientInfo.name : '您的应用备注'"
              v-model="mfaRemark"
              autocomplete="off"
              @change="changeRemark"
            />
          </span>
        </div>
        <div v-if="MFAchecked" class="profile-user_info">
          <span class="profile-label">令牌密钥</span>
          <span class="profile-label_info row-flex-end authing-form without-padding">
            <input
              type="text"
              class="_authing_input _authing_form-control mini_input"
              style="text-align: right"
              placeholder="您的应用密钥"
              :value="MFA ? MFA.shareKey : ''"
              autocomplete="off"
              @click="copyShareKey"
              readonly
            />
          </span>
        </div>
        <div v-if="MFAchecked" class="imgBar">
          <div v-if="remarkChanging > 0" class="remarkBox">
            <div class="k-line k-line10"></div>
          </div>
          <img
            v-if="navBarKey == 0 && !remarkChanging"
            src="https://usercontents.authing.cn/mini-login.jpg"
          />
          <img
            v-if="navBarKey == 2 && !remarkChanging"
            src="https://usercontents.authing.cn/mfa_demo.gif"
            style="border-radius: 6px;"
          />
          <div
            v-if="navBarKey == 1 && !remarkChanging && !(QRCodeImg && QRCodeImg !== '')"
            class="remarkBox"
          >暂无动态令牌二维码</div>
          <img
            v-if="navBarKey == 1 && !remarkChanging && QRCodeImg && QRCodeImg !== ''"
            :src="QRCodeImg"
          />
        </div>
        <div v-if="MFAchecked" class="authing-mfa_navbar">
          <div
            id="step1"
            class="authing-mfa_navbar-item"
            :style="navBarKey == 0 ? 'background: #fafafa;' : ''"
            @click="viewNavBar(0)"
          >
            <span class="text-word">1.扫一扫小登录</span>
          </div>
          <div
            id="step2"
            class="authing-mfa_navbar-item"
            :style="navBarKey == 1 ? 'background: #fafafa;' : ''"
            @click="viewNavBar(1)"
          >
            <span class="text-word">2.添加动态令牌</span>
          </div>
          <div
            id="step3"
            class="authing-mfa_navbar-item"
            :style="(navBarKey == 2 ? 'background: #fafafa;' : '') + 'border-right: none !important;width: calc(100% / 3 + 1px);'"
            @click="viewNavBar(2)"
          >
            <span class="text-word">3.查看令牌密码</span>
          </div>
        </div>
      </div>

      <div
        class="profile-good_page"
        :style="nowPage == 1 ? 'overflow: hidden' : ''"
        v-if="nowPage == 1"
      >
        <div class="profile-user_info">
          <span class="profile-label">用户名</span>
          <span class="profile-label_info">{{userInfo.userName}}</span>
        </div>
        <div class="profile-user_info">
          <span class="profile-label">上次登录时间</span>
          <span class="profile-label_info">{{userInfo.lastLoginTime}}</span>
        </div>
        <div class="profile-user_info">
          <span class="profile-label">上次登录地点</span>
          <span class="profile-label_info">{{userInfo.lastLoginLocation}}</span>
        </div>
        <div class="profile-user_info">
          <span class="profile-label">登录次数</span>
          <span class="profile-label_info">{{userInfo.loginCount}}</span>
        </div>
        <div class="profile-user_info">
          <span class="profile-label">注册时间</span>
          <span class="profile-label_info">{{userInfo.registTime}}</span>
        </div>
        <div class="profile-user_info">
          <span class="profile-label">注册方式</span>
          <span class="profile-label_info">{{userInfo.registMethod}}</span>
        </div>
      </div>

      <div
        v-if="nowPage == 0"
        :class="loading ? 'profile-buttons_bar_loading' : 'profile-buttons_bar'"
        :style="loading ? '' : 'cursor: pointer'"
        @click="saveInfo"
      >
        <span>{{loading ? '' : '保存'}}</span>
        <div class="profile-loading-icon" v-if="loading"></div>
      </div>
    </div>
  </div>
</template>
<script>
import QRCode from "qrcode";
import Modal from "./Modal";
require("../utils/otplib");
import { mapGetters, mapActions } from "vuex";

export default {
  components: { Modal },
  data() {
    return {
      MFAchecked: null,
      openOrClose: false,
      navBarKey: 1,
      userToken: null,
      remarkChanging: null,
      storageUserInfo: {},
      mfaRemark: "",
      QRCodeImg: null,
      MFA: {},
      checked: false,
      $authing: null,
      firstGet: true,
      loading: false,
      nowPage: 0,
      tipsType: "info",
      successShow: false,
      showInfo: "",
      opt: {
        nickName: "请输入昵称",
        phoneNumber: "请输入手机号",
        eMail: "请输入邮箱",
        companyName: "请输入公司名称（选填）",
        oldPassWord: "修改密码，请输入旧密码",
        passWord: "请输入新密码",
        passWord2: "请重复密码"
      },

      profileForm: {
        nickName: "",
        phoneNumber: "",
        avatarUrl: "https://usercontents.authing.cn/client/logo@2.png",
        eMail: "",
        companyName: "",
        oldPassWord: "",
        passWord: "",
        passWord2: ""
      },

      userInfo: {
        userName: "",
        registMethod: "",
        registTime: "",
        loginCount: "",
        lastLoginLocation: "",
        lastLoginTime: ""
      },

      userId: null,
      clientInfo: {},
      clientId: null,
      safetySaving: false,
      quiet: false,
      getting: false
    };
  },
  created() {
    this.opts = this.$root.$data.$authing.opts;
  },
  watch: {
    mfaRemark() {
      this.changeRemark();
    },
    // async MFAchecked() {
    //   if (this.check !== this.MFAchecked) {
    //     if (this.firstGet) {
    //       this.firstGet = false;
    //     } else {
    //       await this.changeValue(this.MFAchecked);
    //     }
    //   }
    // },
    async modalShow(val) {
      if (val == false) {
        await this.unnormalChange();
      }
    }
  },
  async mounted() {
    let that = this
    const Authing = require("authing-js-sdk");
    let client_info =
      JSON.parse(localStorage.getItem("_authing_clientInfo")) || null;
    if (!client_info) {
      this.notLogin();
      return;
    }
    this.clientInfo = client_info;
    let client_id = client_info.clientId || false;
    this.clientId = client_id;
    this.userToken = localStorage.getItem("_authing_token") || null;
    if (this.userToken && client_info) {
      const auth = new Authing({
        userPoolId: that.clientId || that.opts.clientId,
        useSelfWxapp: that.opts.useSelfWxapp,
        host: that.opts.host,
        accessToken: this.userToken
      });
      this.$authing = auth;
      //已经有资料缓存，可以开始读取
      this.getStorageInfo();
      this.getMFAInfo();
    } else {
      this.notLogin();
    }
  },
  computed: {
    ...mapGetters("profile", ["modalShow", "tokenValue"])
  },
  methods: {
    ...mapActions("profile", ["changeModalShow"]),
    async handleChangeMFA(e) {
      let checked = e.target.checked
      await this.changeValue(checked);
    },
    viewNavBar(item) {
      //try {
      //this.$tours['profile_tour'].currentStep = item
      // } finally {
      this.navBarKey = item;
      //}
    },
    async makeQRCode() {
      if(!this.MFA.shareKey) {
        let mfaInfo = await this.$authing.changeMFA({
          userId: this.userId,
          userPoolId: this.clientId,
          enable: false
        });
        this.MFA = mfaInfo
      }
      return new Promise((resovle) => {
        let that = this;
        let userPoolName = this.clientInfo.name || "Authing 应用"; //this.clientInfo.name || 'Authing 应用'
        let userName =
          this.storageUserInfo.username ||
          this.storageUserInfo.nickname ||
          this.storageUserInfo.email ||
          "佚名";
        let userRemark =
          this.mfaRemark && this.mfaRemark !== ""
            ? this.mfaRemark + "-" + userPoolName
            : userPoolName;
        let shareKey = this.MFA.shareKey;
        let clientId = this.clientId;
        let qrurl = `otpauth://totp/${userRemark}?secret=${shareKey}&period=30&digits=6&issuer=${userName}&client=${clientId}`;
        QRCode.toDataURL(qrurl, (err, res) => {
          that.QRCodeImg = res;
          that.navBarKey = 1;
          // try {
          //   that.$tours['profile_tour'].stop()
          // } catch {
          resovle(res)
          // }
        });

      })
    },
    async getMFAInfo() {
      let res = await this.$authing.checkLoginStatus(
        localStorage.getItem("_authing_token")
      );
      if (res.code == 200) {
        this.getting = true;
        let mfaList = await this.$authing.queryMFA({
          userId: this.userId,
          userPoolId: this.clientId
        });
        this.MFAchecked = !!mfaList && mfaList.enable
        // if (mfaList) {
        this.MFA = mfaList || {};
          // this.checked = this.MFA["enable"] || false;
          // this.MFAchecked = this.MFA["enable"] || false;
        if (mfaList) {
          this.makeQRCode();
        }
        // } else {
          // this.showWarnBar("获取动态令牌失败");
        // }
        this.getting = false;
      } else {
        this.notLogin();
        this.getting = false;
      }
    },
    notLogin() {
      this.showSuccessBar("登录身份已过期");
      // let jumpHref;
      sessionStorage.setItem('jump2Profile', true)
      this.$router.push({name: 'indexLogin'})
      // if (location.hostname.indexOf("authing.cn") > -1) {
      //   jumpHref = "https://" + location.hostname + "/login?profile=1";
      // } else {
      //   if (!this.clientId) {
      //     jumpHref = "/error?message=尚未登录&code=id520";
      //   } else {
      //     jumpHref = "/login?app_id=" + this.clientId;
      //   }
      // }
      // setTimeout(() => {
      //   location.href = jumpHref;
      // }, 1000);
      this.loading = false;
    },

    normalChange: async function() {
      let that = this;
      //关闭 MFA 或者首次开启
      if (that.nowPage == 2) {
        if (!that.quiet) {
          that.quiet = false;
          that.showSuccessBar("保存修改中");
        }
      }
      let mfaInfo = await that.$authing.changeMFA({
        userId: that.userId,
        userPoolId: that.clientId,
        enable: that.MFAchecked
      });

      if (mfaInfo.changeMFA) {
        if (that.nowPage == 2) {
          that.showSuccessBar("保存成功");
        }
      } else {
        if (!that.quiet) {
          that.showWarnBar("保存修改失败");
        }
      }
    },

    strictChange: async function(value) {
      let that = this;
      //关闭 MFA 或者首次开启
      if (that.nowPage == 2) {
        // if (!that.quiet) {
        //   that.quiet = false;
        //   that.showSuccessBar("保存修改中");
        // }
      }
      let mfaInfo = await that.$authing.changeMFA({
        userId: that.userId,
        userPoolId: that.clientId,
        enable: value
      });

      if (mfaInfo.changeMFA) {
        if (that.nowPage == 2 && value) {
          //that.showSuccessBar("保存成功");
        }
      } else {
        if (value) {
          that.quiet = false;
          //that.showWarnBar("保存修改失败");
        }
      }
      await that.getMFAInfo();
    },

    async changeValue(checked) {
      let res = await this.$authing.checkLoginStatus(
        localStorage.getItem("_authing_token")
      );
      let that = this;

      if (res.code == 200) {
        if (!checked) {
          // 关闭
          await that.normalChange();
        } else {
          //开启
          // 服务器结果和本地结果不一致，说明要开启
          let data = await this.makeQRCode()
          localStorage.setItem("qrcode", data);
          that.changeModalShow({ show: true, qrcode: data });
        }
      } else {
        this.notLogin();
      }
    },

    async unnormalChange() {
      let that = this;
      try {
        //alert(JSON.stringify(that.MFA))
        let secret = that.MFA.shareKey;
        if (secret) {
          // let token = prompt(
          //   inputerr ? "六位动态口令有误，请重试" : "请输入六位动态令牌口令"
          // );
          let token = this.tokenValue;
          if (typeof token == "string" && token.length == 6 && token > 0) {
            let otpRes = otplib.authenticator.verify({token, secret});
            if (otpRes) {
              that.showSuccessBar("开启成功");
              await that.strictChange(true);
            } else {
              that.showSuccessBar("动态口令有误，请按照教程检查");
              await that.strictChange(false);
            }
          } else {
            if (!token) {
              that.showSuccessBar("您取消了开启动态口令");
              await that.strictChange(false);
            }
            if (token && token == "") {
              that.showSuccessBar("输入不能为空，请检查");
              await that.strictChange(false);
            } else if (!token) {
              that.showSuccessBar("输入为空，不能开启动态令牌");
              await that.strictChange(false);
            } else {
              that.showSuccessBar("动态口令有误，请按照教程检查");
              await that.strictChange(false);
            }
          }
        } else {
          that.showWarnBar("获取服务器令牌信息失败");
          await that.strictChange(false);
        }
      } catch (err) {
        //alert(JSON.stringify(err));
        that.showWarnBar("保存修改失败：MFA 信息获取失败");
        await that.strictChange(false);
      }
    },

    copyShareKey() {
      let that = this;
      function copyText(text, callback) {
        // 网上找的，为了不多加库真的很拼
        var tag = document.createElement("input");
        tag.setAttribute("id", "cp_hgz_input");
        tag.value = text;
        document.getElementsByTagName("body")[0].appendChild(tag);
        document.getElementById("cp_hgz_input").select();
        document.execCommand("copy");
        document.getElementById("cp_hgz_input").remove();
        if (callback) {
          callback(text);
        }
      }
      copyText(this.MFA.shareKey, () => {
        that.showSuccessBar("密钥已复制");
      });
    },

    getStorageInfo() {
      let that = this;
      let userInfo = JSON.parse(localStorage.getItem("_authing_userInfo"));
      this.storageUserInfo = userInfo;
      if (userInfo) {
        that.profileForm.eMail = userInfo.email;

        that.profileForm.nickName = userInfo.username;
        that.profileForm.phoneNumber = userInfo.phone;
        that.profileForm.companyName = userInfo.company;
        that.profileForm.avatarUrl = userInfo.photo;
        that.userId = userInfo._id;

        that.userInfo.userName = userInfo.username;
        that.userInfo.registMethod = userInfo.registerMethod;
        that.userInfo.registTime = userInfo.signedUp;
        that.userInfo.lastLoginTime = userInfo.lastLogin;
        that.userInfo.lastLoginLocation = userInfo.lastIP;
        that.userInfo.loginCount = userInfo.loginsCount;
      }
    },

    returnPage() {
      this.$router.go(-1);
    },

    pageChange(now) {
      this.nowPage = now;
    },

    quitLogin() {
      this.$router.push("/profile/logout");
    },

    showSuccessBar(info) {
      if (!this.successShow) {
        this.tipsType = "info";
        this.successShow = true;
        this.showInfo = info;
        setTimeout(() => {
          this.showInfo = "";
          this.successShow = false;
        }, 1500);
      } else {
        this.showInfo = info;
      }
    },

    changeRemark() {
      if (!this.remarkChanging) {
        this.remarkChanging = setTimeout(() => {
          clearTimeout(this.remarkChanging);
          this.remarkChanging = null;
          this.makeQRCode();
        }, 1000);
      }
    },

    showWarnBar(info) {
      if (!this.successShow) {
        this.tipsType = "warn";
        this.successShow = true;
        this.showInfo = info;
        setTimeout(() => {
          this.showInfo = "";
          this.successShow = false;
        }, 1500);
      }
    },

    async saveInfo() {
      if (this.profileForm.oldPassWord !== "") {
        if (this.profileForm.passWord !== this.profileForm.passWord2) {
          this.showWarnBar("两次密码输入不一致");
        } else if (
          this.profileForm.passWord == "" ||
          this.profileForm.passWord2 == ""
        ) {
          this.showWarnBar("新密码不能为空");
        } else {
          this.loading = true;
          await this.startSaveInfo();
        }
      } else if (
        this.profileForm.oldPassWord == "" &&
        (this.profileForm.passWord !== "" || this.profileForm.passWord2 !== "")
      ) {
        this.showWarnBar("请输入旧密码");
      } else {
        this.loading = true;
        await this.startSaveInfo();
      }
    },

    async startSaveInfo(options) {
      let opt;
      if (!options) {
        opt = {
          _id: this.userId,
          email: this.profileForm.eMail,
          username: this.profileForm.nickName,
          company: this.profileForm.companyName,
          phone: this.profileForm.phoneNumber
        };
        if (this.profileForm.passWord) {
          opt.password = this.profileForm.passWord;
          opt.oldPassword = this.profileForm.oldPassWord;
        }
      } else {
        opt = options;
        opt._id = this.userId;
      }

      this.$authing
        .update(opt)
        .then(e => {
          // console.log(e);
          localStorage.setItem("_authing_userInfo", JSON.stringify(e));
          setTimeout(() => {
            this.getStorageInfo();
            this.loading = false;
            this.showSuccessBar("个人信息已成功更新");
            this.profileForm.oldPassWord = "";
            this.profileForm.passWord = "";
            this.profileForm.passWord2 = "";
          }, 200);
        })
        .catch(err => {
          const { code, message } = err.message;
          if (code == 2203) {
            this.profileForm.oldPassWord = "";
            this.profileForm.passWord = "";
            this.profileForm.passWord2 = "";
          }
          this.showWarnBar(`${code}：${message}`);
          this.loading = false;
        });
    },

    async choosePhoto() {
      this.$authing.selectAvatarFile(cb => {
        this.startSaveInfo({
          photo: cb
        });
      });
    }
  }
};
</script>
<style>
/* @import url("../styles/styles.css"); */
* {
  padding: 0;
  margin: 0;
  font-family: "Inconsolata", Arial, sans-serif;
}

.profile-page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.profile-edit_box {
  width: 100%;
  height: 100%;
  background: #fff;
  position: absolute;
  left: 0;
  top: 0;
}

@media screen and (min-width: 480px) {
  .profile-edit_box {
    width: 100%;
    height: 100%;
    position: relative;
    width: 360px;
    height: 600px;
    margin-top: 4em;

    /* padding: 22px; */
    -webkit-box-shadow: -4px 7px 46px 2px rgba(0, 0, 0, 0.1);
    -o-box-shadow: -4px 7px 46px 2px rgba(0, 0, 0, 0.1);
    box-shadow: -4px 7px 46px 2px rgba(0, 0, 0, 0.1);
    background: #ffffff;
    border-radius: 5px;
  }
}

.profile-top_bar {
  width: 100%;
  height: 100px;
  background: #f3f3f3;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
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

.authing-form ._authing_form-control:focus,
.authing-form ._authing_form-control:active {
  border-bottom: 1px solid rgba(0, 0, 0, 0.4);
}

.authing-form {
  -webkit-box-shadow: none !important;
  -o-box-shadow: none !important;
  box-shadow: none !important;
}

.profile-left_bar {
  width: calc(100% - 110px);
}

.profile-right_bar {
  width: 110px;
  height: auto;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}

.profile-right_bar img {
  width: 90px;
  height: 90px;
  border-radius: 5px;
  background: #f3f3f3;
}

.profile-right_bar .profile-avatar_box:hover {
  -webkit-box-shadow: 0px 2px 8px #a6a6a6;
  -o-box-shadow: 0px 2px 8px #a6a6a6;
  box-shadow: 0px 2px 8px #a6a6a6;
}

.profile-bar {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.profile-avatar_box {
  width: 90px;
  height: 90px;
  transition: all 0.3s;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
}

.profile-avatar_box span {
  width: 90px;
  height: 20px;
  font-size: 11px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #7e7e7e;
  background: #f3f3f380;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  position: absolute;
  z-index: 2;
}

.profile-nav_bar {
  width: 100%;
  height: 44px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.profile-nav_bar .item {
  width: calc(100% / 3);
  height: 44px;
  color: #5c666f;
  border-bottom: 1px solid #5c666f;
  font-size: 13px;
  font-weight: 300;
  letter-spacing: 0.7px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Inconsolata", Arial, sans-serif;
}

.unhover {
  border-bottom: 1px solid #dee0e2 !important;
  color: rgba(92, 102, 111, 0.6) !important;
}

.profile-big_bar {
  width: 100%;
}

.profile-input_with_label {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 11px;
}

.profile-input_with_label span {
  width: 20%;
  font-size: 12px;
  letter-spacing: 0.5px;
  color: #616161;
  font-weight: 300 !important;
  text-align: justify;
}

.profile-input_with_label input {
  width: 80%;
  height: 30px !important;
  font-size: 13px !important;
  padding: 6px 0 !important;
}

.profile-buttons_bar {
  width: 100%;
  height: 60px;
  position: absolute;
  z-index: 4;
  bottom: 0;
  left: 0;
  background: #00a1ea;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  color: #fff;
  letter-spacing: 0.7px;
  font-weight: 300;
}

.profile-buttons_bar_loading {
  width: 100%;
  height: 60px;
  position: absolute;
  z-index: 4;
  bottom: 0;
  left: 0;
  background: #fff;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  color: #fff;
  letter-spacing: 0.7px;
  font-weight: 300;
}

.profile-loading-icon {
  position: absolute;
  width: 22px;
  height: 22px;
  border-width: 2px;
  border-style: solid;
  border-color: rgba(0, 0, 0, 0.4) rgba(0, 0, 0, 0.4) rgba(0, 0, 0, 0.2)
    rgba(0, 0, 0, 0.2);
  opacity: 0.9;
  border-radius: 20px;
  -webkit-animation: rotate 1s linear infinite;
  animation: rotate 1s linear infinite;
}

.profile-loading-icon2 {
  width: 28px;
  height: 28px;
  background-color: #fff;

  border-radius: 100%;
  -webkit-animation: scaleout 1s infinite ease-in-out;
  animation: scaleout 1s infinite ease-in-out;
}

@-webkit-keyframes scaleout {
  0% {
    -webkit-transform: scale(0);
  }
  100% {
    -webkit-transform: scale(1);
    opacity: 0;
  }
}

@keyframes scaleout {
  0% {
    transform: scale(0);
    -webkit-transform: scale(0);
  }
  100% {
    transform: scale(1);
    -webkit-transform: scale(1);
    opacity: 0;
  }
}

.profile-buttons_bar:hover {
  background: #0184bf;
}

.profile-good_page {
  width: 100%;
  height: calc(100% - 145px - 60px);
  overflow-x: hidden;
  overflow-y: scroll;
  position: absolute;
}

.profile-good_page .whitePage {
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.6);
  position: absolute;
  z-index: 6;
  left: 0;
  top: 0;
}

.profile-good_page::-webkit-scrollbar {
  display: none;
}

.profile-user_info {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 18px;
  font-size: 13px;
  color: #515151;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  border-bottom: 1px dashed #f3f3f3;
  background: #fff;
}

.profile-user_info .profile-label {
  width: 30%;
  color: gray;
  font-weight: 300;
}

.profile-user_info .profile-label_info {
  width: 70%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-content: center;
}

.msgBar {
  width: 100%;
  height: 0px;
  /* position: absolute;
  left: 0; */
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0.5px;
  transition: all 0.2s;
}

.switch {
  position: relative;
  display: inline-block;
  width: 45px;
  height: 25.5px;
}

.switch input {
  display: none;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 19.5px;
  width: 19.5px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: #2196f3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196f3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(19.5px);
  -ms-transform: translateX(19.5px);
  transform: translateX(19.5px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

.row-flex-end {
  justify-content: flex-end !important;
}

.profile-settings_page {
  width: 100%;
  height: calc(100% - 145px);
  overflow-x: hidden;
  overflow-y: scroll;
  position: absolute;
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
  background: #fff;
}

.mini_input {
  width: 80%;
  height: 30px !important;
  font-size: 13px !important;
  padding: 6px 0 !important;
  border-bottom: none !important;
}

.without-padding {
  padding: 0 !important;
}

.imgBar {
  box-sizing: border-box;
  padding: 22px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.imgBar > img {
  display: inline-block;
  width: 160px;
  height: 160px;
}

.imgBar > .remarkBox {
  margin-top: 11px;
  width: 149px;
  height: 149px;
  background: #fafafa;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 13px;
  color: #515151;
}

._authing_form-control[readonly] {
  background: #fff !important;
  cursor: pointer;
}

.k-line10 {
  animation: k-loadingH 1s cubic-bezier(0.17, 0.37, 0.43, 0.67) infinite;
  background-color: #2196f3;
}

@keyframes k-loadingH {
  0% {
    width: 15px;
  }
  50% {
    width: 35px;
    padding: 4px;
  }
  100% {
    width: 15px;
  }
}

.k-line {
  display: inline-block;
  width: 15px;
  height: 15px;
  border-radius: 15px;
}

.authing-mfa_navbar {
  width: 90%;
  margin: 0 5%;
  margin-top: 22px;
  height: 40px;
  border-radius: 5px;
  background: #fff;
  border: 2px solid #eee;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  /* box-shadow: 0px 0px 10px #b3b3b3; */
}

.authing-mfa_navbar-item {
  width: calc(100% / 3);
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #707070;
  border-right: 2px dashed #eee;
  cursor: pointer;
  transition: all 0.3s;
}

.text-word {
  font-size: 12px;
  transform: scale(0.75);
}

.v-tour {
  position: fixed;
  z-index: 999;
  font-size: 11px;
  opacity: 0.8;
  min-width: 250px;
}
</style>
