<template>
  <div class="jump-container">
    <button class="authing-button" @click="startWithRedirect">Start With Redirect</button>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  methods: {
    startWithRedirect () {
      this.$guard.startWithRedirect({
        state: 'some-random-string'
      })
    }
  }
}
</script>
