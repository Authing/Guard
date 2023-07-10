<template>
  <div class="explore-card">
    <h4 class="explore-card-title">
      {{ exploreInfo.title }}
    </h4>

    <div
      v-for="(link, index) of exploreInfo.links"
      :key="index"
      class="explore-card-link-item"
    >
      <div class="explore-icon-wrapper">
        <IconFont class="explore-icon" :type="link.icon" />
      </div>
      <div class="explore-card-link-wrapper">
        <NavLink :item="link" />
        <!-- <p class="link-description">{{ link.description }}</p> -->
      </div>
    </div>

    <KnowMore :link="exploreInfo.knowMore" />
  </div>
</template>

<script>
import IconFont from '@theme/components/IconFont/index.vue'
import NavLink from '@theme/components/NavLink'
import KnowMore from '@theme/components/Home/KnowMore.vue'

export default {
  components: {
    NavLink,
    IconFont,
    KnowMore,
  },
  props: {
    exploreInfo: {
      type: Object,
      required: true,
    },
  },
  name: 'ExploreCard',
}
</script>

<style lang="stylus">
.explore-card
  .explore-icon-wrapper
    width 24px
    min-width 24px
    height 24px
    line-height 24px
    text-align center
    background-color $accentColor
    border-radius 50%
    margin-right 16px
    .explore-icon
      font-size 14px
      color white
  .explore-card-title
    margin-bottom 30px
    margin-top 0
    color #9BA1A7
  .explore-card-link-item
    margin-bottom 28px
    display flex
    align-items center
    font-size 14px
    &:last-of-type
      margin-bottom 40px
  .explore-card-link-wrapper
    font-size 16px
    a
      color #6d7278
      &:hover
        color $accentColor
    .link-description
      color: #6D7278
      margin 0
      margin-top 4px
@media (max-width: $MQMobile)
  .explore-card
    width 100%
    .explore-card-title
      font-size 1rem
    .explore-card-link-item
      font-size 1rem
      margin-bottom 1.875rem
</style>
