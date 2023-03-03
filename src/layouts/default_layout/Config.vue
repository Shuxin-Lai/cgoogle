<template>
  <teleport to="body">
    <div class="config-container fixed top-0 right-0 z-50 h-screen overflow-auto bg-red-400">
      config
    </div>
  </teleport>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.config-container {
  width: var(--vt-config-width);
}
</style>
