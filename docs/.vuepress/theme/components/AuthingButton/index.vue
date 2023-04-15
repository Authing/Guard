<template>
  <Button
    v-on="$listeners"
    :disabled="disabled"
    class="authing-button"
    :class="[type]"
  >
    <slot></slot>
  </Button>
</template>

<script>
export default {
  name: 'AuthingButton',
  props: {
    type: {
      type: String,
    },
    disabled: {
      type: Boolean,
    },
  },
}
</script>

<style lang="stylus">
.authing-button {
  border-radius: 4px;
  height: 40px;
  line-height: 40px;
  min-width: 120px;
  outline: none;
  background: #FFFFFF;
  border-radius: 4px;
  border: 1px solid #DDDDDD;
  cursor: pointer;
  padding: 0 18px;
  box-sizing: border-box;
  &[disabled='disabled'] {
    cursor: not-allowed;
  }
  &:focus {
    outline: none;
  }
  &.primary {
    background-color: $accentColor;
    border: none;
    color: #fff;
    &:hover:not([disabled='disabled']) {
      background-color: #2e55cc  ;
    }
  }
}
</style>
