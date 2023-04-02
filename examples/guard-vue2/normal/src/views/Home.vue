<template>
  <div class="home-container">
    <div style="margin-bottom: 20px;">
      <button class="authing-button" @click="toEmbed">嵌入模式 - 普通形态</button>
    </div>
    <div>
      <button class="authing-button" @click="toJump">托管模式</button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  mounted() {
    console.log('guard instance: ', this.$guard)
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
