<template>
  <img class="responsive-img" src="@/assets/images/redraw-images/empty.png" alt="" />
</template>

<script setup>
import { ElMessage } from 'element-plus';
import { onMounted } from 'vue';
/* ********************变量定义******************** */
// props定义
// 普通变量
// pinia状态管理

/* ********************方法定义******************** */
onMounted(() => {});
</script>

<style lang="less" scoped>
.responsive-img {
  max-width: 100%; /* 避免溢出容器 */
  height: auto; /* 保持宽高比例 */
  display: block; /* 避免底部空隙 */
  margin: 0 auto; /* 可选：居中 */
}
</style>
