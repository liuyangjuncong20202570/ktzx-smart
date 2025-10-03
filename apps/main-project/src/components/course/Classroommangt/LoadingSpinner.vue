<template>
  <div class="loading">
    <img src="@/assets/images/loading.gif" alt="" />
    <div class="cover"></div>
  </div>
</template>

<script setup></script>

<style lang="less" scoped>
.loading {
  height: 500px;
  // border: 1px solid red;
  position: relative;
  img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 255px;
    z-index: 1000;
  }
  .cover {
    position: absolute;
    width: 1080px;
    height: 500px;
    z-index: 999;
    background-color: rgba(15, 12, 12, 0.5);
  }
}
</style>
