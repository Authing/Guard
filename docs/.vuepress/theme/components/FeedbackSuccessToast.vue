<template>
  <div v-if="value" class="feedback-success-container" :style="styles">
    <img src="../assets/images/feedback-success.png" class="feedback-success-icon" />
    <div class="tips-box">
      <img src="../assets/images/checkbox-circle-fill.svg" class="tips-icon" />
      <span>提交成功，感谢你的反馈</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default () {
        return false
      }
    },
    styles: {
      type: String,
      default () {
        return ''
      }
    }
  },
  watch: {
    value (newVal) {
      if (newVal) {
        setTimeout(() => {
          this.hide()
        }, 1000)
      }
    }
  },
  methods: {
    hide () {
      this.$emit('hide', false)
    }
  }
}
</script>

<style lang="stylus" scoped>
.feedback-success-container
  position absolute
  z-index 10
  width 352px
  left 0
  top 0
  background #fff
  border 1px solid #E5E6EB
  box-shadow 0px 16px 32px -10px rgba(4, 24, 115, 0.1)
  border-radius 4px
  padding 24px 16px
  box-sizing border-box
  display flex
  flex-direction column
  justify-content center
  align-items center
  font-size 14px
  font-weight 600
  font-family PingFang SC
  color #1D2129
  img {
    border none
  }
  .feedback-success-icon
    margin-bottom 19px
    width 120px
    height 92px
  .tips-box
    display flex
    align-items center
    justify-content center
    .tips-icon
      margin-right 9px
</style>
