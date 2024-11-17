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
  height: vh;
}
</style>
