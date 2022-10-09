<template>
  <div class="home-container">
    <button @click="toEmbed">内嵌模式 - 模态框形态</button>
  </div>
</template>

<script scoped setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const toEmbed = () => {
  router.push({
    path: '/embed'
  })
}
</script>
