<template>
  <label class="block"
    ><div class="mb-2 flex items-center gap-2">
      <slot name="label">
        <span class="capitalize">
          {{ label }}
        </span>
      </slot>
      <template v-if="tooltip">
        <div class="tooltip tooltip-right tooltip-primary" :data-tip="tooltip">
          <font-awesome-icon icon="fa-regular fa-circle-question" />
        </div>
      </template>
    </div>
    <slot />
  </label>
</template>

<script setup lang="ts">
defineProps<{
  label?: string
  tooltip?: string
}>()
</script>

<style scoped></style>
