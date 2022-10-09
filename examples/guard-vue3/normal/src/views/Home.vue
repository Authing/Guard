<template>
  <div class="home-container">    
    <div style="margin-bottom: 20px;">
      <button @click="toEmbed">嵌入模式 - 普通形态</button>
    </div>

    <div style="margin-bottom: 20px;">
      <button @click="toJump">托管模式</button>
    </div>
    <div id="home-container"></div>
  </div>
</template>

<script scoped setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

import { useGuard } from '@authing/guard-vue3'

const router = useRouter()

const guard = useGuard()

const toEmbed = () => router.push({
  path: '/embed'
})

const toJump = () => router.push({
  path: '/jump'
})

</script>
