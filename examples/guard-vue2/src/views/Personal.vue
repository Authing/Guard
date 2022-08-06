<template>
  <div class="personal-container">
    <div>{{ message }}</div>
    <textarea id="" cols="100" rows="30" :value="userInfo"></textarea>
  </div>
</template>

<script scoped>
export default {
  data () {
    return {
      message: 'This is Personal page ~~',
      userInfo: ''
    }
  },
  created () {
    this.getUserInfo()
  },
  methods: {
    getUserInfo () {
      this.$authing.guard.trackSession().then(res => {
        this.userInfo = JSON.stringify(res || '', null, 2)
      })
    }
  }
}
</script>
