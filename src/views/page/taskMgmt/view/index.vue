<template>
  <!-- 预览 -->
  <div class="task-view">
    <Header title="作业预览" />
    <div class="task-title flex-between">
      <div class="flex-between task-msg">
        <span>当前作业: {{ taskDetail.name }}</span>
        <span>所属课程: {{ taskDetail.classname }}</span>
        <span>所属课堂: {{ taskDetail.classname }}</span>
      </div>
      <el-button>编辑</el-button>
    </div>
    <div v-if="!taskDetail?.items?.length">暂无数据</div>
    <div v-for="(item, i) in taskDetail?.items" :key="i">
      <TaskItem disabled="true" :defaultValue="item.lib" />
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
const taskDetail = ref([])
onMounted(() => {
  previewDetail(id).then(res => {
    if (res.code === '200') {
      taskDetail.value = res.data
    }
  })
})
</script>
<style scoped>
.task-view {
  text-align: left;
  margin: 10px 0;
  /* border-bottom: 1px solid #a9a9a9; */
  padding-bottom: 10px;
  position: relative;
  background: #fff;
  padding: 10px;
  border-radius: 8px;
}
.task-title {
  font-size: 13px;
  margin: 10px 0;
}
.task-msg {
  min-width: 400px;
}
</style>