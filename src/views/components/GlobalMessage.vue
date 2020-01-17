<template>
  <div
    class="authing-global-message"
    :class="{
      'authing-global-message-success': type === 'success',
      'authing-global-message-warn': type === 'warn',
      'authing-global-message-error': type === 'error',
      'authing-global-message-info': type === 'info'
    }"
  >
    <span class="animated fadeInUp">
      <span>{{ message }}</span>
    </span>
  </div>
</template>
<script>
export default {
  name: "GlobalMessage",
  props: {
    type: {
      type: String,
      default: "success"
    },
    message: {
      type: String,
      default: "Message is not set"
    }
  },
  methods: {}
};
</script>
<style scoped></style>
