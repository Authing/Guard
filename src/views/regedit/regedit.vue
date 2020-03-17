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
      <el-form :model="currentUser" label-width="150px" :rules="rules" ref="ruleForm">
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="currentUser.email" class="regInput"></el-input>
        </el-form-item>
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
        <el-form-item label="所在省份" required prop="province">
          <el-select v-model="currentUser.province" placeholder="请选择">
            <el-option
              v-for="item in proOptions"
              :key="item.id"
              :label="item.description"
              :value="item.description"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所在学校" required prop="school">
          <el-select v-model="currentUser.school" placeholder="请选择" filterable>
            <el-option
              v-for="item in schOptions"
              :key="item.nodeid"
              :label="item.text"
              :value="item.text"
            ></el-option>
          </el-select>
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
            <a
              href="https://ebook.hep.com.cn/ebooks/index.html#/staticys"
              target="_blank"
              style="text-decoration: none;
    font-size: 12px;
    color: #555;
}"
            >我已阅读并同意高教出版社门户网络使用协议</a>
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
    let regE = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,6})+$/;
    let emailVal = (rule, value, callback) => {
      if (value) {
        let valueBool = value.trim().match(regE);
        if (valueBool) {
          callback();
        } else {
          callback(new Error("请填写正确的邮箱。"));
        }
      } else {
        callback();
      }
    };
    return {
      currentUser: {
        email: "",
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
      dialogShow: false,
      proOptions: null,
      schOptions: [],
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
        province: [
          { required: true, message: "请选择省份", trigger: "change" }
        ],
        school: [
          {
            required: true,
            message: "请选择学校",
            trigger: "change"
          }
        ],
        job: [{ required: true, message: "请选择职业", trigger: "change" }],
        checked: [{ validator: validateSure, trigger: "change" }],
        email: [
          {
            validator: emailVal,
            trigger: "blur"
          }
        ]
      },
      showInterTip: false,
      userId: "",
      major: [],
      school: []
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

      fetch("https://node2d-public.hep.com.cn/province.json").then(res => {
        res.json().then(resp => {
          this.proOptions = resp.province;
        });
      });
      fetch("https://node2d-public.hep.com.cn/zy.json").then(res => {
        res.json().then(resp => {
          this.majorOptions = resp;
        });
      });
      this.schOptions = [];
      fetch("https://node2d-public.hep.com.cn/school.json").then(res => {
        res.json().then(resp => {
          this.schOptions = resp;
        });
      });
      window.validAuth.metadata(this.userId).then(res => {
        let str = "";
        str = str + res.list[0].value;
        if (JSON.parse(str)) {
          this.currentUser = JSON.parse(str);
          console.log(this.currentUser);
          if (this.currentUser.photo) {
            document.getElementById("avatarImg").src = this.currentUser.photo;
            this.showImg = true;
          }
          this.currentUser.job = 1;
          this.currentUser.checked = true;
        }
      });
    }
  },
  destroyed() {
    sessionStorage.removeItem("jump2Profile");
  },
  methods: {
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
    onSubmit() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          if (
            this.currentUser.intreMajor1 ||
            this.currentUser.intreMajor2 ||
            this.currentUser.intreMajor3
          ) {
            window.validAuth
              .setMetadata({
                _id: this.userId,
                key: "currentUser",
                value: JSON.stringify(this.currentUser)
              })
              .then(res => {
                if (res) {
                  console.log(res);
                  $message.success({ message: "您已成功完善信息" });
                }
              });
            ////////这里提交表单
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
</style>