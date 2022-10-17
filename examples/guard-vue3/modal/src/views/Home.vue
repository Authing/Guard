<template>
  <div class="home-container">
    <button class="authing-button" @click="toEmbed">内嵌模式 - 模态框形态</button>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const toEmbed = () => {
  router.push({
    path: '/embed'
  })
}
</script>

