<template>
  <div
    class="sticky top-0 z-30 flex h-16 w-full justify-center bg-base-100 bg-opacity-90 text-base-content backdrop-blur transition-all duration-100 lg:hidden">
    <nav class="navbar w-full">
      <div class="flex flex-1 md:gap-1 lg:gap-2">
        <span class="tooltip tooltip-bottom before:text-xs before:content-[attr(data-tip)]" data-tip="Menu"><label
            for="drawer" class="btn-ghost drawer-button btn-square btn lg:hidden"><svg width="20" height="20"
              xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              class="inline-block h-5 w-5 stroke-current md:h-6 md:w-6">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16">
              </path>
            </svg></label></span>
        <div class="flex items-center gap-2 lg:hidden">
          <a href="/" aria-current="page" aria-label="Homepage" class="flex-0 btn-ghost btn px-2">
            <div class="font-title inline-flex text-lg text-primary transition-all duration-200 md:text-3xl">
              <span class="capitalize text-primary">Coogle</span>
            </div>
          </a>
        </div>
      </div>
      <!-- <div class="gap-2 pr-6">
        <div class="placeholder avatar">
          <div class="w-8 rounded-full bg-primary-focus text-primary-content">
            <span class="text-sm">AA</span>
          </div>
        </div>

        <div>user name</div>
      </div> -->
    </nav>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped></style>
