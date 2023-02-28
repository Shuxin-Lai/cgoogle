import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// style
import '@/assets/styles/tailwind.css'
import '@/assets/styles/index.css'
import 'vue-toastification/dist/index.css'
import { provideAppToast } from './toast'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(provideAppToast)

app.mount('#app')
