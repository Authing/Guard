<template>
  <div class="home-container">
    <button class="authing-button" @click="toEmbed">内嵌模式 - 模态框形态</button>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  methods: {
    toEmbed () {
      this.$router.push('/embed')
    }
  }
}
</script>
