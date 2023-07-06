<template>
  <div class="authing-checkbox">
    <div
      :key="item.value"
      v-for="item of options"
      class="authing-checkbox-item"
    >
      <label>
        <span class="authing-checkbox-input">
          <input
            type="checkbox"
            :id="item.value"
            :value="item.value"
            v-model="localChecked"
            @change.prevent
          />
          <span class="authing-checkbox-inner"></span>
        </span>
        {{ item.label }}
      </label>
    </div>
  </div>
</template>

<script>
import isEqual from 'lodash/isEqual'

export default {
  name: 'CheckboxGroup',
  model: {
    prop: 'checked',
    event: 'change',
  },
  props: {
    options: {
      type: Array,
      required: true,
    },
    checked: Array,
  },
  data() {
    return {
      localChecked: [],
    }
  },
  methods: {},
  watch: {
    checked(newVal) {
      if (!isEqual(newVal, this.localChecked)) {
        this.localChecked = newVal
      }
    },
    localChecked(newVal) {
      if (!isEqual(newVal, this.checked)) {
        this.$emit('change', newVal)
      }
    },
  },
}
</script>

<style lang="stylus">
.authing-checkbox
  display flex
  flex-wrap wrap
  margin-bottom -24px
  .authing-checkbox-item
    width 25%
    flex-shrink 0
    min-width 0
    margin-bottom 24px
    label
      color #333
      font-size 14px
      cursor pointer
    .authing-checkbox-input
      display inline-block
      vertical-align middle
      width 16px
      height 16px
      margin-right 8px
      position: relative;
      input
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 1;
        width: 100%;
        height: 100%;
        cursor: pointer;
        opacity: 0;
        margin 0
        padding 0
      .authing-checkbox-inner
        position: relative;
        top: -0.09em;
        left: 0;
        display: block;
        width: 16px;
        height: 16px;
        direction: ltr;
        background-color: #fff;
        border: 1px solid #d9d9d9;
        border-radius: 2px;
        border-collapse: separate;
        -webkit-transition: all .3s;
        transition: all .3s;
      input:checked+.authing-checkbox-inner
        background-color: $accentColor;
        border-color: $accentColor;
        &::after
          position: absolute;
          top: 45%;
          left: 20%;
          display: table;
          width: 5.71428571px;
          height: 9.14285714px;
          border: 2px solid #fff;
          transform: rotate(45deg) scale(1) translate(-50%,-50%);
          transition: all .1s cubic-bezier(.71,-.46,.88,.6),opacity .1s;
          content: " ";
          border-top: 0;
          border-left: 0;
          opacity: 1;
</style>
