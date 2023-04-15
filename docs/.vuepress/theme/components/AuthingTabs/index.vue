<template>
  <div class="authing-tabs">
    <div
      class="authing-tabs-item"
      :class="{
        active: item.key === activeTab,
      }"
      v-for="item of tabs"
      :key="item.key"
      @click="$emit('tab-click', item)"
    >
      {{ item.label }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'AuthingTabs',
  props: {
    tabs: {
      type: Array,
      required: true,
    },
    activeTab: {
      type: String,
      required: true,
    },
  },
}
</script>

<style lang="stylus">
.authing-tabs {
  display: flex;
  align-items: center;
  .authing-tabs-item {
    box-sizing: border-box;
    color: #515B78;
    font-size: 16px;
    cursor: pointer;
    &:not(:first-child) {
      margin-left: 1.5rem;
    }
    &.active {
      color: $accentColor;
      font-weight: 500;
    }
  }
  @media (max-width: $MQMobile) {
    .authing-tabs {
      white-space: nowrap;
      overflow: atuo;
    }
  }
}
</style>
