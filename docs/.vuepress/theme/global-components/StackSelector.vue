<template>
  <div
    class="stack-selector"
    :class="{
      'with-icon': selectedOption && selectedOption.icon,
    }"
    v-if="options.length"
  >
    <div class="selector-control">
      <span class="instructions-label">
        {{ selectLabel }}
      </span>

      <nav class="select-dropdown">
        <v-select
          :options="options"
          :value="selectedOption"
          :searchable="true"
          :multiple="false"
          :clearable="false"
          @input="handleInput"
        >
          <template #selected-option="{label, icon}">
            <IconFont v-if="icon" :type="icon" /><span class="framework">{{
              label
            }}</span>
          </template>
          <template #option="{label, componentKey, icon}">
            <div class="dropdown-item" :key="componentKey">
              <IconFont v-if="icon" :type="icon" /><span class="framework">{{
                label
              }}</span>
            </div>
          </template>
        </v-select>
      </nav>
    </div>
    <aside class="stack-content">
      <Content v-if="snippetComponentKey" :pageKey="snippetComponentKey" />
    </aside>
  </div>
  <div v-else class="no-stack-content">
    No code snippets defined
  </div>
</template>

<script>
import { COMMON_NAME_TO_FANCY_NAME, iconify } from '@theme/util/frameworks'
import IconFont from '@theme/components/IconFont/index.vue'
import isEqual from 'lodash/isEqual'
import keyBy from 'lodash/keyBy'

/**
 * TODO, 现在这种做法无法 ssr
 */
export default {
  name: 'StackSelector',
  components: {
    IconFont,
  },
  props: {
    snippet: {
      type: String,
    },
    selectLabel: {
      type: String,
      default: '框架指引',
    },
    default: String,
    order: Array,
  },
  data() {
    return {
      offsetFromViewport: null,
      hasFocus: false,
    }
  },
  methods: {
    handleScroll() {
      // beforeUpdated was somehow AFTER the viewport offsets were calculated for new content
      // thus we need to save this from before they swap tabs within the StackSelector
      this.offsetFromViewport = this.$el.getBoundingClientRect().top
    },
    handleInput: function(value) {
      if (this.$route.query[this.snippet] === value.framework) {
        return
      }

      this.hasFocus = true

      this.$router.replace({
        query: {
          ...this.$route.query,
          [this.snippet]: value.framework,
        },
      })
    },
    getFrameworkInfo(regularPath) {
      let [framework, snippet] = regularPath.split('/').slice(-2)
      snippet = snippet.replace('.html', '')

      return {
        framework,
        snippet,
      }
    },
  },
  created() {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', this.handleScroll)
    }
  },
  destroyed() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', this.handleScroll)
    }
  },
  computed: {
    guideName() {
      return guideFromPath(this.$route.path).guideName
    },
    // framework() {
    //   // Default to first available framework
    //   return guideFromPath( this.$route.path ).framework || this.options[0].name;
    // },
    // sectionName() {
    //   return guideFromPath( this.$route.path ).sectionName;
    // },
    // guide() {
    //    return getGuidesInfo({pages: this.$site.pages}).byName[this.guideName];
    // },
    // section() {
    //   return this.guide.sectionByName[this.sectionName];
    // },
    options() {
      const currPagePath = this.$page.regularPath
      const frameworkPages = this.$site.pages
        .filter((page) => page.regularPath.startsWith(currPagePath))
        .filter((page) => {
          let { framework, snippet } = this.getFrameworkInfo(page.regularPath)

          return (
            COMMON_NAME_TO_FANCY_NAME[framework] && snippet === this.snippet
          )
        })

      const noOrderOptions = frameworkPages.map((page) => {
        let { framework, snippet } = this.getFrameworkInfo(page.regularPath)

        return {
          componentKey: page.key,
          icon: iconify(framework),
          framework,
          label: COMMON_NAME_TO_FANCY_NAME[framework],
          page,
        }
      })

      if (this.order) {
        const optMap = keyBy(noOrderOptions, 'framework')
        return this.order
          .map((framework) => optMap[framework])
          .filter((item) => item)
      }

      return noOrderOptions.sort((a, b) =>
        a.framework.localeCompare(b.framework)
      )
    },
    snippetComponentKey() {
      return this.selectedOption && this.selectedOption.componentKey
    },
    selectedOption: {
      get: function() {
        return this.options.find(
          (option) => option.framework === this.framework
        )
      },
    },
    framework() {
      const queryActiveKey = this.$route.query[this.snippet]
      const defaultAvtive = queryActiveKey || this.defaultFramework
      const firstKey =
        this.options && this.options[0] && this.options[0].framework

      return queryActiveKey || defaultAvtive || firstKey
    },
  },
  updated() {
    // If we are the Stack Selector that was focused (clicked on),
    // scroll that we stay in the same position relative to the viewport
    if (this.hasFocus && this.offsetFromViewport) {
      this.$nextTick(() => {
        // postponed to allow child components to rerender
        window.scroll(0, this.$el.offsetTop - this.offsetFromViewport + 57)
        this.hasFocus = false
      })
    }
  },
}
</script>
<style lang="scss">
.no-stack-content {
  border: 1px solid #d66;
  padding: 10px;
}
$border-color: #dfe2e5;
$text-color: #5c6971;
$gray-000: #fafafa;
$small-spacing: 0.55rem;
$accentColor: #215AE5;

.stack-selector {
  border: 1px solid $border-color;
  margin-top: 24px;
  border-radius: 3px;
  &.with-icon {
    .vs__search {
      margin-left: 1.7rem;
    }
  }
  .selector-control {
    display: flex;
    padding: $small-spacing 24px;
    background: #f6f8fa;
    border-bottom: 1px solid $border-color;

    .framework {
      padding-left: 10px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    nav {
      flex: 1;
      background-color: white;
      cursor: pointer;
      div, input {
        cursor: pointer;
      }
    }
    .instructions-label {
      flex: 0;
      padding: 0.65rem 20px 0.5rem 0;
      font-weight: bold;
      white-space: nowrap;
    }
    .icon {
      width: 24px;
      height: 24px;
      &:before,
      &:after {
        font-size: 24px;
        width: 24px;
        height: 24px;
        line-height: 24px;
        display: inline-block;
        vertical-align: middle;
        text-align: center;
        background-position: center;
        background-repeat: no-repeat;
        background-size: 20px 20px;
      }
    }
    .dropdown-item {
      display: flex;
      position: relative;
      top: 1px;
      width: 100%;
      white-space: nowrap;
      text-overflow: ellipsis;
      text-decoration: none;
      color: $text-color;
      background: transparent;
      align-items: center;
      width: 100%;
      text-overflow: ellipsis;
    }

    .vs__search {
      margin-top: 0;
    }

    .vs__dropdown-toggle {
      min-height: 45px;
      padding: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: nowrap;
      .vs__selected-options {
        flex-basis: auto;
        padding: 0;
        padding-left: 0.5rem;
        max-width: 95%;
        .vs__selected {
          margin: 0;
          padding: 0;
          border: 0;
        }
      }
    }

    .vs__dropdown-menu {
      overflow-x: hidden;
      border-top-style: initial;
      padding-bottom: 0px;
      z-index: 50;

      .vs__dropdown-option {
        padding: 0.7rem 1rem;
        border: 1px solid transparent;
        border-bottom: 1px solid #e4e5e7;
        width: 100%;
        margin-bottom: 0;

        &:last-child {
          border-bottom: 1px solid transparent;
        }

        &--highlight {
          background: inherit;
          color: inherit;
          border: 1px solid $accentColor;
          box-sizing: border-box;

          &:last-child {
            border: 1px solid $accentColor;
            border-radius: 0 0 4px 4px;
            box-sizing: border-box;
          }
        }
      }
    }
  }

  .stack-content {
    padding: 24px;

    pre {
      margin: 0;
    }
  }
}
</style>
