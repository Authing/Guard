<template>
  <div v-if="phoneModalShow" class="modalContainer">
    <div v-if="verifyOldPhone && userInfo.phone">
      <div>
        <!-- 用户池要求验证原来的手机号且当前绑定了手机号 -->
        <div v-if="step == 1" class="modalBox">
          <div class="modalTop">
            <span>1. 修改手机号 - 验证当前手机号</span>
            <div class="profile-big_bar">
              <div class="authing-form" style="padding:0; padding-top:11px">
                <div class="_authing_input">
                  <input
                    type="text"
                    class="_authing_input _authing_form-control"
                    autocomplete="off"
                    placeholder="当前绑定的手机号"
                    v-model="currentPhone"
                    style="pointer-events: none;"
                  />
                </div>
                <div style="display:flex">
                  <div class="_authing_input" style="width:60%">
                    <input
                      type="text"
                      class="_authing_input _authing_form-control"
                      autocomplete="off"
                      placeholder="手机号验证码"
                      v-model="currentPhoneCode"
                    />
                  </div>
                  <div
                    v-if="!currentPhoneCountdown.sent"
                    class="send_verify_code_button"
                    style="width:40%"
                    @click="() => {sendVerifyCode(currentPhone)}"
                  >
                    <span>发送验证码</span>
                  </div>
                  <div
                    v-else
                    class="send_verify_code_button"
                    style="width:40%; background-color: gray"
                  >{{currentPhoneCountdown.countdown}} 秒后重试</div>
                </div>
              </div>
            </div>
          </div>
          <div class="modalBottom">
            <div class="modal_button white" @click="cancel">取消</div>
            <div class="modal_button blue" @click="verifyCurrentPhone(currentPhone)">下一步</div>
          </div>
        </div>

        <div v-if="step == 2" class="modalBox">
          <div class="modalTop">
            <span>2. 修改手机号 - 添加新手机号</span>
            <div class="profile-big_bar">
              <div class="authing-form" style="padding:0; padding-top:11px">
                <div class="_authing_input">
                  <input
                    type="number"
                    class="_authing_input _authing_form-control"
                    autocomplete="off"
                    placeholder="请输入新手机号"
                    v-model="newPhone"
                  />
                </div>
                <div style="display:flex">
                  <div class="_authing_input" style="width:60%">
                    <input
                      type="text"
                      class="_authing_input _authing_form-control"
                      autocomplete="off"
                      placeholder="手机号验证码"
                      v-model="newPhoneCode"
                    />
                  </div>
                  <div
                    v-if="!newPhoneCountdown.sent"
                    class="send_verify_code_button"
                    style="width:40%"
                    @click="() => {sendVerifyCode(newPhone)}"
                  >
                    <span>发送验证码</span>
                  </div>
                  <div
                    v-else
                    class="send_verify_code_button"
                    style="width:40%; background-color: gray"
                  >{{newPhoneCountdown.countdown}} 秒后重试</div>
                </div>
              </div>
            </div>
          </div>
          <div class="modalBottom">
            <div class="modal_button white" @click="cancel">取消</div>
            <div class="modal_button blue" @click="updatePhone">确认</div>
          </div>
        </div>
      </div>
    </div>

    <div v-else>
      <div v-if="step == 1" class="modalBox">
        <div class="modalTop">
          <span v-if="userInfo.phone">修改手机号</span>
          <span v-else>添加手机号</span>
          <div class="profile-big_bar">
            <div class="authing-form" style="padding:0; padding-top:11px">
              <div class="_authing_input">
                <input
                  type="text"
                  class="_authing_input _authing_form-control"
                  autocomplete="off"
                  placeholder="当前绑定的手机号"
                  v-model="currentPhone"
                />
              </div>
              <div style="display:flex">
                <div class="_authing_input" style="width:60%">
                  <input
                    type="text"
                    class="_authing_input _authing_form-control"
                    autocomplete="off"
                    placeholder="手机号验证码"
                    v-model="currentPhoneCode"
                  />
                </div>
                <div
                  v-if="!currentPhoneCountdown.sent"
                  class="send_verify_code_button"
                  style="width:40%"
                  @click="() => {sendVerifyCode(currentPhone)}"
                >
                  <span>发送验证码</span>
                </div>
                <div
                  v-else
                  class="send_verify_code_button"
                  style="width:40%; background-color: gray"
                >{{currentPhoneCountdown.countdown}} 秒后重试</div>
              </div>
            </div>
          </div>
        </div>
        <div class="modalBottom">
          <div class="modal_button white" @click="cancel">取消</div>
          <div class="modal_button blue" @click="updatePhone">确认</div>
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
    const currentPhone = userInfo.phone;
    return {
      userInfo,
      currentPhone,
      currentPhoneCode: "",
      newPhone: "",
      newPhoneCode: "",
      step: 1,
      tokenInput: "",
      storageQRCode: null,

      // 发送验证码倒计时
      currentPhoneCountdown: {
        sent: false,
        countdown: 60
      },
      newPhoneCountdown: {
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
    phoneModalShow() {
      this.tokenInput = "";
    }
  },
  computed: {
    ...mapGetters("profile", ["phoneModalShow", "verifyOldPhone"])
  },
  methods: {
    ...mapActions("profile", ["changePhoneModalShow"]),
    ...mapActions("data", ["showGlobalMessage"]),
    cancel() {
      this.changePhoneModalShow({ show: false });
      this.step = 1;
      this.currentPhoneCode = "";
      this.newPhone = "";
      this.newPhoneCode = "";
    },
    handleMFAInput() {
      this.changePhoneModalShow({ show: false });
    },
    addstep(step) {
      this.step = step;
    },

    verifyCurrentPhone(phone) {
      if (!this.currentPhone || !this.currentPhoneCode) {
        alert("请输入手机号和验证码！");
        return;
      }
      if (!/^1[3456789]\d{9}$/.test(phone)) {
        alert("手机号格式不正确！");
        return;
      }
      this.step = 2;
    },

    async sendVerifyCode(phone) {
      console.log(phone);
      if (!phone) {
        alert("请输入手机号！");
        return;
      }
      if (!/^1[3456789]\d{9}$/.test(phone)) {
        alert("手机号格式不正确！");
        return;
      }

      try {
        const res = await this.$authing.getVerificationCode(phone);
        if (res.code === 200) {
          if (this.step === 1) {
            this.currentPhoneCountdown.sent = true;
            const countdown = setInterval(() => {
              this.currentPhoneCountdown.countdown -= 1;
              if (this.currentPhoneCountdown.countdown <= 0) {
                this.currentPhoneCountdown.sent = false;
                this.currentPhoneCountdown.countdown = 60;
                clearInterval(countdown);
              }
            }, 1000);
          } else if (this.step === 2) {
            this.newPhoneCountdown.sent = true;
            const countdown = setInterval(() => {
              this.newPhoneCountdown.countdown -= 1;
              if (this.newPhoneCountdown.countdown <= 0) {
                this.newPhoneCountdown.sent = false;
                this.newPhoneCountdown.countdown = 60;
                clearInterval(countdown);
              }
            }, 1000);
          }
        } else {
          alert("发送验证码失败！");
        }
      } catch (error) {
        alert(JSON.parse(error.message).message);
      }
    },

    async updatePhone() {
      // 用户池开启了验证当前手机号
      if (this.verifyOldPhone && this.userInfo.phone) {
        if (
          !this.currentPhone ||
          !this.currentPhoneCode ||
          !this.newPhone ||
          !this.newPhoneCode
        ) {
          alert("请输入验证码！");
          return;
        }
        try {
          const res = await this.$authing.updatePhone({
            phone: this.newPhone,
            phoneCode: this.newPhoneCode,
            oldPhone: this.currentPhone,
            oldPhoneCode: this.currentPhoneCode
          });
          alert("修改手机号成功！");
          setTimeout(() => {
            location.reload();
          }, 1000);
        } catch (error) {
          console.log(error);
          alert(error.message.message);
        }
      } else {
        if (!this.currentPhone || !this.currentPhoneCode) {
          alert("请输入验证码！");
          return;
        }
        try {
          const res = await this.$authing.updatePhone({
            phone: this.currentPhone,
            phoneCode: this.currentPhoneCode
          });
          alert("修改手机号成功！");
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
  /* border-radius: 5px; */
}
</style>