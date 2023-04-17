<template>
  <div class="authing-empty">
    <img :src="imgUrl" />
    <p class="authing-empty-description">{{ description }}</p>
  </div>
</template>

<script>
export default {
  name: 'AuthingEmpty',
  props: {
    imgUrl: {
      type: String,
      default: () => {
        return require(`@theme/assets/images/empty.svg`)
      },
    },
    description: {
      type: String,
      default: '暂无数据',
    },
  },
}
</script>

<style lang="stylus">
.authing-empty {
  display: flex;
  flex-direction: column;
  font-size: 16px;
  align-items: center;
  justify-content: center;
  .authing-empty-description {
    margin-top: 32px;
    color: #9FABCB;
    margin-bottom: 0;
    margin-left: -14px;
  }
}
</style>
