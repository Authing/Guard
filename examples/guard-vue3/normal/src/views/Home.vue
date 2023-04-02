<template>
  <div class="home-container">
    <div style="margin-bottom: 20px;">
      <button class="authing-button" @click="toEmbed">嵌入模式 - 普通形态</button>
    </div>

    <div style="margin-bottom: 20px;">
      <button class="authing-button" @click="toJump">托管模式</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { useGuard } from '@authing/guard-vue3'

const guard = useGuard()

console.log('guard instance: ', guard)

const router = useRouter()

const toEmbed = () => router.push({
  path: '/embed'
})

const toJump = () => router.push({
  path: '/jump'
})

</script>
