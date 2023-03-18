import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// style
import '@/assets/styles/tailwind.css'
import '@/assets/styles/index.scss'
import '@/assets/styles/external_bymd.scss'
import 'vue-toastification/dist/index.css'

import { provideAppToast } from './toast'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faCircleQuestion,
  faListAlt,
  faNoteSticky,
  faPaperPlane,
  faUser,
} from '@fortawesome/free-regular-svg-icons'

/* import specific icons */
import {
  faBars,
  faXmark,
  faFill,
  faPenToSquare,
  faList,
  faTableCells,
  faBook,
  faEyeDropperEmpty,
} from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(
  faListAlt,
  faCircleQuestion,
  faBars,
  faXmark,
  faFill,
  faPenToSquare,
  faList,
  faTableCells,
  faBook,
  faEyeDropperEmpty,
  faPaperPlane,
  faUser,
)

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)
app.use(createPinia())
app.use(router)
app.use(provideAppToast)

app.mount('#app')
