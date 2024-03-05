import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import {createPinia} from 'pinia'
import blurOnClick from './utils/tinytools/blur-on-click.js'

const pinia = createPinia();
createApp(App).use(router).use(pinia).use(ElementPlus).directive('blur-on-click', blurOnClick).mount('#app')

