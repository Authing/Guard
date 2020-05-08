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
            <el-form-item label="学校" required style="margin-bottom:9px">
              <span
                class="schoolSpan"
                @click="alertChooseProvince"
              >{{schoolTextShow?province1+"-"+school1:"点击选择学校"}}</span>
              <span class="f_12 black3 padl15">请填写所在学校，认证后可以修改</span>
              <span class="schoolTips" v-show="showSchoolTips">学校不能为空</span>
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
    <div v-show="submitted">
      <!-- 如果通过审核了，提示请耐心等待，并跳回其他页面或等待用户关闭 -->
      <el-dialog title="审核提示" width="30%" :visible="tipsSubmitted">
        <span>{{tips[userStatus]}}</span>
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
        province: "",
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
      province1: "",
      school1: "",
      status: 0, // 是否审核通过，用来控制是否可修改用户信息
      submitted: false,
      tipsSubmitted: false,
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
        tel: [{ validator: phoneVal, trigger: "blur" }]
      },
      showReturn: false,
      userId: "",
      imgTips: "",
      testJson: [],
      schoolTextShow: false,
      provinceChooseShow: false,
      schoolChooseShow: false,
      currentProvince: { text: "北京" },
      showSchoolTips: false,
      userStatus: "firstAudit", //firstAudit还未提交过
      // certifing审核中 certified 已通过 reject已拒绝
      tips: {
        certifing: "您的审核申请已提交，请耐心等待，如有修改，请点击修改。",
        certified: "您的审核申请已通过，点击修改可修改部分信息。",
        reject: "您的审核申请已被拒绝，请修改信息后重新提交。"
      }
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
    fetch("https://node2d-public.hep.com.cn/school2.json").then(res => {
      res.json().then(resp => {
        this.testJson = resp;
        //此处获取 大学列表赋值给testJson,对testJson进行处理
        this.handleSchool();
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
      const permissionLost = await auth.userGroupList(this.userId);
      //permissionLost.totalCount = 0就是没有提交过审核
      if (permissionLost.totalCount === 0) {
        this.userStatus = "firstAudit";
        this.status = 0;
        this.submitted = false;
        this.tipsSubmitted = false;
      } else {
        for (let val of permissionLost.rawList) {
          if (val === "group_teacher_certifing") {
            //如果是待审核
            //提示已提交，正审核，可修改
            this.userStatus = "certifing";
            this.status = 0;
            this.submitted = true;
            this.tipsSubmitted = true;
          }
          if (val === "group_teacher_certified") {
            //如果是已通过
            // 不应该跳过来，可以不处理
            this.userStatus = "certified";
            this.status = 1;
            this.submitted = true;
            this.tipsSubmitted = true;
          }
          if (val === "group_teacher_certified_reject") {
            //如果是在reject组里
            // 提示 您的已拒绝，请点击修改后重新提交
            this.userStatus = "reject";
            this.status = 0;
            this.submitted = true;
            this.tipsSubmitted = true;
          }
        }
      }
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
            this.ruleForm = Object.assign({}, regeditUser, teaIdentityUser);
            document.getElementById("avatarImg").src = this.ruleForm.img;
            this.showImg = true;
            if (this.ruleForm.school) {
              this.province1 = this.ruleForm.province;
              this.school1 = this.ruleForm.school;
              this.schoolTextShow = true;
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
      this.ruleForm.province = this.currentProvince.text;
      this.schoolChooseShow = false;
      this.ruleForm.school = val.text;
    },
    alertChooseProvince() {
      this.provinceChooseShow = true;
    },
    handleSchool() {
      for (let val of this.testJson) {
        this.provinceList.push(val);
      }
    },
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
            if (this.ruleForm.school) {
              this.handleSubmit();
            } else {
              this.showSchoolTips = true;
              return false;
            }
          } else {
            console.log("error submit!!");
            return false;
          }
        } else {
          this.imgTips = true;
          return false;
        }
      });
    },
    closeChoose() {
      this.schoolChooseShow = false;
      if (this.ruleForm.school) {
        this.schoolTextShow = true;
      } else {
        this.schoolTextShow = false;
      }
    },
    handleSubmit() {
      // firstAudit还未提交过
      // certifing审核中 certified 已通过 reject已拒绝
      switch (this.userStatus) {
        case "firstAudit":
          //首次提交，放到用户角色certifing里
          fetch("https://2d.hep.com.cn/teacher-backend/updateUserRole", {
            method: "POST",
            body: JSON.stringify({
              userId: this.userId,
              role: "teacher_certifing_newHep"
            }),
            headers: {
              "Content-Type": "application/json",
              authorization: "Bearer " + this.userToken
            }
          })
            .then(res => res.json())
            .then(resp => {
              if (resp.success) {
                this.updateMetaData();
              }
            });
          break;
        case "certifing":
          this.updateMetaData();
          //正在审核，角色不变，更新metadata里面数据
          break;
        case "certified":
          this.updateMetaData();
          //审核通过了，角色不变，更新metadata数据
          break;
        case "reject":
          //拒绝了，放到certifing角色里，从reject组里拿出来
          fetch("https://2d.hep.com.cn/teacher-backend/updateUserRole", {
            method: "POST",
            body: JSON.stringify({
              userId: this.userId,
              role: "teacher_certifing_newHep"
            }),
            headers: {
              "Content-Type": "application/json",
              authorization: "Bearer " + this.userToken
            }
          })
            .then(res => res.json())
            .then(resp => {
              if (resp.success) {
                fetch("https://2d.hep.com.cn/teacher-backend/removeUserGroup", {
                  method: "POST",
                  body: JSON.stringify({
                    userId: this.userId,
                    group: "group_teacher_certified_reject"
                  }),
                  headers: {
                    "Content-Type": "application/json",
                    authorization: "Bearer " + this.userToken
                  }
                })
                  .then(res => res.json())
                  .then(resp => {
                    if (resp.r.code === 200) {
                      this.updateMetaData();
                    }
                  });
              }
            });
          break;
        default:
          break;
      }
    },
    updateMetaData() {
      window.validAuth
        .setMetadata({
          _id: this.userId,
          key: "teaIdentityForm",
          value: JSON.stringify(this.ruleForm)
        })
        .then(res => {
          if (res) {
            $message.success({ message: "您已成功提交审核信息" });
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
  top: 558px;
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
  top: 526px;
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