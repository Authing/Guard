<template>
  <footer class="footer">
    <div
      class="content-layout-container footer-container"
      :class="{
        'content-layout-container__without-sidebar': $frontmatter.noSidebar,
      }"
    >
      <a class="footer-logo" :href="$site.themeConfig.officeSiteUrl">
        <img width="100px" :src="$withBase($site.themeConfig.logo)" />
      </a>

      <!-- <div v-for="(item, index) of mockLinks" :key="index">
        <h4 class="footer-title">
          {{ item.title }}
          <span class="arrow-footer-outline"></span>
        </h4>

        <div
          v-for="(linkItem, linkIndex) of item.links"
          :key="linkIndex"
          class="footer-link-wrapper"
        >
          <NavLink class="footer-link" :item="linkItem" />
        </div>
      </div> -->

      <FooterCollapse
        v-for="(item, index) of sections"
        :key="index"
        :sectionInfo="item"
      />

      <div>
        <FooterCollapse
          :sectionInfo="{
            title: $themeLocaleConfig.company,
          }"
        >
          <template #collapseContent>
            <div
              v-if="footerLocaleConfig.contactPhone"
              class="footer-text-wrapper"
            >
              {{ footerLocaleConfig.contactPhone }}
            </div>
            <div
              v-if="footerLocaleConfig.contactEmail"
              class="footer-text-wrapper"
            >
              <a :href="`mailto:${ footerLocaleConfig.contactEmail }`">
                {{ footerLocaleConfig.contactEmail }}
              </a>
            </div>
            <div
              v-if="footerLocaleConfig.contactAddress"
              class="footer-text-wrapper text-paragh"
            >
              {{ footerLocaleConfig.contactAddress }}
            </div>
            <div
              v-if="footerLocaleConfig.contactChenduAddress"
              class="footer-text-wrapper text-paragh"
            >
              {{ footerLocaleConfig.contactChenduAddress }}
            </div>
          </template></FooterCollapse
        >
      </div>

      <div class="footer-last-right-container">
        <!-- <LangSelectOutline /> -->
        <p v-if="footerLocaleConfig.icp" class="footer-icp-record">
          {{ footerLocaleConfig.icp }}
        </p>
        <p v-if="footerLocaleConfig.beian" class="footer-icp-record">
          <img
            src="//files.authing.co/authing-website/icon-beian-gov.png"
            alt="beian"
          />{{ footerLocaleConfig.beian }}
        </p>
        <p class="footer-company-name">{{ footerLocaleConfig.companyName }}</p>
        <div v-if="socials && socials.length" class="footer-social-container">
          <a
            :title="item.title"
            v-for="(item, index) of socials"
            :key="index"
            target="_blank"
            :href="item.link"
          >
            <IconFont :type="item.icon" />
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import NavLink from '@theme/components/NavLink'
import LangSelectOutline from '@theme/components/LangSelectOutline.vue'
import IconFont from '@theme/components/IconFont/index.vue'
import FooterCollapse from '@theme/components/Footer/Collapse.vue'

export default {
  name: 'Footer',
  components: {
    NavLink,
    IconFont,
    FooterCollapse,
    LangSelectOutline,
  },
  data() {
    return {}
  },
  computed: {
    footerLocaleConfig() {
      return this.$themeLocaleConfig.footer
    },
    sections() {
      return this.footerLocaleConfig.sections
    },
    socials() {
      return this.footerLocaleConfig.socials
    },
  },
  methods: {},
}
</script>

<style lang="stylus">
.footer
  background #FAFAFB
  box-shadow 0px -1px 0px 0px #EEEEEE
  padding 50px 0
  .text-paragh
    line-height: 16px !important
    padding-top: 7px
    padding-bottom: 7px
  .footer-title
    color #A1ABC8
    font-weight 400
    margin-bottom 14px
    margin-top 0
  .footer-container
    margin 0 auto
    display flex
    justify-content space-between
    box-sizing border-box
    padding 0 24px
  .footer-link
    color #4B5A78
    &:hover
      color $accentColor
  .footer-link-wrapper, .footer-text-wrapper, .footer-text-wrapper a
    color #4B5A78
    font-weight normal
    font-size 14px
    line-height 28px
  .footer-text-wrapper
    max-width 150px
  .footer-last-right-container
    color #A1ABC8
    display flex
    flex-direction column
    font-size 14px
    p
      margin 0
    .footer-icp-record
      display flex
      align-item center
    .footer-social-container
      display flex
      justify-content space-between
      margin-top 20px
      // margin-top auto
      padding-bottom 4px
      a
        color #A1ABC8
        font-size 16px
@media (max-width: $MQMobile)
  .footer
    margin-top 48px
    padding-top 19px
    padding 1.25rem 1.25rem 3.5rem 1.25rem
    text-align left
    .footer-link-wrapper, .footer-link-wrapper .footer-link, .footer-text-wrapper
      font-size 12px
      font-weight normal
      color #4B5A78
    .footer-link-wrapper, .footer-text-wrapper
      margin 18px 0
    .footer-text-wrapper
      max-width unset
    .footer-container
      padding 0
      flex-direction column
      .footer-link-wrapper
        text-align left
      .footer-logo
        margin-bottom 1.5rem
      .footer-title
        font-size 0.875rem
        font-weight 400
        color #A1ABC8
        display flex
        justify-content space-between
        align-items center
        margin-bottom 0
        padding 20px 0 12px 0
        border-bottom 1px solid #EEEEEE
      .arrow-footer-outline
        display inline-block
        height .5em
        width .5em
        border 1px solid #999
        border-left-color transparent
        border-bottom-color transparent
        transition transform .3s
        transform rotate(135deg)
        margin-left .2em
      .footer-social-container
        order 1
        justify-content center
        margin-bottom 1.5rem
        margin-top 20px
        > a:not(:last-child)
          margin-right 2.75rem
      .lang-select-outline
        order 2
        margin-bottom 1.5rem
        // .dropdown-title
        //   display block
        .mobile-dropdown-title
          width 100%
          height 100%
          font-weight normal
          &:focus
            outline none
        .nav-dropdown
          list-style none
          padding-left 0
          background-color #fff
          box-shadow 0px 4px 6px 0px rgba(228, 228, 228, 0.5)
          position absolute
          left 0
          right 0
          top 1.4rem
          .nav-link
            color #999
            &.router-link-active
              &:after
                display none
              color $accentColor
      .footer-icp-record
        order 3
        text-align center
        display flex
        align-item center
        margin 0 auto
      .footer-company-name
        order 4
        text-align center
</style>
