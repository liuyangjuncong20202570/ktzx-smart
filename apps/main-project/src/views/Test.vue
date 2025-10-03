<template>
  <div :class="'div' + (index + 1)" class="title" v-for="(item, index) in lists">
    div{{ index }}
  </div>
</template>

<script setup>
import intro from '../utils/introConfigure';
import introJs from 'intro.js';
import { nextTick, onMounted } from 'vue';
const lists = [0, 1, 2, 3];
const guide = () => {
  intro.setOptions({
    steps: [
      {
        element: '.div1', // 定位到相应的元素位置，如果不设置element，则默认展示在屏幕中央
        title: 'Welcome', // 标题
        intro: 'Hello World! 👋' // 内容
      },
      {
        element: '.div2',
        intro: '有关如何配置/自定义该项目的指南和方法，请查看vue-cli文档。'
      },
      {
        element: '.div3',
        intro: '已安装的cli插件'
      },
      {
        element: '.div4',
        intro: '基本链接'
      }
    ]
  });

  nextTick(() => {
    intro.start();
  });
};
onMounted(() => {
  nextTick(() => {
    guide();
  });
});
</script>

<style lang="less" scoped>
// :deep(.introjs-tooltip) {
//   background-color: #4caf50 !important; /* 修改背景色 */
//   color: #ffffff !important; /* 修改文字颜色 */
//   font-size: 16px !important; /* 修改字体大小 */
//   border-radius: 10px !important; /* 修改圆角 */
//   padding: 15px !important; /* 修改内边距 */
// }
.customTooltip * {
  color: #4a4a4a;
  background-color: #fff;
  font-size: 18px;
  .introjs-tooltipbuttons {
    background-color: #0064b0 !important;
  }
}
</style>
