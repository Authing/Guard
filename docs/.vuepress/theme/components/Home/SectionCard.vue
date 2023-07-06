<template>
  <div class="section-card">
    <h3 class="section-title">{{ sectionInfo.title }}</h3>
    <p class="section-description">{{ sectionInfo.description }}</p>
    <div class="section-link-container">
      <div
        class="section-link-item"
        v-for="(item, index) of sectionInfo.links"
        :key="index"
      >
        <NavLink :item="item">
          {{ item.text }}
        </NavLink>
      </div>
    </div>

    <KnowMore :link="sectionInfo.knowMore" />
  </div>
</template>

<script>
import KnowMore from '@theme/components/Home/KnowMore.vue'
import NavLink from '@theme/components/NavLink.vue'

export default {
  name: 'SectionCard',
  components: {
    KnowMore,
    NavLink,
  },
  props: {
    sectionInfo: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style lang="stylus">
.section-card
  .section-title
    color #333
    font-size 20
    margin 0 0 9px 0
  .section-link-item
    margin-bottom 14px
    &:hover
      a
        color #2e55cc
  .section-link-container
    margin-bottom 40px
    font-size 14px
  .section-description
    font-size 14px
    color #6D7278
    margin 0
    margin-bottom 24px
@media (max-width: $MQMobile)
  .section-card
    width 100%
    margin-bottom 3.5rem
    .section-title
      font-size 1.25rem
    .section-description
      font-size 0.875rem
      margin-bottom 1.5rem
    .section-link-item
      border-bottom 1px solid #EEEEEE
      padding-bottom 0.5625rem
    .section-link-container
      margin-bottom 2.1875rem
</style>
