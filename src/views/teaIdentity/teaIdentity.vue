<template>
  <div class="con">
    <el-dialog title="未登录提示" :visible="dialogShow" width="30%">
      <span>您还未登录，点击确定跳转至登陆页面</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogShow = false">取 消</el-button>
        <el-button type="primary" @click="handleLogin">确 定</el-button>
      </span>
    </el-dialog>
    <div class="bdround bgwhite regbox" style="border:5px solid #c0ecf4;" v-show="!submitted">
      <!-- 未提交过审核 -->
      <div class="text-center f_30 whrite lh-40 padt50 tcherbg"></div>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="120px"
        style="    margin-left: 126px;
    margin-top: 20px;
"
      >
        <el-row class="marb20">
          <el-col :span="21" :offset="3">
            <el-form-item label="真实姓名" prop="realname" required>
              <el-input
                style="width:220px;"
                v-model="ruleForm.realname"
                :disabled="this.status=='1'"
              ></el-input>
              <span class="f_12 black3 padl15">请填写真实姓名，认证后不可修改</span>
            </el-form-item>

            <el-form-item label="性别" prop="gender" required>
              <el-radio-group
                style="width:220px;"
                v-model="ruleForm.gender"
                :disabled="this.status=='1'"
              >
                <el-radio label="1">男</el-radio>
                <el-radio label="2">女</el-radio>
              </el-radio-group>
              <span class="f_12 black3 padl15">请填写性别，认证后不可修改</span>
            </el-form-item>

            <el-form-item label="出生日期" prop="birthDate" required>
              <el-date-picker
                style="width:220px;"
                v-model="ruleForm.birthDate"
                type="date"
                placeholder="请选择出生日期"
                value-format="yyyy-MM-dd"
                :disabled="this.status=='1'"
              ></el-date-picker>
              <span class="f_12 black3 padl15">请填写出生日期，认证后不可修改</span>
            </el-form-item>

            <el-form-item label="教师资格证" required>
              <el-button
                size="small"
                type="primary"
                :disabled="this.status=='1'"
                @click="onChooseImg"
              >点击上传</el-button>
              <img src id="avatarImg" v-show="showImg" />
              <div slot="tip" class="f_12 black3">请上传教师资格证，只能上传jpg/png文件，且不超过4Mb。认证后不可修改。</div>
              <span v-show="imgTips" class="imgTips">教师资格证忘了上传哦</span>
            </el-form-item>

            <!-- <el-form-item label="所在省份" prop="province">
              <el-select style="width:220px;" v-model="ruleForm.province" placeholder="请选择省份">
                <el-option
                  v-for="province in provinceList"
                  :key="province.id"
                  :label="province.description"
                  :value="province.description"
                ></el-option>
              </el-select>
              <span class="f_12 black3 padl15">请填写所在省份，认证后可以修改</span>
            </el-form-item>-->

            <el-form-item label="所在学校" prop="school">
              <el-select
                style="width:220px;"
                v-model="ruleForm.school"
                placeholder="请选择学校"
                filterable
              >
                <el-option
                  v-for="school in schoolList"
                  :label="school.text"
                  :value="school.text"
                  :key="school.nodeid"
                ></el-option>
              </el-select>
              <span class="f_12 black3 padl15">请填写所在学校，认证后可以修改</span>
            </el-form-item>

            <el-form-item label="所在院系" prop="department" required>
              <el-input style="width:220px;" v-model="ruleForm.department"></el-input>
              <span class="f_12 black3 padl15">请填写所在院系，认证后可以修改</span>
            </el-form-item>

            <el-form-item label="专业" prop="profession" required>
              <el-select
                v-model="ruleForm.profession"
                placeholder="请选择"
                class="majorSelect"
                filterable
              >
                <el-option
                  v-for="item in majorOptions"
                  :key="item.nodeid"
                  :label="item.text"
                  :value="item.text"
                ></el-option>
              </el-select>
              <span class="f_12 black3 padl15">请选择专业，认证后可以修改</span>
            </el-form-item>

            <el-form-item label="职称">
              <el-select style="width:220px;" v-model="ruleForm.title" placeholder="请选择职称">
                <el-option value="教授"></el-option>
                <el-option value="副教授"></el-option>
                <el-option value="讲师"></el-option>
                <el-option value="其他"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="职务">
              <el-input style="width:220px;" v-model="ruleForm.business"></el-input>
            </el-form-item>

            <el-form-item label="教授课程" prop="course" required>
              <div>
                <el-input style="margin:0 15px 10px 0;width:220px;" v-model="ruleForm.course[0]"></el-input>
                <el-input style="margin:0 15px 10px 0;width:220px;" v-model="ruleForm.course[1]"></el-input>
                <br />
                <el-input style="margin:0 0 10px 0;width:220px;" v-model="ruleForm.course[2]"></el-input>
                <span class="f_12 black3 padl15">请填写1门至3门教授课程，认证后可以修改</span>
              </div>
            </el-form-item>

            <el-form-item label="教学层次" prop="level" required>
              <el-select style="width:220px;" v-model="ruleForm.level" placeholder="请选择教学层次">
                <el-option value="大学本科及以上"></el-option>
                <el-option value="高等职业"></el-option>
                <el-option value="中等职业"></el-option>
                <el-option value="五年制高职"></el-option>
              </el-select>
              <span class="f_12 black3 padl15">请填写教学层次，认证后可以修改</span>
            </el-form-item>

            <el-form-item label="固定电话" prop="tel">
              <el-input style="width:220px;" v-model="ruleForm.tel"></el-input>
              <span class="f_12 black3 padl15">请填写正确的电话号码，格式：区号-电话号码</span>
            </el-form-item>

            <el-form-item label="通讯地址">
              <el-input style="width:220px;" v-model="ruleForm.address"></el-input>
            </el-form-item>

            <el-form-item label="邮编" prop="postcode">
              <el-input style="width:220px;" v-model="ruleForm.postcode"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">点击认证</el-button>
              <el-button>取消</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div v-show="submitted">
      <!-- 如果通过审核了，提示请耐心等待，并跳回其他页面或等待用户关闭 -->
      <el-dialog title="未登录提示" width="30%" :visible="tipsSubmitted">
        <span>您的审核已提交，请耐心等待，如有修改，请点击修改。</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleEdit">修改</el-button>
          <el-button @click="backPage" v-show="showReturn">返回</el-button>
          <el-button @click="closePage" v-show="!showReturn">关闭</el-button>
        </span>
      </el-dialog>
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
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    let phone_reg = new RegExp(/^\d{3}-\d{7,8}|\d{4}-\d{7,8}$/);
    let phoneVal = (rule, value, callback) => {
      let valueBool = value.trim().match(phone_reg);
      if (value) {
        if (valueBool) {
          callback();
        } else {
          callback(new Error("请填写正确的固定电话号码。"));
        }
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        realname: "",
        gender: "1",
        birthDate: "",
        tel: "",
        // province: "",
        school: "",
        department: "",
        profession: "",
        title: "",
        business: "",
        course: [],
        level: "",
        address: "",
        postcode: "",
        certificatesUrls: ""
      },
      status: 0,
      submitted: false,
      tipsSubmitted: true,
      provinceList: [],
      schoolList: [],
      majorOptions: [],
      $authing: null,
      opts: {},
      appLogo: "",
      appName: "",
      defaultLogo: "https://usercontents.authing.cn/client/logo@2.png",
      clientInfo: {},
      userToken: "",
      authingOnError: false,

      closeForm: false,
      removeDom: false,
      dialogShow: false,
      hasLDAP: false,
      showImg: false,
      rules: {
        // province: [
        //   { required: true, message: "请选择省份", trigger: "change" }
        // ],
        school: [
          {
            required: true,
            message: "请选择学校",
            trigger: "change"
          }
        ],
        tel: [{ validator: phoneVal, trigger: "blur" }]
      },
      showReturn: false,
      userId: "",
      imgTips: ""
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
    if (this.params.redirect_uri) {
      this.showReturn = true;
    }
  },
  async mounted() {
    fetch("https://node2d-public.hep.com.cn/zy.json").then(res => {
      res.json().then(resp => {
        this.majorOptions = resp;
      });
    });
    // fetch("https://node2d-public.hep.com.cn/province.json").then(res => {
    //   res.json().then(resp => {
    //     this.provinceList = resp.province;
    //   });
    // });
    fetch("https://node2d-public.hep.com.cn/school.json").then(res => {
      res.json().then(resp => {
        this.schoolList = resp;
      });
    });
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
      window.validAuth.metadata(this.userId).then(res => {
        if (res) {
          let regeditUser = null;
          let teaIdentityUser = null;
          for (let val of res.list) {
            if (val.key === "currentUser") {
              regeditUser = JSON.parse(val.value);
            }
            if (val.key === "teaIdentityForm") {
              teaIdentityUser = JSON.parse(val.value);
            }
            if (val.key === "status") {
              if (val.value !== "待审核") {
                //审核通过
                this.status = 1;
              } else {
                //提交审核但未通过
                this.status = 0;
                this.submitted = true;
              }
            }
            this.ruleForm = Object.assign({}, regeditUser, teaIdentityUser);
            document.getElementById("avatarImg").src = this.ruleForm.img;
            this.showImg = true;
          }
        }
      });
    }
  },
  destroyed() {
    sessionStorage.removeItem("jump2Profile");
  },
  methods: {
    handleEdit() {
      this.dialogShow = false;
      this.submitted = false;
      this.tipsSubmitted = false;
    },
    backPage() {
      //格式检验
      let reg = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/;
      if (reg.test(this.params.redirect_uri)) {
        location.href = this.params.redirect_uri;
      }
    },
    closePage() {
      window.close();
    },
    handleLogin() {
      //跳转到登录页面
      sessionStorage.setItem("jumpTeaIentity", true);
      this.$router.push({
        name: "indexLogin"
      });
      this.dialogShow = false;
    },
    onChooseImg() {
      window.validAuth.selectAvatarFile(val => {
        this.imgTips = false;
        document.getElementById("avatarImg").src = val;
        this.showImg = true;
        this.ruleForm.img = val;
      });
    },
    onSubmit() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          if (this.ruleForm.img) {
            window.validAuth.setMetadata({
              _id: this.userId,
              key: "teaIdentityForm",
              value: JSON.stringify(this.ruleForm)
            });
            window.validAuth
              .setMetadata({
                _id: this.userId,
                key: "status",
                value: "待审核"
              })
              .then(res => {
                if (res) {
                  $message.success({ message: "您已成功提交审核" });
                }
                this.backPage();
              });
            ////////这里提交表单
          } else {
            this.imgTips = true;
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
    getSecondLvDomain(hostname) {
      if (!hostname) return null;
      let hostnameSplit = hostname.split(".");
      // 只有域名部分由三部分以上组成才算拥有二级域名
      if (hostnameSplit.length >= 3) {
        return hostnameSplit[0];
      }
      return null;
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
  width: 60%;
  margin-left: 15%;
}

.userdata {
  display: block;
  float: left;
  width: 220px;
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
.bdround {
  border-radius: 5px;
  background: #fff;
  width: 900px;
  margin: 50px auto;
}
.tcherbg {
  font-size: 30px;
  line-height: 40px;
  padding-top: 50px;
  background: url(https://hep-portal.oss-cn-beijing.aliyuncs.com/css/img/teacherid.jpg);
  height: 230px;
  text-align: center;
}
#avatarImg {
  width: 300px;
  display: block;
}
.imgTips {
  color: red;
  font-size: 12px;
  margin-left: 20px;
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
</style>