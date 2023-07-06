<template>
  <div v-if="lastUpdated" class="authing-last-updated">
    <div class="left">
      <span class="prefix">{{ lastUpdatedText }}:</span>
      <span class="time">{{ lastUpdated }}</span>
    </div>

    <div class="right">
      <ClientOnly>
        <FeedbackSmall />
      </ClientOnly>
      <div class="github-edit">
        <svg
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M950.930286 512q0 143.433143-83.748571 257.974857t-216.283429 158.573714q-15.433143 2.852571-22.601143-4.022857t-7.168-17.115429l0-120.539429q0-55.442286-29.696-81.115429 32.548571-3.437714 58.587429-10.313143t53.686857-22.308571 46.299429-38.034286 30.281143-59.977143 11.702857-86.016q0-69.12-45.129143-117.686857 21.138286-52.004571-4.534857-116.589714-16.018286-5.12-46.299429 6.290286t-52.589714 25.161143l-21.723429 13.677714q-53.174857-14.848-109.714286-14.848t-109.714286 14.848q-9.142857-6.290286-24.283429-15.433143t-47.689143-22.016-49.152-7.68q-25.161143 64.585143-4.022857 116.589714-45.129143 48.566857-45.129143 117.686857 0 48.566857 11.702857 85.723429t29.988571 59.977143 46.006857 38.253714 53.686857 22.308571 58.587429 10.313143q-22.820571 20.553143-28.013714 58.88-11.995429 5.705143-25.746286 8.557714t-32.548571 2.852571-37.449143-12.288-31.744-35.693714q-10.825143-18.285714-27.721143-29.696t-28.306286-13.677714l-11.410286-1.682286q-11.995429 0-16.603429 2.56t-2.852571 6.582857 5.12 7.972571 7.460571 6.875429l4.022857 2.852571q12.580571 5.705143 24.868571 21.723429t17.993143 29.110857l5.705143 13.165714q7.460571 21.723429 25.161143 35.108571t38.253714 17.115429 39.716571 4.022857 31.744-1.974857l13.165714-2.267429q0 21.723429 0.292571 50.834286t0.292571 30.866286q0 10.313143-7.460571 17.115429t-22.820571 4.022857q-132.534857-44.032-216.283429-158.573714t-83.748571-257.974857q0-119.442286 58.88-220.306286t159.744-159.744 220.306286-58.88 220.306286 58.88 159.744 159.744 58.88 220.306286z"
            fill="#2c2c2c"
          ></path>
        </svg>

        <a
          :href="
            `https://github.com/Authing/docs/edit/main/docs/${$page.relativePath}`
          "
        >
          {{ $localeConfig.githubEdit }}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import FeedbackSmall from "@theme/components/FeedbackSmall.vue";

export default {
  name: "LastUpdated",
  components: { FeedbackSmall },
  computed: {
    lastUpdated() {
      return this.$page.lastUpdated;
    },

    lastUpdatedText() {
      if (typeof this.$themeLocaleConfig.lastUpdated === "string") {
        return this.$themeLocaleConfig.lastUpdated;
      }
      if (typeof this.$site.themeConfig.lastUpdated === "string") {
        return this.$site.themeConfig.lastUpdated;
      }
      return "Last Updated";
    }
  }
};
</script>

<style lang="stylus" scoped>
.authing-last-updated
  display flex
  color #86909C
  margin-bottom 24px
  font-size 14px
  clear both
  .left
    float left
    line-height 24px
  .right
    float right
    flex-grow 1
    display flex
    align-items center
    justify-content space-between
    .github-edit
      margin-left 20px
  a
    line-height: 20px;
    color: #000;
  a,a:hover
    text-decoration: none !important;
  svg
    height: 20px;
    width: 20px;
    display: inline-block;
    vertical-align: bottom;
    path
      fill: #2c2c2c;
  &[href="#"]
    color: #C9CDD4
    cursor: not-allowed
    svg
      path
        fill: #C9CDD4;
@media (max-width: 440px)
  .authing-last-updated
    display block
    margin-bottom 24px
    .left
      float none
    .right
      float none
      margin-top 10px
      .feedback-small
        margin-left 0
</style>
