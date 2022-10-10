<template>
  <div class="not-found-container">
    {{ message }}
  </div>
</template>

<script>
export default {
  name: 'NotFound',
  data () {
    return {
      message: 'This is not-found page ~'
    }
  }
}
</script>
