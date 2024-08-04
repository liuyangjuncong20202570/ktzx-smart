<!-- 作业答题 -->
<template>
    <!-- 预览 -->
    <div class="task-view">
      <Header title="作业答题" />
      <div class="task-title flex-between">
        <div class="flex-start task-msg">
          <span>当前作业: {{ taskDetail.name }}</span>
          <!-- <span>所属课程: {{ taskDetail.classname ?? '无' }}</span> -->
          <span>所属课堂: {{ taskDetail.classroomName }}</span>
        </div>
        <div class="total-score">
          <p v-if="scoreObj.total">满分：{{ scoreObj.total }}</p>
          <p v-if="scoreObj.fullMarks">总分：{{ scoreObj.fullMarks }}</p>
        </div>
        <div v-if="taskDetail && taskDetail?.items?.length && !disabled">
          <el-button @click="save">保存</el-button>
          <el-button @click="submit">交卷</el-button>
        </div>
      </div>
      <div v-if="!taskDetail?.items?.length" class="flex-center">暂无数据</div>
      <div v-for="(item, i) in taskDetail?.items" :key="i">
        <TaskItem :index="i+1" type="job" :disabled="disabled" :defaultValue="item.lib" />
      </div>
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { ElMessage } from 'element-plus'
  import Header from '@/views/page/components/header/index.vue'
  import TaskItem from '@/views/page/components/taskItem/index.vue'
  import { answerDetail, answerSave, answerSubmit } from '@/api/job.js'
  import { TOPICTYPE } from '@/utils/consts.js'
  const routes = useRouter()
  const { currentRoute } = routes
  const route = currentRoute.value
  const id = route.query?.id
  const type = route.query?.type
  const disabled = ref(type === 'edit' ? false : true)
  const taskDetail = ref([])
  const scoreObj = ref({
    total: 0,
    fullMarks: 0,
  })
  onMounted(() => {
    answerDetail(id).then(res => {
      if (res.code === '200' && res.data) {
        taskDetail.value = res.data
        const answerMap = res.data?.answerMap
        const correctMap = res.data?.correctMap
        console.log('answerMap', answerMap)
        scoreObj.value.total = res.data?.totalScore
        taskDetail.value?.items?.forEach((item) => {
            // 得到总分
            if (correctMap) {
              if (correctMap[item.lib.id]) {
                scoreObj.value.fullMarks+=correctMap[item.lib.id]
                item.lib.currentScore = correctMap[item.lib.id]
              }
            }
            let value = null
            if (answerMap) value = answerMap[item.lib.id]
            // 填空题逻辑额外处理
            if (TOPICTYPE[item.lib.questionTypeId] === '填空题') {
                const contentItems = item.lib.content.split(/___/)
                let newContent = ''
                item.lib.selectId = []
                contentItems.forEach((content, idx) => {
                  newContent+=content
                  if (idx < contentItems.length-1) {
                    item.lib.selectId.push(item.id+idx)
                    newContent += `<input id="${item.id+idx}" ${disabled.value ? 'disabled' : ''} value="${value ? value[idx] : ''}" />`
                  }
                })
                item.lib.content = newContent
                console.log('item.lib', item.lib)
            } else if (answerMap) {
              if (TOPICTYPE[item.lib.questionTypeId] === '多选题') {
                item.lib.selectId = value && value.length ? value : []
              }else {
                item.lib.selectId = value ? value[0] : ''
              }
            }
        })
        console.log('taskDetail.value', taskDetail.value)
      }
    })
  })

  const itemMaps = () => {
    // 过滤出填写的答案
    let itemMap = {}
    for(let i = 0; i < taskDetail.value?.items.length; i++) {
      const item = taskDetail.value?.items[i]
      // if (!item.lib.selectId) {
      //   return ElMessage.error(`请填写题${i+1}答案!`)
      // }
      if (item.lib.questionTypeId === '0204') {
          let value = []
          item.lib.selectId.forEach((input) => {
            const elValue = document.getElementById(input).value || ''
            value.push(elValue)
          })
          itemMap = {
            ...itemMap,
            [item.lib.id]: value
          }
      } else {
        itemMap = {
          ...itemMap,
          [item.lib.id]: Array.isArray(item.lib.selectId) ? item.lib.selectId : [item.lib.selectId]
        }
      }
    }
    return itemMap
  }
  const save = () => {
    const params = {
      itemMap: itemMaps(),
      testId: id
    }
    console.log(params)
    answerSave(params).then(res => {
      if (res.code === '200') {
        ElMessage.success('保存成功')
      }
    })
  }
  const submit = () => {
    const params = {
      itemMap: itemMaps(),
      testId: id
    }
    answerSubmit(params).then(res => {
      if (res.code === '200') {
        ElMessage.success('提交成功')
        routes.push('/homes/studenthome/exam/myhomework')
      }
    })
  }
  </script>
  <style scoped>
  .task-view {
    text-align: left;
    /* border-bottom: 1px solid #a9a9a9; */
    padding-bottom: 10px;
    position: relative;
    background: #fff;
    padding: 10px;
    border-radius: 8px;
    color: #000000;
    height: 100%;
    box-sizing: border-box;
  }
  .task-title {
    font-size: 13px;
    margin: 10px 0;
  }
  .task-msg span {
    margin-right: 20px;
  }
  </style>