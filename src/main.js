
// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './assets/fonts.css'

// PrimeVue
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura' 

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset:Aura
  }
} )
app.mount('#app')
