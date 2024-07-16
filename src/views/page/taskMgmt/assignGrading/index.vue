<template>
  <!-- 作业批改页面 -->
    <div class="assign-wrap">
      <Header title="作业批改" /> 

      <div class="flex-between assign-title">
        <div class="flex-start">
          <span>总分:</span>
          <el-input style="width: 60px;"></el-input>
        </div>
        <div>
          <el-button>自动批改</el-button>
          <el-button>保存</el-button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import Header from '@/views/page/components/header/index.vue'
//   const greeting = "Hello, Vue 3!";
  </script>
  
  <style scoped>
  .assign-wrap {
    height: 100%;
    border-radius: 8px;
    background: #fff;
    padding: 10px;
  }
    .assign-title {
      padding: 10px 0;
    }
  </style>