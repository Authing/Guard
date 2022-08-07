<template>
  <div class="home-container">
    <div style="margin-bottom: 30px;">{{ message }}</div>
    <button @click="toLogin">go to login page</button>
    <div id="home-container"></div>
  </div>
</template>

<script scoped>
export default {
  data () {
    return {
      message: 'This is Home page'
    }
  },
  mounted () {
    console.log('this.$guard: ', this.$guard)

    this.$guard.start('#home-container')
  },
  methods: {
    toLogin () {
      this.$router.push({
        name: 'Login'
      })
    }
  }
}
</script>
