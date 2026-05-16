
// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './assets/fonts.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// #region agent log
fetch('http://127.0.0.1:7609/ingest/322f40ec-eecc-4d15-bcb7-c465e2212b7c',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'20ebec'},body:JSON.stringify({sessionId:'20ebec',runId:'initial',hypothesisId:'A,B,C,D',location:'src/main.js:12',message:'main.js reached before Vue mount',data:{path:window.location.pathname},timestamp:Date.now()})}).catch(()=>{});
// #endregion

const app = createApp(App)
app.use(router)
app.mount('#app')
