<template>
  <tr class="api-method-parameter">
    <td>
      {{ name }}
      <div v-if="isRequired" class="required">REQUIRED</div>
      <div v-else class="optional">OPTIONAL</div>
    </td>
    <td>{{ type }}</td>
    <td class="description">
      <slot>
        <p>
          {{ description }}
        </p>
      </slot>
    </td>
  </tr>
</template>

<script>
export default {
  name: 'ApiMethodParam',
  props: {
    name: String,
    required: Boolean,
    type: String,
    description: String,
  },
  computed: {
    isRequired() {
      const required = this.required
      return typeof required === 'boolean' ? required : required === 'true'
    },
  },
}
</script>

<style></style>
