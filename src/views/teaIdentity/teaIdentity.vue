<template>
  <div class="con">
    <div class="bdround bgwhite regbox" style="border:5px solid #c0ecf4;">
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

            <el-form-item label="所在省份" prop="province">
              <el-select style="width:220px;" v-model="ruleForm.province" placeholder="请选择省份">
                <el-option
                  v-for="province in provinceList"
                  :key="province.id"
                  :label="province.description"
                  :value="province.description"
                ></el-option>
              </el-select>
              <span class="f_12 black3 padl15">请填写所在省份，认证后可以修改</span>
            </el-form-item>

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
                  :value="school.nodeid"
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
  </div>
</template>
<script>
import GraphQLClient from "../../graphql.js";
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
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
      status: 0,
      provinceList: [],
      schoolList: [],
      majorOptions: [],
      $authing: null,
      opts: {},
      redirectToProfile: false,
      appLogo: "",
      appName: "",
      defaultLogo: "https://usercontents.authing.cn/client/logo@2.png",
      clientInfo: {},
      userToken: "",
      authingOnError: false,

      closeForm: false,
      removeDom: false,

      hasLDAP: false,
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
        ]
      },
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
  },
  async mounted() {
    fetch("https://node2d-public.hep.com.cn/zy.json").then(res => {
      res.json().then(resp => {
        this.majorOptions = resp;
      });
    });
    fetch("https://node2d-public.hep.com.cn/province.json").then(res => {
      res.json().then(resp => {
        this.provinceList = resp.province;
      });
    });
    fetch("https://node2d-public.hep.com.cn/school.json").then(res => {
      res.json().then(resp => {
        this.schoolList = resp;
      });
    });
    if (this.opts.isSSO) {
      if (this.$route.query.profile) {
        this.redirectToProfile = true;
      }
      // 上来先查一下 appInfo
      const appInfo = await this.queryAppInfo();
      if (!appInfo) {
        this.$router.replace({
          name: "error",
          query: {
            message: [
              "应用不存在",
              "请确认传递了正确的 protocol query 参数，不传默认该地址为 OAuth 应用",
              "protocol 参数可选值为 oauth、oidc、saml"
            ]
          }
        });
        return;
      }
      // 如果启用了自定义 css
      if (appInfo.css) {
        let styleNode = document.createElement("style");
        styleNode.type = "text/css";
        let content = document.createTextNode(appInfo.css);
        styleNode.appendChild(content);
        document.head.appendChild(styleNode);
      }

      // 如果启用了自定义配置
      if (appInfo.customStyles) {
        // 在这里根据自定义配置修改相应界面
        this.opts = this.$root.$data.$authing.opts = {
          ...this.$root.$data.$authing.opts,
          ...appInfo.customStyles
        };
      }

      switch (this.protocol) {
        case "oidc":
          if (!this.params.uuid) {
            // 如果用户直接输入网址，什么参数也不带
            // 把 ssoHost 域名第一部分替换成 oidc 应用的 domain 再作为地址
            let ssoHostArr = this.opts.SSOHost.split(".");
            let head = ssoHostArr.shift();
            let isHttps = false;
            if (~head.indexOf("https")) {
              isHttps = true;
            }
            ssoHostArr.unshift(appInfo.domain);
            let ssoHost = ssoHostArr.join(".");
            // 这么写是为了动态生成这个链接，否则私有部署会出问题
            location.href = `${
              isHttps ? "https://" : "http://"
            }${ssoHost}/oauth/oidc/auth?client_id=${
              appInfo.client_id
            }&redirect_uri=${encodeURIComponent(
              appInfo.redirect_uris[0]
            )}&scope=openid profile email phone offline_access&response_type=code&state=${Math.random()
              .toString(26)
              .slice(2)}`;
            return;
          }
          break;
        case "saml":
          if (!this.params.SAMLRequest) {
            this.$router.replace({
              name: "error",
              query: {
                message: [
                  "缺少 SAML 所必须的参数 SAMLRequest",
                  "SAML 应用不能直接输入网址进行登录，需要带参数访问后端 URL，详情请看文档"
                ],
                doc:
                  "https://docs.authing.cn/authing/advanced/use-saml/configure-authing-as-sp-and-idp#kai-shi-shi-yong"
              }
            });
            return;
          }
      }

      this.saveAppInfo({ appInfo });
      this.opts.appId = appInfo._id;
      // 判断是否已经登录过了，已经登录就直接跳转确权页面，不再发送后面那些 http 请求
      if (await this.isLogged()) {
        this.$router.push({
          name: "authorize",
          query: { ...this.$route.query }
        });
        this.saveLoginStatus({ isLogged: true });
        return;
      }
    }
    try {
      // 获取应用的名称，图标等信息
      this.appName = this.opts.title || this.appInfo.name || "Guard";
      window.title = `${this.appName} - Authing`;
      document.title = `${this.appName} - Authing`;
      this.appLogo = this.opts.logo || this.appInfo.image || this.defaultLogo;
      this.clientId = this.appInfo.clientId;
    } catch (erro) {
      console.log(erro);
      that.authingOnError = true;
      that.$authing.pub("authing-unload", erro);
      this.$router.replace({
        name: "error",
        query: { message: ["设置 Guard 界面信息出错"] }
      });
      return;
    }
    var that = this;
    this.checkHasLDAP(that.clientId);
    this.userToken = localStorage.getItem("_authing_token") || null;
    let auth = new Authing({
      userPoolId: that.clientId || that.opts.clientId,
      useSelfWxapp: that.opts.useSelfWxapp,
      host: that.opts.host,
      accessToken: that.userToken,
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
    if (that.opts.hideSocial && that.opts.hideUP) {
      that.gotoWxQRCodeScanning();
    }
    try {
      if (this.opts.hideSocial === false) {
        // 不隐藏社会化登录时，才加载社会化登录列表
        this.changeLoading({ el: "socialButtonsList", loading: true });
        let data = await auth.readOAuthList({ useGuard: true });
        this.changeLoading({ el: "socialButtonsList", loading: false });

        // 刨去 微信扫码登录 的方式
        // 如果是 native 端，只保留移动应用
        let socialButtonsList = data.filter(item => {
          if (item.alias === "wxapp") {
            this.isScanCodeEnable = true;
          }

          if (!that.opts.isNative) {
            return (
              item.enabled === true &&
              !["wxapp", "wechatapp", "wechatmp"].includes(item.alias)
            );
          } else {
            return (
              item.enabled === true &&
              (item.alias === "wechatios" ||
                item.alias === "alipaymobile" ||
                item.alias === "wechatandroid")
            );
          }
        });

        socialButtonsList = socialButtonsList.map(item => {
          if (
            item.alias === "alipaymobile" ||
            item.alias === "wechatios" ||
            item.alias === "wechatandroid"
          ) {
            item.isNative = true;
          }
          return item;
        });

        this.$authing.pub("social-load", socialButtonsList);

        this.saveSocialButtonsList({ socialButtonsList });

        // if (!this.opts.hideSocial) {
        //   return;
        // }

        if (socialButtonsList.length === 0 && this.opts.hideUP) {
          // 如果没开启社会化登录，同时指定隐藏用户密码登录，就自动转到小程序扫码登录
          this.opts.hideSocial = true;
          this.gotoWxQRCodeScanning();
        }
      }
    } catch (err) {
      this.$authing.pub("social-unload", err);
      this.changeLoading({ el: "form", loading: false });
    }
  },
  destroyed() {
    sessionStorage.removeItem("jump2Profile");
  },
  methods: {
    onChooseImg() {
      let that = this;
      window.validAuth.selectAvatarFile(val => {
        this.imgTips = false;
        this.ruleForm.img = val;
        let rd = new FileReader();
        rd.readAsDataURL(val);
        rd.onloadend = function(e) {
          // console.log(e);
          document.getElementById("avatarImg").src = e.target.result;
          that.showImg = true;
        };
      });
    },
    onSubmit() {
      console.log(this.ruleForm);
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          if (this.ruleForm.img) {
            window.validAuth
              .setMetadata({
                _id: this.userId,
                key: "currentUser",
                value: JSON.stringify(this.ruleForm)
              })
              .then(
                res => {
                  console.log("res");
                  console.log(res);
                },
                err => {
                  console.log("err");
                  console.log(err);
                }
              );
            window.validAuth
              .setMetadata({
                _id: this.userId,
                key: "status",
                value: "待审核"
              })
              .then(
                res => {
                  console.log("res");
                  console.log(res);
                },
                err => {
                  console.log("err");
                  console.log(err);
                }
              );
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
    handleAvatarSuccess(res, file) {
      console.log(res);
      console.log(file);
      this.imageUrl = URL.createObjectURL(file.raw);
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
    async queryAppInfo(protocol) {
      protocol = protocol || this.protocol;
      let hostname = location.hostname;
      let domain =
        this.getSecondLvDomain(this.opts.domain) ||
        this.getSecondLvDomain(hostname);
      let appId =
        this.opts.appId ||
        this.$route.query.app_id ||
        this.$route.query.client_id;
      let operationName;
      let GraphQLClient_getAppInfo = new GraphQLClient({
        baseURL: this.opts.host.oauth
      });

      // 优先通过二级域名查找此应用信息
      if (domain && domain !== "sso") {
        // 如果没有提供 protocol 参数，就挨个查一遍吧
        if (!protocol) {
          let queries = [
            `query {
              QueryAppInfoByDomain(domain: "${domain}") {
                _id
                name
                image
                domain
                clientId
                css
              }
            }`,
            `query {
              QueryOIDCAppInfoByDomain(domain: "${domain}") {
                _id,
                name
                image
                client_id
                redirect_uris
                domain
                css
                customStyles {
                  forceLogin
                  hideQRCode
                  hideUP
                  hideUsername
                  hideRegister
                  hidePhone
                  hideSocial
                  hideClose
                  placeholder {
                    username
                    email
                    password
                    confirmPassword
                    verfiyCode
                    newPassword
                    phone
                    phoneCode
                  }
                  qrcodeScanning {
                    interval
                    tips
                  }
                }
              }
            }`,
            `query {
              QuerySAMLIdentityProviderInfoByDomain(domain: "${domain}") {
                _id,
                name,
                image,
                domain
                clientId
                css
              }
            }`
          ];
          let appInfos = await Promise.all(
            queries.map(q => GraphQLClient_getAppInfo.request({ query: q }))
          );
          let [
            { QueryAppInfoByDomain },
            { QueryOIDCAppInfoByDomain },
            { QuerySAMLIdentityProviderInfoByDomain }
          ] = appInfos;
          this.saveProtocol({
            protocol: QuerySAMLIdentityProviderInfoByDomain
              ? "saml"
              : QueryOIDCAppInfoByDomain
              ? "oidc"
              : QueryAppInfoByDomain
              ? "oauth"
              : "",
            params: {
              ...this.$route.query
            },
            isSSO: this.opts.isSSO
          });
          return (
            QuerySAMLIdentityProviderInfoByDomain ||
            QueryOIDCAppInfoByDomain ||
            QueryAppInfoByDomain
          );
        }
        // 根据不同的 protocol 查找不同类型的 app
        switch (protocol) {
          case "oidc":
            operationName = "QueryOIDCAppInfoByDomain";
            break;
          case "oauth":
            operationName = "QueryAppInfoByDomain";
            break;
          case "saml":
            operationName = "QuerySAMLIdentityProviderInfoByDomain";
            break;
          default:
            this.$router.replace({
              name: "error",
              query: {
                message: [
                  "protocol query 参数错误",
                  "protocol 可选值为 oauth，oidc，saml"
                ],
                code: "4004"
              }
            });
            return;
        }

        let query;
        if (operationName !== "QueryOIDCAppInfoByDomain") {
          query = `query {
            ${operationName} (domain: "${domain}") {   
              _id
              name
              domain
              image
              clientId
              css
            }
          }`;
        } else {
          query = `query {
            ${operationName} (domain: "${domain}") {   
              _id
              name
              domain
              image
              clientId
              css
              customStyles {
                forceLogin
                hideQRCode
                hideUP
                hideUsername
                hideRegister
                hidePhone
                hideSocial
                hideClose
                placeholder {
                  username
                  email
                  password
                  confirmPassword
                  verfiyCode
                  newPassword
                  phone
                  phoneCode
                }
                qrcodeScanning {
                  interval
                  tips
                }
              }
            }
          }`;
        }

        try {
          let appInfo = await GraphQLClient_getAppInfo.request({ query });
          // console.log("queryAppInfo");
          // console.log(appInfo);
          // 返回对应的 app 信息
          switch (protocol) {
            case "oidc":
              return appInfo["QueryOIDCAppInfoByDomain"];
            case "oauth":
              return appInfo["QueryAppInfoByDomain"];
            case "saml":
              return appInfo["QuerySAMLIdentityProviderInfoByDomain"];
          }
        } catch (err) {
          console.log(err);
          this.$router.replace({
            name: "error",
            query: {
              message: ["获取 App 信息失败"],
              code: "id404"
            }
          });
        }
      } else if (appId) {
        // 如果没有二级域名，就通过 appId 查找
        try {
          // 如果没有提供 protocol 参数，就挨个查一遍吧
          if (!protocol) {
            let queries = [
              `query {
                QueryAppInfoByAppID(appId: "${appId}") {
                  _id
                  domain
                  name
                  image
                  clientId
                  css
                }
              }`,
              `query {
                QueryOIDCAppInfoByAppID(appId: "${appId}") {
                  _id
                  name
                  image
                  client_id
                  redirect_uris
                  domain
                  css
                  customStyles {
                    forceLogin
                    hideQRCode
                    hideUP
                    hideUsername
                    hideRegister
                    hidePhone
                    hideSocial
                    hideClose
                    placeholder {
                      username
                      email
                      password
                      confirmPassword
                      verfiyCode
                      newPassword
                      phone
                      phoneCode
                    }
                    qrcodeScanning {
                      interval
                      tips
                    }
                  }
                }
              }`,
              `query {
                  QuerySAMLIdentityProviderInfoByAppID(appId: "${appId}") {
                    _id
                    domain
                    name
                    image
                    clientId
                    css
                }
              }`
            ];
            let appInfos = await Promise.all(
              queries.map(q => GraphQLClient_getAppInfo.request({ query: q }))
            );
            let [
              { QueryAppInfoByAppID },
              { QueryOIDCAppInfoByAppID },
              { QuerySAMLIdentityProviderInfoByAppID }
            ] = appInfos;
            this.saveProtocol({
              protocol: QuerySAMLIdentityProviderInfoByAppID
                ? "saml"
                : QueryOIDCAppInfoByAppID
                ? "oidc"
                : QueryAppInfoByAppID
                ? "oauth"
                : "",
              params: {
                ...this.$route.query
              },
              isSSO: this.opts.isSSO
            });
            return (
              QuerySAMLIdentityProviderInfoByAppID ||
              QueryOIDCAppInfoByAppID ||
              QueryAppInfoByAppID
            );
          }

          switch (protocol) {
            case "oidc":
              operationName = "QueryOIDCAppInfoByAppID";
              break;
            case "oauth":
              operationName = "QueryAppInfoByAppID";
              break;
            case "saml":
              operationName = "QuerySAMLIdentityProviderInfoByAppID";
              break;
            default:
              this.$router.replace({
                name: "error",
                query: {
                  message: [
                    "protocol query 参数错误",
                    "protocol 可选值为 oauth，oidc，saml"
                  ],
                  code: "id404"
                }
              });
              return;
          }

          let query;
          if (operationName !== "QueryOIDCAppInfoByAppID") {
            query = `query {
              ${operationName} (appId: "${appId}") {
                _id,
                name,
                image,
                clientId
                css
              }
            }`;
          } else {
            query = `query {
              ${operationName} (appId: "${appId}") {
                _id,
                name,
                image,
                clientId
                css
                customStyles {
                  forceLogin
                  hideQRCode
                  hideUP
                  hideUsername
                  hideRegister
                  hidePhone
                  hideSocial
                  hideClose
                  placeholder {
                    username
                    email
                    password
                    confirmPassword
                    verfiyCode
                    newPassword
                    phone
                    phoneCode
                  }
                  qrcodeScanning {
                    interval
                    tips
                  }
                }
              }
            }`;
          }
          let appInfo = await GraphQLClient_getAppInfo.request({ query });
          switch (protocol) {
            case "oidc":
              return appInfo["QueryOIDCAppInfoByAppID"];
            case "oauth":
              return appInfo["QueryAppInfoByAppID"];
            case "saml":
              return appInfo["QuerySAMLIdentityProviderInfoByAppID"];
          }
        } catch (err) {
          console.log(err);
          this.$router.replace({
            name: "error",
            query: {
              message: ["获取 App 信息出错"],
              code: "id404"
            }
          });
        }
      } else {
        // 使用 sso.authing.cn 又没有提供 appId clientId 的情况
        this.$router.replace({
          name: "error",
          query: { message: ["缺少 app_id 或 client_id"], code: "id404" }
        });
      }
    },
    async checkHasLDAP(clientId) {
      let operationName = "QueryClientHasLDAPConfigs";
      let query = `query {
              ${operationName} (clientId: "${clientId}") {   
                result,
              }
            }
        `;

      let GraphQLClient_getInfo = new GraphQLClient({
        baseURL: this.opts.host.oauth
      });

      try {
        const hasLDAP = await GraphQLClient_getInfo.request({ query });
        this.hasLDAP = hasLDAP.QueryClientHasLDAPConfigs.result;
      } catch (erro) {
        console.log(erro);
      }
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
    },
    async isLogged() {
      let appToken = localStorage.getItem("appToken");
      console.log(
        JSON.parse(appToken)["5e664d9374ca0dcac98c5765"].userInfo._id
      );
      this.userId = JSON.parse(appToken)[
        "5e664d9374ca0dcac98c5765"
      ].userInfo._id;
      //
      // if (appToken) {
      //   try {
      //     appToken = JSON.parse(appToken);
      //     let accessToken = appToken[this.opts.appId].accessToken;
      //     let payload = accessToken.split(".")[1];
      //     let decoded = window.atob(payload);
      //     decoded = JSON.parse(decoded);
      //     let expired = parseInt(Date.now() / 1000) > decoded.exp;
      //     if (expired) {
      //       delete appToken[this.opts.appId];
      //       localStorage.removeItem("_authing_token");
      //       localStorage.setItem("appToken", appToken);
      //     }
      //   } catch (error) {
      //     // console.log(error);
      //     appToken = {};
      //     localStorage.removeItem("appToken");
      //   }
      // } else {
      //   appToken = {};
      // }
      //是不是 sso.authing.cn 这种总的域名
      // let isSSOAuthing = location.hostname.match(/^sso\./);
      // // baseDomain = authing.cn 这种后面的部分的域名
      // let auth = new SSO({
      //   appId: this.appInfo._id,
      //   appType: this.protocol,
      //   appDomain: isSSOAuthing
      //     ? "sso." + this.opts.baseDomain
      //     : this.appInfo.domain + "." + this.opts.baseDomain,
      //   host: {
      //     oauth: this.opts.host.oauth,
      //     user: this.opts.host.user
      //   }
      //   // dev: window.isDev
      // });
      // let sess = await auth.trackSession();
      // // let sess = { session: null };
      // if (!sess.session) {
      //   localStorage.removeItem("_authing_token");
      //   localStorage.removeItem("_authing_userInfo");
      //   localStorage.removeItem("_authing_clientInfo");
      //   try {
      //     let appToken = localStorage.getItem("appToken");
      //     let obj = JSON.parse(appToken);
      //     delete obj[this.opts.appId];
      //     localStorage.setItem("appToken", JSON.stringify(obj));
      //   } catch (err) {
      //     // 什么也不做，吞掉 error
      //   }
      //   return false;
      // }
      return appToken[this.opts.appId] && appToken[this.opts.appId].accessToken;
    }
  },
  computed: {
    headerTabCount() {
      let arr = ["scan-wx-mp", "login", "register"];
      if (
        !this.isScanCodeEnable ||
        this.opts.hideQRCode ||
        (this.clientInfo.registerDisabled && !this.clientInfo.showWXMPQRCode)
      ) {
        let idx = arr.findIndex(v => v === "scan-wx-mp");
        if (~idx) {
          arr.splice(idx, 1);
        }
      }

      if (this.opts.hideSocial && this.opts.hideUP) {
        let idx = arr.findIndex(v => v === "login");
        if (~idx) {
          arr.splice(idx, 1);
        }
      }
      if (
        this.opts.hideUP ||
        this.opts.forceLogin ||
        this.clientInfo.registerDisabled ||
        this.opts.hideRegister
      ) {
        let idx = arr.findIndex(v => v === "register");
        if (~idx) {
          arr.splice(idx, 1);
        }
      }
      return arr.length;
    },
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
  margin-left: 18%;
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
</style>