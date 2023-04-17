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
    <div v-if="showSuggestions" class="suggestions" @mouseleave="unfocus">
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
            <span v-if="s.header" class="header"
              >&gt; {{ s.header.title }}</span
            >
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
  name: "SidebarSearch",

  props: {
    placeholder: String,
    items: Array
  },

  data() {
    return {
      query: "",
      focused: false,
      focusIndex: 0,
      platLinks: []
    };
  },
  watch: {
    $route: {
      handler() {
        this.query = [];
        this.calcLinks();
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
      if (this.platLinks.length === 0) {
        this.calcLinks();
      }
      const result = this.platLinks.filter(item =>
        item.keywords.includes(query)
      );
      return result;
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
    calcLinks() {
      const result = [];
      function calcLinksWithChildren(items) {
        items.forEach(item => {
          if (item.path) {
            result.push({
              path: item.path,
              title: item.title,
              keywords: `${item.path
                .split("/")
                .pop()
                .toLowerCase()}${item.title.toLowerCase()}`,
              dataIndex: item.dataIndex
            });
          }
          if (item.children && item.children.length > 0) {
            calcLinksWithChildren(item.children);
          }
        });
      }
      calcLinksWithChildren(this.items);
      this.platLinks = result;
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
      // this.$eventBus.$emit('onChangeIndex', this.suggestions[i].dataIndex)
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
