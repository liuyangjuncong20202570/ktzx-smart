import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import {createPinia} from 'pinia'
import blurOnClick from './directives/blur-on-click.js'
import {clickOutside} from './directives/clickOutside.js'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import './assets/css/global.css'
import * as Icons from '@element-plus/icons-vue'

const pinia = createPinia();
const app = createApp(App);

// 注册每个图标组件
Object.keys(Icons).forEach(key => {
    app.component(key, Icons[key]);
});

app
    .use(router)
    .use(pinia)
    .use(ElementPlus, { locale: zhCn })
    .directive('blur-on-click', blurOnClick)
    .directive('click-outside', clickOutside)
    .mount('#app')
