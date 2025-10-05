<script setup></script>

<template>
  <div class="container">
    <!--<button @click="handleClick">点击跳转</button>-->
    <router-view />
  </div>
</template>

<style lang="less" scoped>
.container {
  background-color: #fff;
  height: 100vh;
  min-width: 100vw !important;
}
</style>
