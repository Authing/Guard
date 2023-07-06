<template>
  <div class="feedback-small" ref="feedbackSmall">
    <v-popover placement="bottom-end">
      <button
        @click="handleFeedback(STATUS.GOOD)"
        :class="[
          'feedback-btn',
          'good',
          {
            active: status === STATUS.GOOD
          }
        ]"
      >
        <!-- <IconFont v-if="status === STATUS.GOOD" type="authing-good-" /> -->
        <IconFont
          :type="status === STATUS.GOOD ? 'authing-good-' : 'authing-good'"
        />
      </button>
    </v-popover>

    <v-popover placement="bottom-end">
      <button
        @click="handleFeedback(STATUS.BAD)"
        :class="[
          'feedback-btn',
          'bad',
          {
            active: status === STATUS.BAD
          }
        ]"
      >
        <!-- <IconFont v-if="status === STATUS.BAD" type="authing-good-" /> -->
        <IconFont
          :type="status === STATUS.BAD ? 'authing-good-' : 'authing-good'"
        />
      </button>
    </v-popover>

    <FeedbackToast
      :type="feedbackType"
      v-model="isShowFeedbackFormToast"
      @success="submitFeedback"
      :styles="feedbackToastStyles">
    </FeedbackToast>

    <FeedbackSuccess
      v-model="isShowFeedbackSuccessToast"
      @hide="hideFeedbackSuccessToast"
      :styles="feedbackToastStyles">
    </FeedbackSuccess>
  </div>
</template>

<script>
import IconFont from "@theme/components/IconFont/index.vue";
import { feishuFeedback } from "@theme/util/feishu";
import CheckboxGroup from "@theme/components/CheckboxGroup.vue";
import FeedbackToast from './FeedbackFormToast.vue'
import FeedbackSuccess from './FeedbackSuccessToast.vue'

const STATUS = {
  NONE: 0,
  GOOD: 1,
  BAD: 2
};
export default {
  components: {
    IconFont,
    CheckboxGroup,
    FeedbackToast,
    FeedbackSuccess
  },
  data() {
    return {
      status: STATUS.NONE,
      badReasons: [],
      customReason: "",
      submitted: false,
      submitDialogVisible: false,
      isShowFeedbackFormToast: false,
      isShowFeedbackSuccessToast: false,
      feedbackType: 'good'
    };
  },
  computed: {
    STATUS() {
      return STATUS;
    },
    feedbackConfig() {
      return this.$themeLocaleConfig.feedback;
    },
    feedbackToastStyles () {
      const clientWidth = document.documentElement.clientWidth
      return clientWidth >= 1060
        ? 'top: 20px; left: 5px'
        : 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%)'
    }
  },
  watch: {
    $route: {
      handler () {
        this.status = 0
      },
      immediate: true,
      deep: true
    }
  },
  mounted () {
    this.registToastStatusEvent()
  },
  methods: {
    submitFeedback(params) {
      feishuFeedback(params).then(() => {
        this.isShowFeedbackSuccessToast = true
      });
      this.isShowFeedbackFormToast = false;
    },
    handleFeedback(status) {
      this.status = status
      this.feedbackType = status === 1 ? 'good' : 'bad'
      this.isShowFeedbackFormToast = true
    },
    hideFeedbackSuccessToast () {
      this.isShowFeedbackSuccessToast = false
    },
    registToastStatusEvent () {
      document.addEventListener('click', e => {
        this.isShowFeedbackFormToast = false
        this.isShowFeedbackSuccessToast = false
      })
      this.$refs.feedbackSmall.addEventListener('click', e => {
        e.stopPropagation()
      })
    }
  }
};
</script>

<style lang="stylus" scoped>
.feedback-small
  position relative
  display: inline-flex
  margin-left: 16px
  .feedback-btn
    display inline
    cursor pointer
    font-size 14px
    color #4E5969
    font-weight: 800
    border: 0
    background: transparent
    .icon
      width: 14px
      height: 14px
    &.active
      color $accentColor
    &.bad
      .icon
        transform rotate(180deg)
    &:focus
      outline none
    // &:first-of-type
    //   margin-left 15px
    // &:not(:first-of-type)
    //   // border-left none
    //   border-bottom-left-radius 0
    //   border-top-left-radius 0
    // &:not(:last-of-type)
    //   border-bottom-right-radius 0
    //   border-top-right-radius 0

  .feedback-title
    font-size 16px
    font-weight 400
    color #1D2129
    line-height 26px
    margin 0
.feedback-help
  color #6D7278
  margin-top 14px
  margin-bottom 0
  font-size 12px
  float: right;
  clear: both;
.bad-reason
  overflow: hidden
  .authing-checkbox-item
    margin: 0 49px 9px 0
    flex-grow 0
    width auto
  .authing-checkbox
    display block
  .bad-reason-title
    color #6D7278
    margin 0
    margin-bottom 17px
    font-size: 14px
    font-weight normal
.feedback-success,.bad-reason
  z-index: 8888;
  background: #FFFFFF;
  border: 1px solid #E5E6EB;
  box-shadow: 0px 16px 32px -10px rgba(4, 24, 115, 0.1);
  border-radius: 4px;
  width: 352px;
  // background: #F8FAFC;
  padding 24px
.feedback-success-icon
  color $accentColor
  margin-right 1em
  flex-shrink 0
.authing-custom-feedback
  width 100%
  height 90px
  min-height: 90px
  max-height: 300px
  background: #F2F3F5;
  border-radius: 2px;
  border 1px solid #EEEEEE
  font-size 14px
  padding 14px 20px
  margin-top 25px
  resize vertical

  box-sizing border-box
  &:focus
    outline none
.submit-feedback-btn
  float right
  background-color $accentColor
  background $accentColor
  border-radius 4px
  height 28px
  line-height 28px
  width 64px
  margin-top 14px
  color #fff
  font-size 14px
  outline none
  border none
  cursor pointer
  &:focus
    outline none
    border none
  &:hover
    background-color #2e55cc

@media (max-width: $MQMobile)
  .feedback
    .feedback-action-container
      flex-wrap wrap
      .feedback-title
        width 100%
      .feedback-btn
        margin-top 14px
        &:first-of-type
          margin-left 0
</style>
