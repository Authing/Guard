<template>
  <div class="api-method-response-example">
    <div class="parameters-description">
      <div v-if="regularHttpCode === 200">
        <span class="green-dot"></span> 200: OK
      </div>
      <div v-else>
        <span class="red-dot"></span> {{ regularHttpCode }}: Bad Request
      </div>
    </div>

    <div
      v-if="needShow('description')"
      class="api-method-response-example-description"
    >
      <slot name="description">
        <p>
          {{ description }}
        </p>
      </slot>
    </div>

    <slot />
  </div>
</template>

<script>
export default {
  name: 'ApiMethodResponse',
  props: {
    httpCode: {
      type: [Number, String],
      default: 200,
    },
    description: String,
  },
  computed: {
    regularHttpCode() {
      return Number(this.httpCode)
    },
  },
  methods: {
    needShow(key) {
      return this[key] || this.$slots[key] || this.$scopedSlots[key]
    },
  },
}
</script>

<style></style>
