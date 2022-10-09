<template>
  <div class="personal-container">
    <div>
      <button @click="logout">Logout</button>
    </div>
    <textarea id="" cols="100" rows="30" :value="userInfo"></textarea>
  </div>
</template>

<script scoped setup>
import { ref, onMounted } from 'vue'
import { useGuard } from '@authing/guard-vue3'

const userInfo = ref(null)

const guard = useGuard()

const getUserInfo = async () => {
  const _userInfo = await guard.trackSession()
  userInfo.value = JSON.stringify(_userInfo || '', null, 2)
}

const logout = () => guard.logout()

onMounted(() => {
  getUserInfo()
})
</script>
