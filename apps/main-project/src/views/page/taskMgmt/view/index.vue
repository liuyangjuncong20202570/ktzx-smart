<template>
  <!-- 预览 -->
  <div class="task-view">
    <Header title="作业预览" :pathData="pathData" />
    <div class="task-title flex-between">
      <div class="flex-between task-msg">
        <span>当前作业: {{ taskDetail.name }}</span>
        <!-- <span>所属课程: {{ taskDetail.classname }}</span>
        <span>所属课堂: {{ taskDetail.classname }}</span> -->
      </div>
    </div>
    <div v-if="!taskDetail?.items?.length" class="flex-center">暂无数据</div>
    <div v-for="(item, i) in taskDetail?.items" :key="i">
      <TaskItem :index="i+1" disabled="true" :defaultValue="item.lib" />
    </div>
   
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import Header from '@/views/page/components/header/index.vue'
import TaskItem from '@/views/page/components/taskItem/index.vue'
import { previewDetail } from '@/api/taskMgmt.js'
const { currentRoute } = useRouter()
const route = currentRoute.value
const id = route.query?.id
const privilege = route.query?.privilege
const taskDetail = ref([])

const pathData = [
  {
    name: '作业管理',
    path: '/homes/courseteacherhome/exam/test/testmangt'
  },
  {
    name: '作业预览',
    path: ''
  },
]

onMounted(() => {
  previewDetail(id).then(res => {
    if (res.code === '200') {
      taskDetail.value = res.data
      taskDetail.value.items.forEach(item => {
        item.lib.score = item.score ?? 0
      })
    }
  })
})
</script>
<style scoped>
.task-view {
  text-align: left;
  padding-bottom: 10px;
  position: relative;
  background: #fff;
  padding: 0 10px 10px 10px;
  height: 100%;
  box-sizing: border-box;
  color: #000000;
}
.task-title {
  font-size: 13px;
  margin: 10px 0;
}
.task-msg {
  font-family: MicrosoftYaHei;
font-size: 16px;
color: #1B1B1B;
}
</style>