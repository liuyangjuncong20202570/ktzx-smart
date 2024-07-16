<template>
  <!-- 预览 -->
  <div class="task-view">
    <Header title="作业预览" />

     <div class="view-title flex-between">
      <span>
        当前作业：  作业一

        所属课程： 单片机

        所属课堂： 吴老师课堂
      </span>
      <div>
        <el-button type="primary">编辑</el-button>
      </div>
    </div>

    <div class="topic-item">
      <div class="topic-kwa">
        <!-- v-for="(kwa, kwaIdx) in course.kwas" :key="kwaIdx" -->
        <span style="margin-right: 20px">kwa</span>
      </div>
      <div>
        <span class="flex-start">
          <!-- v-model="course.isChecked" -->
          <span class="topic-title">title</span>
        </span>
        <!-- v-for="(answer, answerIdx) in course.answers" :key="answerIdx" -->
        <div class="topic-answer-item">
          <!-- @change="handleSelectAll" -->
          <el-checkbox label=""></el-checkbox>A:7666
          <!-- {{ String.fromCharCode('A'.charCodeAt() + answerIdx) }}: {{ answer.itemContent }} -->
          <span>标准答案</span>
        </div>
        <div class="flex-start task-grade">
          <span>分数：</span> <el-input style="width: 60px;"></el-input>
        </div>
      </div>
      <div class="topic-item-icon flex-between">
        <el-icon @click="del(course)">
          <Delete />
        </el-icon>
      </div>
    </div>
  </div>
</template>

<script setup>
import Header from '@/views/page/components/header/index.vue'

</script>
<style scoped>
.task-view {
  text-align: left;
  margin: 10px 0;
  border-bottom: 1px solid #a9a9a9;
  padding-bottom: 10px;
  position: relative;

  .topic-title {
    font-size: 14px;
  }

  .topic-item-icon {
    position: absolute;
    right: 10px;
    bottom: 10px;
    width: 60px;
    font-size: 18px;
    color: #103ccc;
  }

  .topic-answer-item {
    font-size: 14px;

    span {
      font-size: 12px;
      margin-left: 8px;
      color: #409eff;
    }
  }

  .task-grade {
    font-size: 12px;
  }
}

.view-title {
  margin-top: 10px;
}
</style>