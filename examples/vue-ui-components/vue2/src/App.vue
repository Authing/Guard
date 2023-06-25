<template>
  <div id="app">
    <Guard :appId="appId" @login="onLogin"></Guard>
  </div>
</template>

<script>
import { Guard } from '@authing/vue-ui-components'

import '@authing/vue-ui-components/dist/esm/guard.min.css'

console.log('Guard: ', Guard)

export default {
  name: 'App',
  components: {
    Guard
  },
  data: function () {
    return {
      appId: 'AUTHING_APP_ID'
    }
  },
  methods: {
    onLogin (userInfo) {
      console.log(userInfo)
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
