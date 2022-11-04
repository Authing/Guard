<template>
  <div class="jump-container">
    <button class="authing-button" @click="startWithRedirect">Start With Redirect</button>
  </div>
</template>

<script setup>
import { useGuard } from '@authing/guard-vue3'

const guard = useGuard()

const startWithRedirect = () => {
  guard.startWithRedirect({
    state: 'some-random-string'
  })
}
</script>
