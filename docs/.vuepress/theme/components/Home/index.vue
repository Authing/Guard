<template>
<div style="height: 1000px"></div>
</template>

<script>
export default {
  name: "Home"
};
</script>

<style lang="stylus">
.home
  padding-top $navbarHeight
  display block
  .sidebar
    display none
  .home-banner
    padding-top 69px
    padding-bottom 60px
    background-color #F7F8FA
    box-shadow 0px 1px 0px 0px #EEEEEE
    .home-title
      height 50px
      font-size 36px
      font-weight 500
      color #181818
      line-height 50px
      margin: 0 0 8px 0
    .doc-description
      lin-height: 28px
      font-size: 20px
      font-weight: 500
      color: #9BA1A7
      margin: 0

    .home-search
      margin-top 34px
      height 60px
      width 100%
      input
        background-position-x 24px
        padding-left 48px
        background-color: #fff
      .suggestions
        top 100%
        width 100%
        transform translateY(4px)
        box-sizing border-box

    .hot-search
      display flex
      align-items center
      font-size 14px
      margin-top 14px
      .hot-search-label
        color #999999
        margin-right 14px
      .hot-search-item
        color #6d7278
        &:hover
          color $accentColor
        &:not(:last-child)
          margin-right 30px

    .banner-container
        box-sizing border-box
        padding 0 24px
        margin 0px auto

  .explore-authing
    margin 99px 0 24px 0
  .sdk-card-container
    overflow auto
    display flex
    width 100%
    justify-content space-between
    margin-top 68px
    .sdk-card
      flex 1
      &:not(:first-child)
        margin-left 18px
  .home-main-content
    margin 0px auto
    box-sizing border-box
    padding 80px 24px 98px 24px
  .section-card-container, .explore-card-container
    display flex
    justify-content space-between
    flex-wrap wrap
  .explore-card-container
    margin -30px -12px
    // padding-left  100px
    // padding-left 24px
    .explore-card
      // padding 32px 64px 24px 64px
      padding 32px 12px 24px 12px
  .section-card-container
    margin 0 -12px
    .section-card
      padding 0 12px

@media (max-width: $MQMobile)
  .home
    .sidebar
      display block
    .home-banner
      padding 2rem 1.25rem 1.5rem 1.25rem
      .banner-container
        padding 0
      .home-title
        font-size 2rem
      .doc-description
        font-size 1rem
      .hot-search
        display none
      .home-search
        margin-right 0
        margin-top 1.5rem
    .sdk-card-container
      margin-top 2.5rem
      padding-bottom 1rem
    .home-main-content
      padding 2.5rem 1.25rem
    .explore-authing
      margin-top 0
      margin-bottom 2rem
</style>
