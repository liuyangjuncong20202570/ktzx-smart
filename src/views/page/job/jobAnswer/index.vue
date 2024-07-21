<!-- 作业答题 -->
<template>
    <!-- 预览 -->
    <div class="task-view">
      <Header title="作业答题" />
      <div class="task-title flex-between">
        <div class="flex-between task-msg">
          <span>当前作业: {{ taskDetail.name }}</span>
          <span>所属课程: {{ taskDetail.classname }}</span>
          <span>所属课堂: {{ taskDetail.classname }}</span>
        </div>
        <el-button @click="test">编辑</el-button>
      </div>
      <div v-if="!taskDetail?.items?.length">暂无数据</div>
      <div v-for="(item, i) in taskDetail?.items" :key="i">
        <TaskItem :index="i+1" type="job" :disabled="false" :defaultValue="item.lib" />
      </div>
     
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import Header from '@/views/page/components/header/index.vue'
  import TaskItem from '@/views/page/components/taskItem/index.vue'
  import { answerDetail } from '@/api/job.js'
  const { currentRoute } = useRouter()
  const route = currentRoute.value
  const id = route.query?.id
  const taskDetail = ref([])
  onMounted(() => {
    answerDetail(route.query.id).then(res => {
      if (res.code === '200') {
        taskDetail.value = res.data
        taskDetail.value?.items.forEach((item) => {
            if (item.lib.questionTypeId === '0204') {
                const contentItems = item.lib.content.split('__').join('').split('')
                console.log('contentItems', contentItems)
                let newContent = ''
                item.lib.inputIds = []
                contentItems.forEach((content, idx) => {
                    if (content === '_') {
                        item.lib.inputIds.push(item.id+idx)
                        newContent += `<input id="${item.id+idx}" />`
                    } else {
                        newContent+=content
                    }
                })
                item.lib.content = newContent
                console.log('item.lib', item.lib)
            }
        })
      }
    })
  })
  const test = () => {
    taskDetail.value?.items.forEach((item) => {
        if (item.lib.questionTypeId === '0204') {
            item.lib.inputIds.forEach((input) => {
                console.log(document.getElementById(input).value)
            })
        }
    })
        console.log('taskDetail', taskDetail.value)
  }
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