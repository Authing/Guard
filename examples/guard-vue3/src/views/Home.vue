<template>
  <div class="home-container">
    <div style="margin-bottom: 30px;">{{ message }}</div>
    <button @click="toLogin">go to login page</button>
    <div id="home-container"></div>
  </div>
</template>

<script scoped setup>
import { useRouter } from 'vue-router'
import { useGuard } from '@authing/guard-vue3'

const router = useRouter()
const $guard = useGuard()

const message = 'This is home page ~~'
const toLogin = () => router.push({
  path: '/login'
})

$guard.start('#home-container')

// Composition API
// import { useRouter } from 'vue-router'

// const router = useRouter()

// const toLogin = () => {
//   router.push({
//     name: 'Login'
//   })
// }


// // Options API
// export default {
//   data () {
//     return {
//       message
//     }
//   },
//   mounted () {
//     // console.log('this.$authing: ', this.$authing)
//   },
//   methods: {
//     toLogin () {
//       this.$router.push({
//         name: 'Login'
//       })
//     }
//   }
// }
</script>
