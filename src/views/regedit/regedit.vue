<template>
  <div class="con">
    <el-dialog title="未登录提示" :visible="dialogShow" width="30%">
      <span>您还未登录，点击确定跳转至登陆页面</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogShow = false">取 消</el-button>
        <el-button type="primary" @click="handleLogin">确 定</el-button>
      </span>
    </el-dialog>
    <div class="regBox">
      <el-form :model="currentUser" label-width="150px" :rules="rules" ref="currentUser">
        <el-form-item label="昵称">
          <el-input v-model="currentUser.name" class="regInput"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio v-model="currentUser.gender" label="1">男</el-radio>
          <el-radio v-model="currentUser.gender" label="2">女</el-radio>
        </el-form-item>
        <el-form-item label="出生日期">
          <el-date-picker v-model="currentUser.birthDate" type="date" placeholder="请选择出生日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="学校" required style="margin-bottom:9px">
          <span
            class="schoolSpan"
            @click="alertChooseProvince"
          >{{schoolTextShow?province1+"-"+school1:"点击选择学校"}}</span>
          <span class="f_12 black3 padl15">请填写所在学校，认证后可以修改</span>
          <span class="schoolTips" v-show="showSchoolTips">学校不能为空</span>
        </el-form-item>
        <el-form-item label="用户职业" required prop="job">
          <el-radio-group v-model="currentUser.job">
            <el-radio :label="1">教师</el-radio>
            <el-radio :label="2">学生</el-radio>
            <el-radio :label="3">教务人员</el-radio>
            <el-radio :label="4">培训教育机构</el-radio>
            <el-radio :label="5">其他</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="感兴趣的专业" style="margin-bottom:8px;" required>
          <el-select
            v-model="currentUser.intreMajor1"
            placeholder="请选择"
            class="majorSelect"
            @change="majorChange"
            filterable
          >
            <el-option
              v-for="item in majorOptions"
              :key="item.nodeid"
              :label="item.text"
              :value="item.text"
            ></el-option>
          </el-select>
          <el-select
            v-model="currentUser.intreMajor2"
            placeholder="请选择"
            class="majorSelect"
            @change="majorChange"
            filterable
          >
            <el-option
              v-for="item in majorOptions"
              :key="item.nodeid"
              :label="item.text"
              :value="item.text"
            ></el-option>
          </el-select>
          <br />
          <el-select
            v-model="currentUser.intreMajor3"
            placeholder="请选择"
            class="majorSelect"
            @change="majorChange"
            filterable
          >
            <el-option
              v-for="item in majorOptions"
              :key="item.nodeid"
              :label="item.text"
              :value="item.text"
            ></el-option>
          </el-select>
          <span class="majorTips">最多可添加3个专业</span>
          <div class="interTips" v-show="showInterTip">请选择感兴趣的专业</div>
        </el-form-item>

        <el-form-item label="QQ">
          <el-input v-model="currentUser.QQ" size="medium" class="regInput"></el-input>
        </el-form-item>
        <el-form-item label prop="checked">
          <el-checkbox label="我已阅读并同意高教出版社门户网络使用协议" v-model="currentUser.checked">
            <router-link
              target="_blank"
              :to="{path:'/PrivacyPolicy'}"
              style="    text-decoration: none;
    font-size: 12px;
    color: #6a5d5d;"
            >同意《高教出版社门户网络使用协议》</router-link>
          </el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">点击完成</el-button>
        </el-form-item>
      </el-form>
      <div class="avatarBox">
        <div class="avatarDefault">
          <img src id="avatarImg" v-show="showImg" />
        </div>
        <span @click="onChooseImg" class="chooseImgBt">点击上传头像</span>
      </div>
    </div>
    <div v-if="!closeForm" class="authing-form-badge-bottom">
      <a
        href="https://authing.cn/?utm_source=form&amp;utm_campaign=badge&amp;utm_medium=widget"
        target="_blank"
        class="_authing_a authing-form-badge"
      >
        <span>Protected with</span>
        <span>高等教育出版社用户中心</span>
      </a>
    </div>
    <div class="modelProvince" v-show="provinceChooseShow">
      <span style="font-weight:bold;
    margin: 8px 8px 8px;
    display: inline-block;">选择:</span>
      <hr />
      <div class="provinceBox">
        <span
          class="proOptions"
          v-for="item in provinceList"
          :key="item.nodeid"
          @click="chooseProvince(item)"
        >{{item.text}}</span>
      </div>
    </div>
    <div class="modelSchool" v-show="schoolChooseShow">
      <span style="font-weight:bold;
    margin: 8px 8px 8px;
    display: inline-block;">
        {{currentProvince.text}}
        <span
          style="font-weight: normal;
    margin-left: 806px;cursor:pointer
"
          @click="closeChoose"
        >X</span>
      </span>
      <hr />
      <div class="schoolBox" v-if="schoolList">
        <span
          class="schOptions"
          v-for="item in schoolList"
          :key="item.nodeid"
          @click="chooseSchool(item)"
        >{{item.text}}</span>
      </div>
      <div class="schoolNull" v-else>
        <span>此城市下没有找到大学哦~</span>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    let validateSure = (rule, value, callback) => {
      if (this.currentUser.checked) {
        callback();
      } else {
        callback(new Error("请同意协议哦"));
      }
    };
    return {
      currentUser: {
        gender: "1",
        province: "",
        school: "",
        job: 1,
        intreMajor1: "",
        intreMajor2: "",
        intreMajor3: "",
        checked: true,
        avatar: ""
      },
      provinceChooseShow: false,
      schoolChooseShow: false,
      schoolList: [],
      schoolTextShow: false,
      showSchoolTips: false,
      dialogShow: false,
      majorOptions: [],
      $authing: null,
      opts: {},
      redirectToProfile: false,
      clientInfo: {},
      userToken: "",
      authingOnError: false,

      closeForm: false,
      removeDom: false,
      showImg: false,
      rules: {
        school: [
          {
            required: true,
            message: "请选择学校",
            trigger: "change"
          }
        ],
        job: [{ required: true, message: "请选择职业", trigger: "change" }],
        checked: [{ validator: validateSure, trigger: "change" }]
      },
      showInterTip: false,
      userId: "",
      currentProvince: { text: "北京" },
      userInfo: "",
      testJson: [],
      provinceList: [],
      province1: "",
      school1: ""
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
    document.onkeydown = event => {
      var e = event || window.event || arguments.callee.caller.arguments[0];
      if (e && e.keyCode === 27) {
        this.handleClose();
      }
    };
  },
  async mounted() {
    if (this.opts.isSSO) {
      if (this.$route.query.profile) {
        this.redirectToProfile = true;
      }
      // 上来先查一下 appInfo
    }
    if (!localStorage.getItem("_authing_clientInfo")) {
      this.dialogShow = true;
    } else {
      this.clientId =
        JSON.parse(localStorage.getItem("_authing_clientInfo"))["clientId"] ||
        null;
      this.userToken = localStorage.getItem("_authing_token") || null;
      this.userId =
        JSON.parse(localStorage.getItem("_authing_userInfo"))["_id"] || null;
      this.userInfo = JSON.parse(localStorage.getItem("_authing_userInfo"));
      const that = this;
      let auth = new Authing({
        userPoolId: that.clientId || that.opts.clientId,
        host: that.opts.host,
        accessToken: that.userToken,
        cdnHost: "https://node2d-public.hep.com.cn",
        onInitError: err => {
          this.changeLoading({ el: "page", loading: false });
          this.authingOnError = true;
          this.showGlobalMessage({
            type: "error",
            message: "Error: " + err.message
          });
          this.$authing.pub("authing-unload", err);
        },
        passwordEncPublicKey: that.opts.passwordEncPublicKey
      });

      let userPoolSettings = await auth.getUserPoolSettings(
        that.clientId || that.opts.clientId
      );
      this.clientInfo = userPoolSettings;
      this.changeLoading({ el: "page", loading: false });

      window.validAuth = auth;
      window.validAuth.clientInfo = userPoolSettings;
      this.$authing.pub("authing-load", validAuth);

      fetch("https://node2d-public.hep.com.cn/zy.json").then(res => {
        res.json().then(resp => {
          this.majorOptions = resp;
        });
      });
      fetch("https://node2d-public.hep.com.cn/school2.json").then(res => {
        res.json().then(resp => {
          this.testJson = resp;
          this.handleSchool();
        });
      });

      window.validAuth.metadata(this.userId).then(res => {
        if (res) {
          for (let val of res.list) {
            if (val.key === "currentUser") {
              let str = "";
              str = str + res.list[0].value;
              if (JSON.parse(str)) {
                this.currentUser = JSON.parse(str);
                if (this.currentUser.photo) {
                  document.getElementById(
                    "avatarImg"
                  ).src = this.currentUser.photo;
                  this.showImg = true;
                }
                this.currentUser.job = 1;
                this.currentUser.checked = true;
                if (!this.currentUser.nickname) {
                  this.currentUser.nickname = this.userInfo.nickname;
                }
                if (this.currentUser.school) {
                  this.province1 = this.currentUser.province;
                  this.school1 = this.currentUser.school;
                  this.schoolTextShow = true;
                }
              }
            }
          }
        }
      });
    }
  },
  destroyed() {
    sessionStorage.removeItem("jump2Profile");
  },
  methods: {
    chooseProvince(val) {
      this.showSchoolTips = false;
      this.currentProvince = val;
      this.provinceChooseShow = false;
      this.schoolChooseShow = true;
      //从jsonTest里面 找到 nodeid==val.node的,this.schoolList = nodes
      for (let value of this.testJson) {
        if (value.nodeid === val.nodeid) {
          this.schoolList = value.nodes;
        }
      }
    },
    chooseSchool(val) {
      this.schoolTextShow = true;
      this.school1 = val.text;
      this.province1 = this.currentProvince.text;
      this.currentUser.province = this.currentProvince.text;
      this.schoolChooseShow = false;
      this.currentUser.school = val.text;
    },
    alertChooseProvince() {
      this.provinceChooseShow = true;
    },
    handleSchool() {
      for (let val of this.testJson) {
        this.provinceList.push(val);
      }
    },
    closeChoose() {
      this.schoolChooseShow = false;
      if (this.currentUser.school) {
        this.schoolTextShow = true;
      } else {
        this.schoolTextShow = false;
      }
    },
    handleLogin() {
      //跳转到登录页面
      sessionStorage.setItem("jumpRegedit", true);
      this.$router.push({
        name: "indexLogin"
      });
      this.dialogShow = false;
    },
    majorChange() {
      this.showInterTip = false;
    },
    onChooseImg() {
      let that = this;
      window.validAuth.selectAvatarFile(val => {
        document.getElementById("avatarImg").src = val;
        this.showImg = true;
        this.currentUser.photo = val;
        window.validAuth.update({ _id: that.userId, photo: val });
      });
    },
    backPage() {
      //格式检验
      let reg = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/;
      if (reg.test(this.params.redirect_uri)) {
        location.href = this.params.redirect_uri;
      }
    },
    onSubmit() {
      this.$refs["currentUser"].validate(valid => {
        if (valid) {
          if (
            this.currentUser.intreMajor1 ||
            this.currentUser.intreMajor2 ||
            this.currentUser.intreMajor3
          ) {
            if (this.currentUser.school) {
              this.handleSubmit();
            } else {
              this.showSchoolTips = true;
              return false;
            }
          } else {
            this.showInterTip = true;
            return false;
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleSubmit() {
      window.validAuth
        .setMetadata({
          _id: this.userId,
          key: "currentUser",
          value: JSON.stringify(this.currentUser)
        })
        .then(res => {
          //在这里执行update  更新昵称
          window.validAuth.update({
            _id: this.userId,
            nickname: this.currentUser.name
          });
          if (res) {
            $message.success({ message: "您已成功完善信息" });
          }
          this.backPage();
        });
    },
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
    }
  },
  computed: {
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
  }
};
</script>
<style scoped>
.con {
  background: #f1f1f1;
  padding-top: 30px;
}
.regInput {
  width: 220px;
}
#avatarImg {
  width: 100%;
  height: 100%;
}
.chooseImgBt {
  color: hsl(207, 68%, 67%);
  font-size: 12px;
  cursor: pointer;
  margin-left: 15px;
}
.majorSelect {
  margin-right: 25px;
  margin-bottom: 10px;
}
.avatarDefault {
  width: 100px;
  height: 100px;
  border: 1px dashed #cccccc;
}
.avatarBox {
  position: absolute;
  top: 120px;
  left: 726px;
}
.majorTips {
  font-size: 13px;
  color: #a29090;
}
.interTips {
  color: red;
  font-size: 12px;
  line-height: 12px;
}
.regBox {
  width: 65%;
  border: 1px solid #ccc;
  margin-left: 223px;
  border-radius: 2px;
  box-shadow: 1px 1px 1px 1px #ccc;
  background: #fff;
  padding-top: 50px;
  padding-left: 45px;
}
.authing-form-badge-bottom {
  position: fixed;
  bottom: 15px;
  left: 15px;
  z-index: 5;
  text-align: center;
  padding: 6px 10px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.1);
  -webkit-box-shadow: 2px -2px 5px #eaeaea;
  box-shadow: 2px -2px 5px #eaeaea;
}
.schoolTips {
  color: red;
  font-size: 12px;
  display: block;
  line-height: 20px;
}
.modelProvince {
  width: 50%;
  background: #f5f7faf0;
  border: 1px solid #cccccc;
  height: 300px;
  position: absolute;
  left: 325px;
  top: 240px;
  border-radius: 5px;
}
.provinceBox {
  width: 100%;
  height: 256px;
  overflow: auto;
}
.schoolBox {
  width: 100%;
  height: 332px;
  overflow: auto;
}
.schoolNull {
  text-align: center;
  display: block;
  width: 100%;
  height: 350px;
  overflow: auto;
}
.modelSchool {
  width: 70%;
  background: #f5f7faf0;
  border: 1px solid #cccccc;
  height: 393px;
  position: absolute;
  left: 200px;
  top: 240px;
  border-radius: 5px;
}
.schoolSpan {
  display: inline-block;
  width: 220px;
  border: 1px solid #cccccc7d;
  border-radius: 5px;
  line-height: 38px;
  text-align: center;
  color: #606266;
  cursor: pointer;
}
.proOptions {
  cursor: pointer;
  width: 146px;
  margin-right: 6px;
  margin-bottom: 10px;
  display: inline-block;
  text-align: center;
}
.schOptions {
  cursor: pointer;
  width: 272px;
  margin-right: 6px;
  margin-bottom: 10px;
  display: inline-block;
  text-align: center;
}
.proOptions:hover,
.schOptions:hover {
  color: rgba(11, 125, 149, 1);
}
.f_12 {
  font-size: 12px;
}
.black3 {
  color: #999;
}
.padl15 {
  padding-left: 15px;
}
</style>