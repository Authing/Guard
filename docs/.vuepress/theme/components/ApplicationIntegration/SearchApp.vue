<template>
  <div class="search-app-wrapper">
    <input
      ref="inputRef"
      v-model="localKeyword"
      class="search-app"
      :placeholder="langMap.placeholdervalue"
      @blur="$emit('blur')"
    />
    <div v-if="suggestions && suggestions.length" class="app-suggestions">
      <div v-for="item of suggestions" :key="item.link" class="app-suggestion-item">
        <RouterLink :to="item.link">
          {{ item.name }}
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchApp',
  model: {
    prop: 'keyword',
    event: 'change',
  },
  props: {
    apps: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      localKeyword: '',
    }
  },
  computed: {
    suggestions() {
      if (!this.keyword) {
        return []
      }
      return this.apps.filter((app) =>
        app.name.toLowerCase().includes(this.keyword.toLowerCase())
      )
    },
    langMap() {
      if (this.$lang === 'en-US') {
        return {
          placeholdervalue: 'Screening related applications',
        }
      } else if (this.$lang === 'zh-CN') {
        return {
          placeholdervalue: '筛选相关应用',
        }
      }
    },
  },
  watch: {
    localKeyword(val) {
      if (this.keyword !== val) {
        this.$emit('change', val)
      }
    },
    keyword(val) {
      if (this.localKeyword !== val) {
        this.localKeyword = val
      }
    },
  },
  methods: {
    focus() {
      this.$refs.inputRef.focus()
    },
  },
}
</script>

<style lang="stylus">
.search-app-wrapper {
  position: relative;
  display: inline-block;
  .search-app {
    width: 218px;
    height: 34px;
    line-height: 34px;
    border-radius: 2px;
    border: 1px solid #EEEEEE;
    outline: none;
    &:focus {
      outline: none;
    }
    background: #fff url('~@theme/assets/images/search.svg') calc(100% - 0.6rem) 50% no-repeat;
    background-size: 1rem;
    padding-left: 14px;
    padding-right: calc(14px + 1rem);
  }
  .app-suggestions {
    background: #fff;
    width: 100%;
    box-sizing: border-box;
    position: absolute;
    top: 2.5rem;
    // border 1px solid darken(#ddd, 10%)
    // box-shadow 0 3px 6px -4px rgb(0 0 0 / 12%), 0 6px 16px 0 rgb(0 0 0 / 8%), 0 9px 28px 8px rgb(0 0 0 / 5%)
    box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.04);
    border-radius: 6px;
    padding: 0.4rem;
    &.align-right {
      right: 0;
    }
  }
  .app-suggestion-item{
    line-height: 1.4;
    padding: 0.4rem 0.6rem;
    border-radius: 4px;
    cursor: pointer;
    a {
      white-space: normal;
      color: lighten($textColor, 35%);
      display: block;
    }
    &:hover {
      background-color #f3f4f5
      a {
        color $accentColor
      }
    }
  }
}
</style>
