import { createApp } from 'vue'
import router from "../router";
import ElementPlus from 'element-plus'
import App from './App.vue'

import 'element-plus/dist/index.css'
import './style.css'

const app = createApp(App)

app.use(router).use(ElementPlus).mount('#app')
