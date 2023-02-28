<template>
  <div class="drawer-mobile drawer bg-base-100">
    <input id="drawer" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content" style="scroll-behavior: smooth; scroll-padding-top: 5rem">
      <vt-header />
      <vt-main>
        <slot />
      </vt-main>
    </div>
    <vt-side />
  </div>
</template>

<script setup lang='ts'>
import VtHeader from './DefaultLayout/VtHeader.vue'
import VtSide from './DefaultLayout/VtSide.vue'
import VtMain from './DefaultLayout/VtMain.vue'
</script>
