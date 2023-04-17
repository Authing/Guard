<template>
	<div class="quickstarts-card">
		<div class="title">
			<IconFont :type="appType.icon" style="font-size: 26px; color: #215AE5" />
			<span>{{ appType.title }}</span>
		</div>
		<div class="description">
			{{ appType.description }}
		</div>
		<div class="language">
			<template v-for="(value, index) in appType.language">
				<div v-if="isUnLanguage(appType, value.key)" class="un-language item-language">
					<div class="header">
						<img
							width="24px"
							height="24px"
							:alt="languageMap[value].name"
							:src="require(`@theme/assets/images/sdk-icons/${languageMap[value.key].img2x}`)"
						/>
						<span class="span-language">{{ languageMap[value.key].name }}</span>
						<div class="language-tag">
							敬请期待
						</div>
					</div>
					<IconFont type="authing-jinru" style="font-size: 12px" class="item-language-icon" />
				</div>

				<div
					v-else
					class="show-language item-language"
					@click="
						() => {
							$router.push(`/${value.link}`);
						}
					"
				>
					<div class="header">
						<img
							width="24px"
							height="24px"
							:alt="languageMap[value.key].name"
							:src="require(`@theme/assets/images/sdk-icons/${languageMap[value.key].img2x}`)"
						/>
						<span class="span-language">{{ languageMap[value.key].name }}</span>
					</div>
					<IconFont type="authing-jinru" style="font-size: 12px" class="item-language-icon" />
				</div>
			</template>
		</div>
	</div>
</template>

<script>
import IconFont from '@theme/components/IconFont/index.vue';

export default {
	name: 'QuickstartsCard',

	components: {
		IconFont
	},

	props: {
		appType: {
			type: Object,
			required: true
		}
	},
	computed: {
		languageMap() {
			return this.$frontmatter.languageMap;
		}
	},
	methods: {
		isUnLanguage: (appType, value) => appType.unLanguage && appType.unLanguage.includes(value)
	}
};
</script>

<style lang="stylus">
.quickstarts-card
  width 513px
  background #FFFFFF
  box-shadow 0 4px 22px rgba(159, 159, 175, 0.15)
  border-radius 4px
  padding 26px 36px

  .title
    display flex
    align-items center

    span
      font-size 18px
      font-weight bold
      line-height 25px
      color #333333
      margin-left 16px

  .description
    font-size 14px
    line-height 20px
    color #666666
    margin-top 17px

  .language
    display flex
    flex-wrap wrap

    .item-language:nth-child(2n)
      margin-left 63px

    .item-language
      display flex
      align-items center
      justify-content space-between
      width 225px
      margin-top 26px
      cursor pointer

      .header
        display flex
        align-items center

        .span-language
          margin-left 16px
          font-size 16px
          font-weight bold
          line-height 9px
          color #333333
          opacity 1

      .language-tag
        width 62px
        height 21px
        background #F0F0F0
        opacity 1
        border-radius 4px
        font-size 12px
        display flex
        align-items center
        justify-content center
        margin-left 8px

    .un-language
      filter grayscale(100%)
      cursor not-allowed

    .show-language:hover
      .header
        .span-language
          color $accentColor

      .item-language-icon
        color $accentColor
@media (max-width: 1300px) {
  .quickstarts-card {
    width 100%

    .language {
      .item-language {
        width 100%
      }

      .item-language:nth-child(2n) {
        margin-left 0
      }
    }
  }
}
</style>
