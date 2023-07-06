<template>
  <nav v-if="navLinks.length" class="nav-links">
    <!-- user links -->
    <div
      v-for="item in navLinks"
      :key="item.link"
      :class="[
        'nav-item',
        {
          'nav-item-hidden': item.hidden
        }
      ]">
      <DropdownLink v-if="item.type === 'links'" :item="item">
        <template #arrow>
          <span class="arrow-outline-down"></span>
        </template>
      </DropdownLink>
      <Dropdown
        v-else-if="item.links"
        :list="item.links"
        :link="item.link"
        :trigger="isMobile ? 'click' : 'hover'">
        <template #text>{{ item.text }}</template>
        <template #active>
          <Tag>{{ item.tag }}</Tag>
        </template>
      </Dropdown>
      <NavLink v-else :item="item" />
    </div>
  </nav>
</template>

<script>
import DropdownLink from '@theme/components/DropdownLink.vue';
import NavLink from '@theme/components/NavLink.vue';
import Dropdown from '@theme/components/Dropdown.vue';
import Tag from '@theme/components/Tag.vue';
import debounce from 'lodash/debounce';
import { MQMobile } from '@theme/util/constants';

export default {
  name: 'NavLinks',

  props: {
    navLinks: {
      type: Array,
      required: true
    }
  },

  components: {
    NavLink,
    DropdownLink,
    Dropdown,
    Tag
  },

  data() {
    return {
      isMobile: false
    };
  },

  mounted() {
    this.setType();
    window.addEventListener('resize', this.setType);
  },

  methods: {
    setType: debounce(function () {
      if (document.body.offsetWidth > MQMobile) {
        this.isMobile = false;
      } else {
        this.isMobile = true;
      }
    }, 200)
  }
};
</script>

<style lang="stylus">
.nav-links {
  display: inline-block;

  a {
    line-height: 1.4rem;
    color: inherit;

    &:hover, &.router-link-active {
      color: $accentColor;
    }
  }

  .nav-item {
    position: relative;
    display: inline-block;
    margin-left: 1.5rem;
    line-height: 2rem;

    &.nav-item-hidden {
      display: none !important;
    }

    &:first-child {
      margin-left: 0;
    }
  }

  .repo-link {
    margin-left: 1.5rem;
  }

  .arrow-outline-down {
    display: inline-block;
    height: 0.5em;
    width: 0.5em;
    border: 1px solid #999;
    border-left-color: transparent;
    border-bottom-color: transparent;
    transform: rotate(135deg) translateY(0.3em);
    margin-left: 0.2em;
  }
}

@media (max-width: $MQMobile) {
  .nav-links {
    & a:hover {
      color: inherit;
    }

    .nav-item, .repo-link {
      margin-left: 0;
    }
  }
}

@media (min-width: $MQMobile) {
  .nav-links a {
    &:hover, &.router-link-active {
      color: $textColor;
    }
  }

  .nav-item > a:not(.external) {
    &:hover, &.router-link-active {
      // margin-bottom -2px
      // border-bottom 2px solid lighten($accentColor, 8%)
      position: relative;
      color: $accentColor;

      &::after {
        content: '';
        display: block;
        position: absolute;
        left: 0;
        right: 0;
        bottom: -17px;
        height: 2px;
        background-color: lighten($accentColor, 8%);
      }
    }
  }
}
</style>
