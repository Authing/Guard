<template>
  <ul v-if="items.length" class="sidebar-links">
    <li
      v-for="(item, i) in items" :key="i"
      :data-index="item.dataIndex"
      @click.stop="onClickMenu($event, item.dataIndex)"
      :class="{
        'menu-check': checkIndex && `${checkIndex}-`.indexOf(`${item.dataIndex}-`) === 0
      }"
    >
      <SidebarGroup
        v-if="item.type === 'group'"
        :item="item"
        :open="i === openGroupIndex"
        :collapsable="item.collapsable || item.collapsible"
        :depth="depth"
        @toggle="toggleGroup(i)"
        :check-index="checkIndex"
      />
      <SidebarLink v-else :sidebar-depth="sidebarDepth" :item="item" />
    </li>
  </ul>
</template>

<script>
import SidebarGroup from '@theme/components/SidebarGroup.vue'
import SidebarLink from '@theme/components/SidebarLink.vue'
import { isActive } from '../util'

export default {
  name: 'SidebarLinks',

  components: { SidebarGroup, SidebarLink },

  props: [
    'items',
    'depth', // depth of current sidebar links
    'sidebarDepth', // depth of headers to be extracted
    'initialOpenGroupIndex',
    'checkIndex'
  ],

  data() {
    return {
      openGroupIndex: this.initialOpenGroupIndex || -1,
    }
  },

  watch: {
    $route() {
      this.refreshIndex()
    },
  },

  created() {
    this.refreshIndex()
  },

  methods: {
    refreshIndex() {
      const index = resolveOpenGroupIndex(this.$route, this.items)

      if (index > -1) {
        this.openGroupIndex = index
      }
    },

    toggleGroup(index) {
      this.openGroupIndex = index === this.openGroupIndex ? -1 : index
    },

    isActive(page) {
      return isActive(this.$route, page.regularPath)
    },

    onClickMenu(e, dataIndex) {
      (e.target.tagName.toLowerCase() === 'a' || e.target.parentNode.tagName.toLowerCase() === 'a')
      // && this.$eventBus.$emit('onChangeIndex', dataIndex)
    },

    getDataIndex(index, i) {
      return index ? `${index}-${i}` : `${i}`
    },

    routerLink(dataIndex) {
      setTimeout(() => {
        this.$eventBus.$emit('onChangeIndex', dataIndex)
      }, 200);
    }
  },
}

function resolveOpenGroupIndex(route, items) {
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    if (descendantIsActive(route, item)) {
      return i
    }
  }
  return -1
}

function descendantIsActive(route, item) {
  if (item.type === 'group') {
    return item.children.some((child) => {
      if (
        child.type === 'group' &&
        (!child.path || !isActive(route, child.path))
      ) {
        return descendantIsActive(route, child)
      } else {
        return isActive(route, child.path)
      }
    })
  }
  return false
}
</script>
<style lang="stylus">
.menu-check, .menu-check > section > p, .menu-check > section > a
  font-weight: 500 !important
  color: #1d2129 !important
</style>
