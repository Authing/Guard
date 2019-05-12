<template>
  <div>
    <NewPassword v-if="newPasswordVisible"/>
    <SendEmail v-if="sendEmailVisible"/>
    <VerifyCode v-if="verifyCodeVisible"/>
  </div>
</template>
<script>
import NewPassword from './NewPassword'
import SendEmail from './SendEmail'
import VerifyCode from './VerifyCode'
import {mapGetters} from 'vuex'
export default {
  components: {
    NewPassword,
    SendEmail,
    VerifyCode
  },
  computed: {
    ...mapGetters({
      newPasswordVisible: 'visibility/forgetPasswordNewPassword',
      sendEmailVisible: 'visibility/forgetPasswordSendEmail',
      verifyCodeVisible: 'visibility/forgetPasswordVerifyCode',
    })
  }
};
</script>
<style scoped>
</style>
