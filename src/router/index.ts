import { createRouter, createWebHistory } from 'vue-router'
import WorkspaceView from '@/views/Workspaces/_id.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name: 'home',
      path: '/',
      // component: HomeView,
      redirect: '/workspaces/0/writer',
    },
    {
      name: 'workspace',
      path: '/workspaces/:id',
      component: WorkspaceView,
      // beforeEnter: (a, b, n) => {
      //   const path = b.path
      //   console.log('path： jj' + path)
      //   n()
      // },
      children: [
        {
          name: 'writer',
          path: 'writer',
          component: () => import('@/views/Workspaces/id/Writer.vue'),
        },
        {
          name: 'chat',
          path: 'chat',
          component: () => import('@/views/Workspaces/id/Chat.vue'),
        },
        {
          name: 'Code',
          path: 'Code',
          component: () => import('@/views/Workspaces/id/Code.vue'),
        },
      ],
    },
  ],
})

export default router
