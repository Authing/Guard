<template>
  <div :key="componentKey" class="authing-steps">
    <template v-for="(item, index) of steps">
      <div
        class="authing-steps-item"
        :class="{
          current: currentStep === index,
          done: currentStep > index,
        }"
        :key="`dot-${index}`"
      >
        <div @click="$emit('step-click', index)" class="item-dot">
          <span v-if="currentStep <= index">
            {{ index + 1 }}
          </span>
          <span v-else class="step-done"></span>
        </div>
        <div class="item-title-container">
          <h3 class="item-title">{{ item.title }}</h3>
          <h5 class="item-sub-title">{{ item.subTitle }}</h5>
        </div>
      </div>
      <div
        v-if="index < steps.length - 1"
        class="step-line"
        :key="`line-${index}`"
      ></div>
    </template>
  </div>
</template>

<script>
import IconFont from '@theme/components/IconFont/index.vue'

export default {
  name: 'AuthingSteps',
  props: {
    currentStep: {
      type: Number,
      required: true,
    },
    steps: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      componentKey: +new Date(),
    }
  },
  mounted() {
    // 为了首次渲染时能够正确显示当前步骤
    this.$nextTick(() => (this.componentKey = +new Date()))
  },
}
</script>

<style lang="stylus">
.authing-steps {
  display: flex;
  align-items: flex-start;
  padding: 0 84px;
  .step-line {
    flex: 1;
    margin: 0 27px;
    margin-top: 15.5px;
    height: 1px;
    background: rgba(0, 0, 0, 0.15);
  }
  .authing-steps-item{
    .item-dot {
      box-sizing: border-box;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      flex-shrink: 0;
      color: rgba(0, 0, 0, 0.25);
      border: 2px solid rgba(0, 0, 0, 0.25);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 500;
      cursor: pointer;
    }
    .item-title-container {
      width: 32px;
      overflow: visible;
      .item-title, .item-sub-title {
        text-align: center;
        margin: 0;
      }
      .item-title {
        width: 182px;
        transform: translateX(-75px);
        font-size: 16px;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.65);
        line-height: 24px;
        margin-top: 12px;
      }
      .item-sub-title {
        width: 200px;
        transform: translateX(-84px);
        font-size: 14px;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.45);
        line-height: 22px;
        margin-top: 4px;
      }
    }
    &.current {
      .item-dot {
        color: #fff;
        border-color: $accentColor;
        background-color: $accentColor;
      }
      .item-title {
        color: rgba(0, 0, 0, 0.85);
        font-weight: 500;
      }
      .item-sub-title {
        color: rgba(0, 0, 0, 0.85);
      }
    }
    &.done {
      .item-dot {
        border-color: $accentColor;
      }
    }
    .step-done {
      width: 14px;
      height: 7px;
      border: 2px solid $accentColor;
      border-left-color: transparent;
      border-bottom-color: transparent;
      transform: translateY(-4px) rotate(135deg);
    }
  }
}
@media (max-width: $MQMobile) {
  .authing-steps {
    flex-direction: column;
    padding: 0;
    .authing-steps-item {
      display: flex;
      .item-dot {
        margin-right: 1.25rem;
      }
      .item-title-container {
        width: auto;
        height: 32px;
        .item-title, .item-sub-title {
          transform: none;
          width: auto;
          text-align: left;
        }
        .item-title {
          margin: 0;
          font-size: 1rem;
          // color: color: rgba(0, 0, 0, 0.65);
        }
      }
    }
    .step-line {
      flex-basis: 2.5rem;
      flex-flex-shrink: 0;
      width: 1px;
      margin: 10px 0 10px 15.5px;
    }
  }
}
</style>
