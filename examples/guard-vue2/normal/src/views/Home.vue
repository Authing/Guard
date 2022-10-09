<template>
  <div class="home-container">
    <div style="margin-bottom: 20px;">
      <button @click="toEmbed">嵌入模式 - 普通形态</button>
    </div>
    <div>
      <button @click="toJump">托管模式</button>
    </div>
  </div>
</template>

<script scoped>
export default {
  data () {
    return {}
  },
  methods: {
    toEmbed () {
      this.$router.push({
        name: 'Embed'
      })
    },
    toJump () {
      this.$router.push({
        name: 'Jump'
      })
    }
  }
}
</script>
