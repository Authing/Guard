<template>
  <div
    class="footer-collapse"
    :class="{
      'footer-collapse-expaned': expaned,
    }"
  >
    <h4 class="footer-title" @click="toggleExpaned">
      {{ sectionInfo.title }}
      <span class="arrow-footer-outline"></span>
    </h4>

    <div class="footer-collapse-content">
      <slot name="collapseContent">
        <div
          v-for="(linkItem, linkIndex) of sectionInfo.links"
          :key="linkIndex"
          class="footer-link-wrapper"
        >
          <NavLink class="footer-link" :item="linkItem" />
        </div>
      </slot>
    </div>
  </div>
</template>

<script>
import NavLink from '@theme/components/NavLink'

export default {
  name: 'FooterCollapse',
  components: {
    NavLink,
  },
  props: {
    sectionInfo: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      expaned: false,
    }
  },
  methods: {
    toggleExpaned() {
      this.expaned = !this.expaned
    },
  },
}
</script>

<style lang="stylus">
@media (max-width: $MQMobile)
  .footer-collapse
    .footer-collapse-content
      transition max-height .3s
      max-height 0
      overflow hidden
    &.footer-collapse-expaned
      .footer-collapse-content
        max-height 300px
        border-bottom 1px solid #EEEEEE
      .arrow-footer-outline
        transform rotate(-45deg)!important
</style>
