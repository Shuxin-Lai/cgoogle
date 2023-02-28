<template>
  <div class="drawer-side" style="scroll-behavior: smooth; scroll-padding-top: 5rem">
    <label for="drawer" class="drawer-overlay"></label>
    <aside class="flex w-80 flex-col bg-base-200">
      <div class="sticky top-0 z-20 hidden items-center gap-2 bg-base-200 bg-opacity-90 px-4 py-2 backdrop-blur lg:flex">
        <a href="/" aria-current="page" aria-label="Homepage" class="flex-0 btn-ghost btn px-2 hover:bg-transparent">
          <div class="font-title inline-flex text-lg text-primary transition-all duration-200 md:text-3xl">
            <span class="capitalize">Coogle</span>
          </div>
        </a>
      </div>
      <div class="flex-1">
        <ul class="menu menu-compact flex flex-col p-0 px-4">
          <li class="mb-2">
            <router-link to="/" active-class="bg-base-400">
              <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" id="openai-symbol" viewBox="0 0 32 32">
                <path
                  d="M29.71,13.09A8.09,8.09,0,0,0,20.34,2.68a8.08,8.08,0,0,0-13.7,2.9A8.08,8.08,0,0,0,2.3,18.9,8,8,0,0,0,3,25.45a8.08,8.08,0,0,0,8.69,3.87,8,8,0,0,0,6,2.68,8.09,8.09,0,0,0,7.7-5.61,8,8,0,0,0,5.33-3.86A8.09,8.09,0,0,0,29.71,13.09Zm-12,16.82a6,6,0,0,1-3.84-1.39l.19-.11,6.37-3.68a1,1,0,0,0,.53-.91v-9l2.69,1.56a.08.08,0,0,1,.05.07v7.44A6,6,0,0,1,17.68,29.91ZM4.8,24.41a6,6,0,0,1-.71-4l.19.11,6.37,3.68a1,1,0,0,0,1,0l7.79-4.49V22.8a.09.09,0,0,1,0,.08L13,26.6A6,6,0,0,1,4.8,24.41ZM3.12,10.53A6,6,0,0,1,6.28,7.9v7.57a1,1,0,0,0,.51.9l7.75,4.47L11.85,22.4a.14.14,0,0,1-.09,0L5.32,18.68a6,6,0,0,1-2.2-8.18Zm22.13,5.14-7.78-4.52L20.16,9.6a.08.08,0,0,1,.09,0l6.44,3.72a6,6,0,0,1-.9,10.81V16.56A1.06,1.06,0,0,0,25.25,15.67Zm2.68-4-.19-.12-6.36-3.7a1,1,0,0,0-1.05,0l-7.78,4.49V9.2a.09.09,0,0,1,0-.09L19,5.4a6,6,0,0,1,8.91,6.21ZM11.08,17.15,8.38,15.6a.14.14,0,0,1-.05-.08V8.1a6,6,0,0,1,9.84-4.61L18,3.6,11.61,7.28a1,1,0,0,0-.53.91ZM12.54,14,16,12l3.47,2v4L16,20l-3.47-2Z" />
              </svg>
              <span class="text-lg">AI</span>
            </router-link>
          </li>
          <li class="mb-2">
            <router-link to="/profile" active-class="bg-base-400">
              <svg class="h-6 w-6" t="1677319653999" viewBox="0 0 1024 1024" version="1.1"
                xmlns="http://www.w3.org/2000/svg" p-id="6923" width="48" height="48">
                <path d="M272 322.389333a240 237.056 0 1 0 480 0 240 237.056 0 1 0-480 0Z" fill="#200E32" opacity=".4"
                  p-id="6924"></path>
                <path
                  d="M895.573333 796.842667c0.213333-3.413333 0.213333-6.784 0-10.154667a91.434667 91.434667 0 0 0-10.410666-35.84c-23.338667-45.568-88.746667-66.218667-143.317334-77.909333-38.954667-8.106667-78.506667-13.312-118.314666-15.616l-41.685334-3.114667H441.856l-41.642667 3.114667c-39.808 2.304-79.36 7.509333-118.314666 15.616-54.613333 10.112-119.978667 31.146667-143.36 77.909333a91.434667 91.434667 0 0 0-10.368 35.84c-0.213333 3.413333-0.213333 6.784 0 10.154667-0.213333 3.370667-0.213333 6.741333 0 10.112 1.109333 12.373333 4.821333 24.405333 10.837333 35.456 23.338667 45.610667 88.746667 66.261333 143.317333 77.952 38.997333 7.68 78.506667 12.928 118.314667 15.573333l41.642667 2.730667h139.989333l41.685333-2.730667a926.165333 926.165333 0 0 0 118.314667-15.573333c54.570667-10.538667 119.978667-31.146667 143.317333-77.952 5.717333-11.392 9.258667-23.68 10.410667-36.224a76.202667 76.202667 0 0 0-0.426667-9.386667z"
                  fill="#200E32" p-id="6925"></path>
              </svg>
              <span class="text-lg">Profile</span>
            </router-link>
          </li>
        </ul>
      </div>
      <div
        class="sticky bottom-0  z-20 hidden items-center gap-2 bg-base-200 bg-opacity-90 px-4 py-2 backdrop-blur lg:flex">
        <router-link to="/profile" class="flex h-12 items-center justify-center gap-2 pr-6">
          <div class="placeholder avatar">
            <div class="w-8 rounded-full bg-primary-focus text-primary-content">
              <span class="text-sm">AA</span>
            </div>
          </div>
          <span>user name</span>
        </router-link>
      </div>

    </aside>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped></style>