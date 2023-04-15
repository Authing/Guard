<template>
  <div class="feedback" ref="feedback">
    <div class="feedback-action">
      <div class="feedback-action-container">
        <h5 class="feedback-title">{{ feedbackConfig.title }}</h5>
        <div
          @click="handleFeedback(STATUS.GOOD)"
          :class="[
            'feedback-btn',
            'good',
            {
              active: status === STATUS.GOOD
            }
          ]"
        >
          <IconFont v-if="status === STATUS.GOOD" type="authing-good-" />
          <IconFont v-else type="authing-good" />
          <span class="feedback-text-tip">{{ feedbackConfig.useful }}</span>
        </div>
        <div
          @click="handleFeedback(STATUS.BAD)"
          :class="[
            'feedback-btn',
            'bad',
            {
              active: status === STATUS.BAD
            }
          ]"
        >
          <IconFont v-if="status === STATUS.BAD" type="authing-good-" />
          <IconFont v-else type="authing-good" />
          <span class="feedback-text-tip">{{ feedbackConfig.useless }}</span>
        </div>
      </div>
      <div class="github-edit">
        <a
          class="link"
          target="_blank"
          href="https://github.com/Authing/docs/issues/new?assignees=&labels=question&template=question.md"
        >{{feedbackConfig.editLink}}
        </a>
      </div>
    </div>

    <FeedbackToast
      :type="feedbackType"
      v-model="isShowFeedbackFormToast"
      @success="submitFeedback"
      :styles="feedbackToastStyles"
    >
    </FeedbackToast>

    <FeedbackSuccess
      v-model="isShowFeedbackSuccessToast"
      @hide="hideFeedbackSuccessToast"
      :styles="feedbackToastStyles"
    >
    </FeedbackSuccess>

    <div class="feedback-help">
      <div class="text">
        若你已对系统有基本了解，并且感兴趣的话，点击跳转 Authing
        控制台，来开启你的 Authing 之旅！
      </div>
      <a class="button" href="https://console.authing.cn" target="_blank"
        >进入 Authing</a
      >
      <img class="shadow-banner" src="../assets/images/banner.png" />
      <div class="shadow-bg"></div>
    </div>
  </div>
</template>

<script>
import IconFont from "@theme/components/IconFont/index.vue";
import { feishuFeedback } from "@theme/util/feishu";
import CheckboxGroup from "@theme/components/CheckboxGroup.vue";
import FeedbackToast from "./FeedbackFormToast.vue";
import FeedbackSuccess from "./FeedbackSuccessToast.vue";

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
      submited: false,
      isShowFeedbackFormToast: false,
      isShowFeedbackSuccessToast: false,
      feedbackType: "good"
    };
  },
  computed: {
    STATUS() {
      return STATUS;
    },
    feedbackConfig() {
      return this.$themeLocaleConfig.feedback;
    },
    feedbackToastStyles() {
      const clientWidth = document.documentElement.clientWidth;
      return clientWidth >= 1060
        ? "top: 40px; left: 110px"
        : "position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%)";
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
  mounted() {
    this.registToastStatusEvent();
  },
  methods: {
    submitFeedback(params) {
      feishuFeedback(params).then(() => {
        this.isShowFeedbackSuccessToast = true
      });
      this.isShowFeedbackFormToast = false;
    },
    handleFeedback(status) {
      this.status = status;
      this.feedbackType = status === 1 ? "good" : "bad";
      this.isShowFeedbackFormToast = true;
    },
    hideFeedbackSuccessToast() {
      this.isShowFeedbackSuccessToast = false;
    },
    registToastStatusEvent() {
      document.addEventListener("click", e => {
        this.isShowFeedbackFormToast = false;
        this.isShowFeedbackSuccessToast = false;
      });
      this.$refs.feedback.addEventListener("click", e => {
        e.stopPropagation();
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
.feedback
  position relative
  margin-top 34px
  .feedback-action
    overflow hidden
    clear both
  .github-edit
    margin-bottom 32px
    font-size 14px
    flex 1
    text-align right
    & a:hover
      text-decoration: underline
    color #215AE5
    .link
      color #215AE5
  .feedback-action-container
    display flex
    align-items center
    margin-bottom 24px
    .feedback-btn
      display inline-flex
      align-items center
      justify-content center
      width 88px
      height 34px
      background #F2F3F5
      border-radius 4px
      border 1px solid #F2F3F5
      cursor pointer
      font-size 14px
      color #4E597B
      margin-right: 17px;
      &.active
        color $accentColor
      &.bad
        .icon
          transform rotate(180deg)
      &:focus
        outline none
      &:first-of-type
        margin-left 15px
      // &:not(:first-of-type)
      //   border-left none
      //   border-bottom-left-radius 0
      //   border-top-left-radius 0
      // &:not(:last-of-type)
      //   border-bottom-right-radius 0
      //   border-top-right-radius 0
      .feedback-text-tip
        padding-left 3px
        box-sizing border-box
  .authing-checkbox-item
    flex-grow 0
    margin-right 49px
    width auto
  .feedback-title
    font-size 16px
    font-weight 500
    color #1D2129
    line-height 26px
    margin 0
  .feedback-help
    position relative
    margin 0 auto 32px auto
    width 100%
    height 154px
    border-radius 4px
    background #215AE5
    font-size 14px
    font-family PingFang SC
    line-height 22px
    color #fff
    overflow hidden
    .text
      position absolute
      z-index 1
      width 400px
      height 66px
      left 22px
      top 20px
      font-size 16px
      line-height 26px
    .button
      display flex
      flex-direction row
      align-items flex-start
      justify-content center
      padding 5px 24px
      gap 10px
      position absolute
      z-index 2
      width 145px
      height 32px
      left 21px
      background #FFFFFF
      border-radius 4px
      box-sizing border-box
      color #215AE5
      font-size 14px
  .bad-reason
    background: #F8FAFC;
    padding 24px
    .bad-reason-title
      color #6D7278
      margin 0
      margin-bottom 24px
      font-weight normal
  .feedback-success
    background: #F8FAFC;
    padding 18px 24px
    margin-bottom 14px
    display flex
    align-items center
  .feedback-success-icon
    color #396AFF
    margin-right 1em
    flex-shrink 0
  .authing-custom-feedback
    width 608px
    height 82px
    background #FFFFFF
    border-radius 1px
    border 1px solid #EEEEEE
    font-size 14px
    padding 14px 20px
    margin-top 14px
    resize none
    height 98px
    width 100%
    box-sizing border-box
    &:focus
      outline none
  .submit-feedback-btn
    background-color #396AFF
    background #396AFF
    border-radius 4px
    height 40px
    line-height 40px
    width 120px
    margin-top 24px
    color #fff
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
        margin-top 8px
        &:first-of-type
          margin-left 0
    .shadow-bg
      position absolute
      background #215AE5
      border-radius 4px
      width 503px
      height 125px
      top 21px
      background linear-gradient(270.24deg, rgba(33, 90, 229, 0) 12.25%, rgba(41, 143, 252, 0.3) 58%, rgba(33, 90, 229, 0) 92.84%)
      transform matrix(-0.68, 0.81, -0.66, -0.68, 0, 0)
    .shadow-banner
      display none
    .github-edit
      float left
    .feedback-help
      display none
      .text
        width 90%
        height 66px
        left 21px
        font-size 14px
      .button
        top 108px
@media (min-width: $MQMobile)
  .feedback-action-container
    float left
  .shadow-bg
    display none
  .shadow-banner
    position absolute
    width 100%
    height 154px
  .github-edit
    float right
    .link
      display block
      height 32px
      line-height 32px
  .feedback-help
    .button
      top 96px
</style>
