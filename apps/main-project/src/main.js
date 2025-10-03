import { createApp, provide } from 'vue';
import './custom.css';
import './style.css';
import App from './App.vue';
import router from './router/index.js';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import { createPinia } from 'pinia';
import blurOnClick from './directives/blur-on-click.js';
import { clickOutside } from './directives/clickOutside.js';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import './assets/css/global.css';
import * as Icons from '@element-plus/icons-vue';
//-------------vxeTable
// 完整导入 UI 组件库
import VxeUI from 'vxe-pc-ui';
import 'vxe-pc-ui/lib/style.css';
// 完整导入 表格库
import VxeUITable from 'vxe-table';
import 'vxe-table/lib/style.css';
import VxeUIPluginExportXLSX from '@vxe-ui/plugin-export-xlsx';
import ExcelJS from 'exceljs';
//---------------------
// pinia持久化插件
import piniaPersist from 'pinia-plugin-persist';
// 进度条样式库
import 'nprogress/nprogress.css';
// 注册cue-echarts
import Echarts from 'vue-echarts';
import * as echarts from 'echarts';
import { use } from 'echarts/core';
import 'echarts-wordcloud';
import 'echarts/theme/shine.js';

// 引入Echarts模块
// canvas渲染器，必传
import { CanvasRenderer } from 'echarts/renderers';
// echarts基本组件
import {
  TooltipComponent,
  GridComponent,
  LegendComponent,
  TitleComponent
} from 'echarts/components';
// 引入所需组件
import { RadarChart } from 'echarts/charts';
import useHistory from './stores/useHistory.js';

use([CanvasRenderer, TooltipComponent, GridComponent, LegendComponent, TitleComponent, RadarChart]);

const pinia = createPinia();
pinia.use(piniaPersist);
const app = createApp(App);

app.component('v-chart', Echarts);
app.config.globalProperties.$echarts = echarts;
// 注册每个图标组件
Object.keys(Icons).forEach(key => {
  app.component(key, Icons[key]);
});

VxeUI.use(VxeUIPluginExportXLSX, {
  ExcelJS
});

app
  .use(router)
  .use(pinia)
  .use(ElementPlus, { locale: zhCn })
  .use(VxeUI)
  .use(VxeUITable)
  .directive('blur-on-click', blurOnClick)
  .directive('click-outside', clickOutside)
  .mount('#app');

const historyStore = useHistory();

document.documentElement.classList.toggle('dark', historyStore.nowUsr);
