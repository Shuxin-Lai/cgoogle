import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import WorkspaceView from '@/views/Workspaces/_id.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name: 'home',
      path: '/',
      component: HomeView,
    },
    {
      name: 'workspace',
      path: '/workspaces/:id',
      component: WorkspaceView,
    },
  ],
})

export default router
