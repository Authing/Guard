<template>
  <div class="authing-search-box">
    <input
      ref="input"
      aria-label="Search"
      :value="query"
      :class="{ focused: focused }"
      :placeholder="placeholder"
      autocomplete="off"
      spellcheck="false"
      @input="query = $event.target.value"
      @focus="focused = true"
      @keyup.enter="go(focusIndex)"
      @keyup.up="onUp"
      @keyup.down="onDown"
      @blur="focused = false"
    />
    <div
      v-if="showSuggestions"
      class="suggestions"
      :class="{ 'align-right': alignRight }"
      @mouseleave="unfocus"
    >
      <ul>
        <li
          v-for="(s, i) in suggestions"
          :key="i"
          class="suggestion"
          :class="{ focused: i === focusIndex }"
          @mousedown="go(i)"
          @mouseenter="focus(i)"
        >
          <a :href="s.path" @click.prevent>
            <span class="page-title">{{ s.title || s.path }}</span>
            <span v-if="s.header" class="header">&gt; {{ s.header.title }}</span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import matchQuery from "@theme/util/matchQuery";
import { transformInterpolation } from "@theme/util";

/* global SEARCH_MAX_SUGGESTIONS, SEARCH_PATHS, SEARCH_HOTKEYS */
export default {
  name: "SearchBox",

  props: {
    placeholder: String
  },

  data() {
    return {
      query: "",
      focused: false,
      focusIndex: 0
    };
  },

  watch: {
    $route: {
      handler () {
        this.query = '';
      },
      immediate: true,
      deep: true
    }
  },

  computed: {
    showSuggestions() {
      return this.focused && this.suggestions && this.suggestions.length;
    },

    suggestions() {
      const query = this.query.trim().toLowerCase();
      if (!query) {
        return;
      }

      let { pages } = this.$site;
      pages = pages
        .map(item => {
          return {
            ...item,
            title: transformInterpolation(item.title, this),
            headers:
              item.headers &&
              item.headers.map(header => ({
                ...header,
                title: transformInterpolation(header.title, this)
              }))
          };
        });
      const max =
        this.$site.themeConfig.searchMaxSuggestions || SEARCH_MAX_SUGGESTIONS;

      const localePath = this.$localePath;
      const res = [];
      for (let i = 0; i < pages.length; i++) {
        if (res.length >= max) break;
        const p = pages[i];
        // filter out results that do not match current locale
        if (this.getPageLocalePath(p) !== localePath) {
          continue;
        }

        // filter out results that do not match searchable paths
        if (!this.isSearchable(p)) {
          continue;
        }

        if (matchQuery(query, p)) {
          res.push(p);
        } else if (p.headers) {
          for (let j = 0; j < p.headers.length; j++) {
            if (res.length >= max) break;
            const h = p.headers[j];
            if (h.title && matchQuery(query, p, h.title)) {
              res.push(
                Object.assign({}, p, {
                  path: p.path + "#" + h.slug,
                  header: h
                })
              );
            }
          }
        }
      }
      return res;
    },

    // make suggestions align right when there are not enough items
    alignRight() {
      const navCount = (this.$site.themeConfig.nav || []).length;
      const repo = this.$site.repo ? 1 : 0;
      return navCount + repo <= 2;
    }
  },

  mounted() {
    document.addEventListener("keydown", this.onHotkey);
  },

  beforeDestroy() {
    document.removeEventListener("keydown", this.onHotkey);
  },

  methods: {
    getPageLocalePath(page) {
      for (const localePath in this.$site.locales || {}) {
        if (localePath !== "/" && page.path.indexOf(localePath) === 0) {
          return localePath;
        }
      }
      return "/";
    },

    isSearchable(page) {
      let searchPaths = SEARCH_PATHS;

      // all paths searchables
      if (searchPaths === null) {
        return true;
      }

      searchPaths = Array.isArray(searchPaths)
        ? searchPaths
        : new Array(searchPaths);

      return (
        searchPaths.filter(path => {
          return page.path.match(path);
        }).length > 0
      );
    },

    onHotkey(event) {
      if (
        event.srcElement === document.body &&
        SEARCH_HOTKEYS.includes(event.key)
      ) {
        this.$refs.input.focus();
        event.preventDefault();
      }
    },

    onUp() {
      if (this.showSuggestions) {
        if (this.focusIndex > 0) {
          this.focusIndex--;
        } else {
          this.focusIndex = this.suggestions.length - 1;
        }
      }
    },

    onDown() {
      if (this.showSuggestions) {
        if (this.focusIndex < this.suggestions.length - 1) {
          this.focusIndex++;
        } else {
          this.focusIndex = 0;
        }
      }
    },

    go(i) {
      if (!this.showSuggestions) {
        return;
      }
      this.$router.push(this.suggestions[i].path);
      this.query = "";
      this.focusIndex = 0;
    },

    focus(i) {
      this.focusIndex = i;
    },

    unfocus() {
      this.focusIndex = -1;
    }
  }
};
</script>

<style lang="stylus">
.authing-search-box
  position relative
  height: 2rem
  width 10rem
  box-sizing border-box
  input
    cursor text
    width 100%
    height 100%
    box-sizing border-box
    color lighten($textColor, 25%)
    display inline-block
    border-radius 4px
    font-size 0.9rem
    line-height 2rem
    padding 0 0.5rem 0 2rem
    outline none
    transition all .2s ease
    background #F2F3F5 url(../assets/images/search.svg) 0.6rem 50% no-repeat
    background-size 1rem
    border 1px solid transparent
    &::-webkit-input-placeholder
      color #86909C
    &:focus
      border-color $accentColor
      background-color: #fff
      border: 1px solid $accentColor
      cursor auto
  .suggestions
    background #fff
    width 300px
    position absolute
    top 2.5rem
    max-height 300px
    border: 1px solid #eeeeee
    box-shadow: 0px 16px 32px -10px rgba(4, 24, 115, 0.1)
    overflow hidden
    // border 1px solid darken(#ddd, 10%)
    // box-shadow 0 3px 6px -4px rgb(0 0 0 / 12%), 0 6px 16px 0 rgb(0 0 0 / 8%), 0 9px 28px 8px rgb(0 0 0 / 5%)
    border-radius 6px
    padding 0.4rem 0
    z-index: 9999
    box-sizing border-box
    ul
      margin 0
      padding 0
      max-height 300px
      // width 100%
      overflow-y auto
      list-style-type none
    li
      position: relative
      padding: 16px 24px !important
      border-radius: 0
      &::after
        content: ''
        position: absolute
        left: 24px
        right: 24px
        bottom: 0
        height: 1px
        display: inline-block
        background: #ddd

    &.align-right
      right 0
  .suggestion
    line-height 1.4
    padding 0.4rem 0.6rem
    border-radius 4px
    cursor pointer
    a
      white-space normal
      color lighten($textColor, 35%)
      .page-title
        font-weight 600
      .header
        font-size 0.9em
        margin-left 0.25em
    &.focused
      background-color #f3f4f5
      a
        color $accentColor
  & .suggestion:last-child::after {
    display: none
  }

@media (max-width: $MQNarrow)
  .search-box
    input
      cursor pointer
      width 0
      border-color transparent
      position relative
      &:focus
        cursor text
        left 0
        width 10rem

// Match IE11
@media all and (-ms-high-contrast: none)
  .search-box input
    height 2rem

@media (max-width: $MQNarrow) and (min-width: $MQMobile)
  .search-box
    .suggestions
      left 0

@media (max-width: $MQMobile)
  .search-box
    margin-right 0
    input
      left 1rem
    .suggestions
      right 0

@media (max-width: $MQMobileNarrow)
  .search-box
    input:focus
      width 8rem
@media (max-width: $MQMobile)
  .suggestions
    width 100% !important
</style>
