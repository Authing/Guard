<template>
  <div v-if="emailModalShow" class="modalContainer">
    <div v-if="verifyOldEmail && userInfo.email">
      <div>
        <!-- 用户池要求验证原来的邮箱且当前绑定了邮箱 -->
        <div v-if="step == 1" class="modalBox">
          <div class="modalTop">
            <span>修改邮箱 - 验证当前邮箱</span>
            <div class="profile-big_bar">
              <div class="authing-form" style="padding:0; padding-top:11px">
                <div class="_authing_input">
                  <input
                    type="text"
                    class="_authing_input _authing_form-control"
                    autocomplete="off"
                    placeholder="当前绑定的邮箱"
                    v-model="currentEmail"
                    style="pointer-events: none;"
                  />
                </div>
                <div style="display:flex">
                  <div class="_authing_input" style="width:60%">
                    <input
                      type="text"
                      class="_authing_input _authing_form-control"
                      autocomplete="off"
                      placeholder="邮箱验证码"
                      v-model="currentEmailCode"
                    />
                  </div>
                  <div
                    v-if="!currentEmailCountdown.sent"
                    class="send_verify_code_button"
                    style="width:40%"
                    @click="() => {sendVerifyCode(currentEmail)}"
                  >
                    <span>发送验证码</span>
                  </div>
                  <div
                    v-else
                    class="send_verify_code_button"
                    style="width:40%; background-color: gray"
                  >{{currentEmailCountdown.countdown}} 秒后重试</div>
                </div>
              </div>
            </div>
          </div>
          <div class="modalBottom">
            <div class="modal_button white" @click="cancel">取消</div>
            <div class="modal_button blue" @click="verifyCurrentEmail">下一步</div>
          </div>
        </div>

        <div v-if="step == 2" class="modalBox">
          <div class="modalTop">
            <span>修改邮箱 - 添加新邮箱</span>
            <div class="profile-big_bar">
              <div class="authing-form" style="padding:0; padding-top:11px">
                <div class="_authing_input">
                  <input
                    type="text"
                    class="_authing_input _authing_form-control"
                    autocomplete="off"
                    placeholder="请输入新邮箱"
                    v-model="newEmail"
                  />
                </div>
                <div style="display:flex">
                  <div class="_authing_input" style="width:60%">
                    <input
                      type="text"
                      class="_authing_input _authing_form-control"
                      autocomplete="off"
                      placeholder="邮箱验证码"
                      v-model="newEmailCode"
                    />
                  </div>
                  <div
                    v-if="!newEmailCountdown.sent"
                    class="send_verify_code_button"
                    style="width:40%"
                    @click="() => {sendVerifyCode(newEmail)}"
                  >
                    <span>发送验证码</span>
                  </div>
                  <div
                    v-else
                    class="send_verify_code_button"
                    style="width:40%; background-color: gray"
                  >{{newEmailCountdown.countdown}} 秒后重试</div>
                </div>
              </div>
            </div>
          </div>
          <div class="modalBottom">
            <div class="modal_button white" @click="cancel">取消</div>
            <div class="modal_button blue" @click="updateEmail">确认</div>
          </div>
        </div>
      </div>
    </div>

    <div v-else>
      <div v-if="step == 1" class="modalBox">
        <div class="modalTop">
          <span v-if="userInfo.email">修改邮箱</span>
          <span v-else>绑定邮箱</span>
          <div class="profile-big_bar">
            <div class="authing-form" style="padding:0; padding-top:11px">
              <div class="_authing_input">
                <input
                  type="text"
                  class="_authing_input _authing_form-control"
                  autocomplete="off"
                  placeholder="当前绑定的邮箱"
                  v-model="currentEmail"
                />
              </div>
              <div style="display:flex">
                <div class="_authing_input" style="width:60%">
                  <input
                    type="text"
                    class="_authing_input _authing_form-control"
                    autocomplete="off"
                    placeholder="邮箱验证码"
                    v-model="currentEmailCode"
                  />
                </div>
                <div
                  v-if="!currentEmailCountdown.sent"
                  class="send_verify_code_button"
                  style="width:40%"
                  @click="() => {sendVerifyCode(currentEmail)}"
                >
                  <span>发送验证码</span>
                </div>
                <div
                  v-else
                  class="send_verify_code_button"
                  style="width:40%; background-color: gray"
                >{{currentEmailCountdown.countdown}} 秒后重试</div>
              </div>
            </div>
          </div>
        </div>
        <div class="modalBottom">
          <div class="modal_button white" @click="cancel">取消</div>
          <div class="modal_button blue" @click="updateEmail">确认</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    let userInfo = JSON.parse(localStorage.getItem("_authing_userInfo"));
    const currentEmail = userInfo.email;
    return {
      userInfo,
      currentEmail,
      currentEmailCode: "",
      newEmail: "",
      newEmailCode: "",
      step: 1,
      tokenInput: "",
      storageQRCode: null,

      // 发送验证码倒计时
      currentEmailCountdown: {
        sent: false,
        countdown: 60
      },
      newEmailCountdown: {
        sent: false,
        countdown: 60
      }
    };
  },
  props: ["$authing"],
  watch: {
    tokenInput() {
      this.changeTokenValue({ token: this.tokenInput });
    },
    emailModalShow() {
      this.tokenInput = "";
    }
  },
  computed: {
    ...mapGetters("profile", ["emailModalShow", "verifyOldEmail"])
  },
  methods: {
    ...mapActions("profile", ["changeEmailModalShow"]),
    ...mapActions("data", ["showGlobalMessage"]),
    cancel() {
      this.changeEmailModalShow({ show: false });
      this.step = 1;
      this.currentEmailCode = "";
      this.newEmail = "";
      this.newEmailCode = "";
    },
    handleMFAInput() {
      this.changeEmailModalShow({ show: false });
    },
    addstep(step) {
      this.step = step;
    },

    verifyCurrentEmail() {
      if (!this.currentEmail || !this.currentEmailCode) {
        alert("请输入邮箱和验证码！");
        return;
      }
      if (!this.$root.emailExp.test(this.currentEmail)) {
        alert("邮箱格式不正确！");
        return;
      }
      this.step = 2;
    },

    async sendVerifyCode(email) {
      if (!email) {
        alert("请输入邮箱和验证码！");
        return;
      }
      if (!this.$root.emailExp.test(email)) {
        alert("邮箱格式不正确！");
        return;
      }

      try {
        const res = await this.$authing.sendChangeEmailVerifyCode({
          email
        });
        if (res.code === 200) {
          if (this.step === 1) {
            this.currentEmailCountdown.sent = true;
            const countdown = setInterval(() => {
              this.currentEmailCountdown.countdown -= 1;
              if (this.currentEmailCountdown.countdown <= 0) {
                this.currentEmailCountdown.sent = false;
                this.currentEmailCountdown.countdown = 60;
                clearInterval(countdown);
              }
            }, 1000);
          } else if (this.step === 2) {
            this.newEmailCountdown.sent = true;
            const countdown = setInterval(() => {
              this.newEmailCountdown.countdown -= 1;
              if (this.newEmailCountdown.countdown <= 0) {
                this.newEmailCountdown.sent = false;
                this.newEmailCountdown.countdown = 60;
                clearInterval(countdown);
              }
            }, 1000);
          }
        } else {
          alert("发送验证码失败！");
        }
      } catch (error) {
        alert(error.message.message);
      }
    },

    async updateEmail() {
      // 用户池开启了验证当前邮箱
      if (this.verifyOldEmail && this.userInfo.email) {
        if (
          !this.currentEmail ||
          !this.currentEmailCode ||
          !this.newEmail ||
          !this.newEmailCode
        ) {
          alert("请输入验证码！");
          return;
        }
        try {
          const res = await this.$authing.updateEmail({
            email: this.newEmail,
            emailCode: this.newEmailCode,
            oldEmail: this.currentEmail,
            oldEmailCode: this.currentEmailCode
          });
          alert("修改邮箱成功！");
          setTimeout(() => {
            location.reload();
          }, 1000);
        } catch (error) {
          alert(error.message.message);
        }
      } else {
        if (!this.currentEmail || !this.currentEmailCode) {
          alert("请输入验证码！");
          return;
        }
        try {
          const res = await this.$authing.updateEmail({
            email: this.currentEmail,
            emailCode: this.currentEmailCode
          });
          alert("修改邮箱成功！");
          setTimeout(() => {
            location.reload();
          }, 1000);
        } catch (error) {
          alert(error.message.message);
        }
      }
    }
  },
  created() {
    this.step = 1;
  }
};
</script>
<style>
.modalBox {
  width: 330px;
  height: 280px;
  border-radius: 6px;
  background: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  position: fixed;
  left: calc(50vw - 165px);
  top: calc(50vh - 140px);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 22px 22px;
}

.modalContainer {
  width: 100vw;
  height: 100vh;
  z-index: 999;
  position: fixed;
  background: rgba(0, 0, 0, 0.65);
}

.modalTop {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
}

.mfaInputBox {
  width: 100%;
  height: 60px;
  padding: 0 !important;
}

.modalBottom {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: flex-end;
}

.modal_button {
  box-sizing: border-box;
  padding: 6px 22px;
  font-size: 14px;
  margin-left: 11px;
  border-radius: 4px;
  cursor: pointer;
}

.modal_button:hover {
  opacity: 0.8;
}

.modal_button.white {
  background: #fff;
  color: #555;
}

.modal_button.blue {
  background: #00a1ea;
  color: #fff;
}

.qrImg {
  width: 136px;
  height: 136px;
  border-radius: 6px;
  margin: 0 calc(50% - 68px);
  margin-top: 18px;
}

.send_verify_code_button {
  z-index: 4;
  bottom: 0;
  left: 0;
  background: #00a1ea;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  font-size: 16px;
  color: #fff;
  letter-spacing: 0.7px;
  font-weight: 300;
  cursor: pointer;
  border-radius: 5px;
}
</style>