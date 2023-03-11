import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// style
import '@/assets/styles/tailwind.css'
import '@/assets/styles/index.scss'
import 'vue-toastification/dist/index.css'
import { provideAppToast } from './toast'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCircleQuestion } from '@fortawesome/free-regular-svg-icons'

/* import specific icons */
import { faBars, faXmark, faFill } from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(faCircleQuestion, faBars, faXmark, faFill)

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)
app.use(createPinia())
app.use(router)
app.use(provideAppToast)

app.mount('#app')
