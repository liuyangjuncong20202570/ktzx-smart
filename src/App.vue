<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
window.addEventListener('beforeunload', () => {
  sessionStorage.setItem('savedPath', router.currentRoute.value.fullPath);
  //   router.replace('/homes/superadminhome/sysmangt/schoolmangt');
});
const handleClick = () => {
  router.replace('/homes/superadminhome/sysmangt/schoolmangt');
};
onMounted(() => {
  const savedPath = sessionStorage.getItem('savedPath');
  console.log(savedPath);
  if (savedPath) {
    router.replace(savedPath);
    // sessionStorage.removeItem('savedPath'); // 恢复后删除存储的路径
  }
});
</script>

<template>
  <div class="container">
    <!--<button @click="handleClick">点击跳转</button>-->
    <router-view />
  </div>
</template>

<style lang="less" scoped>
.container {
  background-color: #fff;
  height: vh;
}
</style>
