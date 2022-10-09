<template>
  <div class="home-container">
    <button @click="toEmbed">内嵌模式 - 模态框形态</button>
  </div>
</template>

<script scoped>
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
