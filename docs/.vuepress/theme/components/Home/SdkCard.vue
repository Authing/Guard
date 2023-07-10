<template>
  <div class="sdk-card">
    <div
      :style="{
        borderTopColor: cardInfo.color
      }"
      class="sdk-card-top-bar"
    ></div>
    <div class="sdk-card-content-container">
      <h3 class="sdk-app-title">
        {{ cardInfo.title }}
      </h3>
      <p class="sdk-app-description">
        {{ cardInfo.description }}
      </p>

      <p class="sdk-access">{{ $themeLocaleConfig.sdkAccess }}</p>

      <div class="sdk-link-container">
        <template v-for="(sdk, index) of sdkData">
          <RouterLink
            v-if="sdk"
            :data-css-tips="sdk.name"
            :key="index"
            :title="sdk.name"
            :to="sdk.link"
            class="sdk-link-item"
          >
            <img
              width="24px"
              height="24px"
              :alt="sdk.name"
              :src="require(`@theme/assets/images/reference/${sdk.icon}.svg`)"
            />
          </RouterLink>
          <div class="sdk-icon-gutter"></div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import IconFont from "@theme/components/IconFont/index.vue";
export default {
  components: {
    IconFont
  },
  props: {
    cardInfo: {
      type: Object,
      required: true
    },
    sdkConfig: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      mockData: [
        {
          link: "dd",
          icon:
            "https://files.authing.co/authing-website/home-logo-cnpc-new.png"
        }
      ]
    };
  },
  computed: {
    sdkData() {
      return this.cardInfo.sdks.map(sdkKey => this.sdkConfig[sdkKey]);
    }
  }
};
</script>

<style lang="stylus">
.sdk-card
  transition box-shadow .3s
  box-sizing border-box
  min-width 270px
  &:hover
    box-shadow 0px 4px 6px 0px rgba(228, 228, 228, 0.5)
  .sdk-link-item
    transition transform .3s
    &:hover
      transform translateY(-3px)
  .sdk-card-content-container
    padding 20px 24px
    padding-top 16px
    background #FFFFFF
    border-bottom-left-radius 8px
    border-bottom-right-radius 8px
  .sdk-card-top-bar
    border-top-width 4px
    border-top-style solid
    border-top-left-radius 8px
    border-top-right-radius 8px
  .sdk-app-title
    font-size 16px
    color #111
    margin-bottom 8px
    margin-top 0
  .sdk-app-description
    font-size 14px
    line-height 22px
    color #6D7278
    margin-bottom 14px
    margin-top 0
    height 60px
  .sdk-access
    color #999
    font-size 12px
    margin-top 0
    margin-bottom 10px
    line-height 17px
  .sdk-icon
    width 24px
    height 24px
    border-radius 50%
    object-fit contain
    &:not(:first-child)
      margin-left 10px
  .sdk-link-container
    display flex
    align-items center
    a
      flex-shrink 0
      img
        vertical-align middle
    .sdk-icon-gutter
      flex-basis 10px
      flex-shrink 1
</style>

<!-- <template>
  <div class="sdk-card">
    <div
      :style="{
        borderTopColor: cardInfo.color
      }"
      class="sdk-card-top-bar"
    ></div>
    <div class="sdk-card-content-container">
      <h3 class="sdk-app-title">
        {{ cardInfo.title }}
      </h3>
      <p class="sdk-app-description">
        {{ cardInfo.description }}
      </p>

      <p class="sdk-access">{{ $themeLocaleConfig.sdkAccess }}</p>

      <div class="sdk-link-container">
        <template v-for="(sdk, index) of sdkData">
          <RouterLink
            :data-css-tips="sdk.name"
            :key="index"
            :title="sdk.name"
            :to="sdk.link"
            class="sdk-link-item"
          >
            <img
              width="40px"
              height="40px"
              :alt="sdk.name"
              :src="require(`@theme/assets/images/reference/${sdk.icon}.svg`)"
            />
          </RouterLink>
          <div class="sdk-icon-gutter"></div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import IconFont from "@theme/components/IconFont/index.vue";

export default {
  components: {
    IconFont
  },
  props: {
    cardInfo: {
      type: Object,
      required: true
    },
    sdkConfig: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      mockData: [
        {
          link: "dd",
          icon:
            "https://files.authing.co/authing-website/home-logo-cnpc-new.png"
        }
      ]
    };
  },
  computed: {
    sdkData() {
      return this.cardInfo.sdks.map(sdkKey => this.sdkConfig[sdkKey]);
    }
  }
};
</script>

<style lang="stylus">
.sdk-card
  transition box-shadow .3s
  box-sizing border-box
  min-width 270px
  &:hover
    box-shadow 0px 4px 6px 0px rgba(228, 228, 228, 0.5)
  .sdk-link-item
    transition transform .3s
    &:hover
      transform translateY(-3px)
  .sdk-card-content-container
    padding 20px 24px
    padding-top 16px
    background #FFFFFF
    border-bottom-left-radius 8px
    border-bottom-right-radius 8px
  .sdk-card-top-bar
    border-top-width 4px
    border-top-style solid
    border-top-left-radius 8px
    border-top-right-radius 8px
  .sdk-app-title
    font-size 16px
    color #111
    margin-bottom 8px
    margin-top 0

  .sdk-app-description
    font-size 14px
    line-height 22px
    color #6D7278
    margin-bottom 14px
    margin-top 0
    height 60px

  .sdk-access
    color #999
    font-size 12px
    margin-top 0
    margin-bottom 10px
    line-height 17px

  .sdk-icon
    width 24px
    height 24px
    border-radius 50%
    object-fit contain
    &:not(:first-child)
      margin-left 10px

  .sdk-link-container
    display flex
    align-items center
    flex-wrap: wrap
    a
      flex-shrink 0
      img
        vertical-align middle
        margin-bottom: 10px
    .sdk-icon-gutter
      flex-basis 10px
      flex-shrink 1
</style> -->
