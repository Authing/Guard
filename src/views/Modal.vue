<template>
  <div v-if="modalShow" class="modalContainer">
    <div v-if="step == 1" class="modalBox">
      <div class="modalTop">
        <span>1/3 请打开微信扫一扫</span>
        <img class="qrImg" src="https://usercontents.authing.cn/mini-login.jpg" />
      </div>

      <div class="modalBottom">
        <!-- <div class="modal_button white" @click="cancelInput">上一步</div> -->
        <div class="modal_button white" @click="cancelInput">取消</div>
        <div class="modal_button blue" @click="addstep(2)">下一步</div>
      </div>
    </div>

    <div v-if="step == 2" class="modalBox">
      <div class="modalTop">
        <span>2/3 请在小程序中扫码添加动态令牌</span>
        <!-- <div class="mfaInputBox authing-form">
          <input
            id="tokenInput"
            v-model="tokenInput"
            v-focus
            type="text"
            class="_authing_input _authing_form-control"
            style="text-align: center"
            :maxlength="6"
          />
        </div>-->
        <img v-if="qrcode || storageQRCode" class="qrImg" :src="qrcode" />
      </div>

      <div class="modalBottom">
        <div class="modal_button white" @click="addstep(1)">上一步</div>
        <div class="modal_button blue" @click="addstep(3)">下一步</div>
      </div>
    </div>

    <div v-if="step == 3" class="modalBox">
      <div class="modalTop">
        <span>请输入动态口令</span>
        <div class="mfaInputBox authing-form">
          <input
            id="tokenInput"
            v-model="tokenInput"
            v-focus
            type="text"
            class="_authing_input _authing_form-control"
            style="text-align: center"
            :maxlength="6"
          />
        </div>
      </div>

      <div class="modalBottom">
        <div class="modal_button white" @click="addstep(2)">上一步</div>
        <div class="modal_button blue" @click="handleMFAInput">确定</div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      step: 1,
      tokenInput: "",
      storageQRCode: null
    };
  },
  watch: {
    tokenInput() {
      this.changeTokenValue({ token: this.tokenInput });
    },
    modalShow() {
      this.tokenInput = "";
    },
  },
  computed: {
    ...mapGetters("profile", ["modalShow", "tokenValue", "qrcode"])
  },
  methods: {
    ...mapActions("profile", ["changeModalShow", "changeTokenValue"]),
    cancelInput() {
      this.changeTokenValue({ token: null });
      this.changeModalShow({ show: false });
    },
    handleMFAInput() {
      this.changeModalShow({ show: false });
    },
    addstep(step) {
      this.step = step;
    }
  },
  created() {
    this.tokenInput = "";
    this.step = 1;
    let qr = localStorage.getItem('qrcode')
    if(qr) {
        this.storageQRCode = qr
    }
    // setTimeout(() => {
    //   document.getElementById("tokenInput").focus();
    // }, 1000);
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
</style>