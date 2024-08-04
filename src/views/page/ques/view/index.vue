<template>
    <div class="stu-ques-list">
      <Header title="问卷预览" />
      <div 
        v-if="!detailObj?.topics?.length" 
        class="flex-center" 
        style="margin-top: 10px;"
      >暂无数据</div>
      <div class="ques-item-wrap" v-for="(item, i) in detailObj.topics" :key="i">
        <QueItem :row="item" :disabled="disabled"  />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { queFormDetail, queStudentDetail } from '@/api/ques.js'
  import Header from '@/views/page/components/header/index.vue'
  import QueItem from '@/views/page/components/queItem/index.vue'
  import { TOPICTYPE } from '@/utils/consts.js'
  const router = useRouter()
  const { currentRoute } = router
  const route = currentRoute.value
  const { id, qfId, stuId, type } = route.query
  console.log('route.query', route.query)
  const disabled = true
  const detailObj = ref({})

  onMounted(() => {
    getMyQueFormDetail()
  })

  const getMyQueFormDetail = () => {
    const api = type === 'student' ? queStudentDetail : queFormDetail
    const params = type === 'student' ? { qfId, stuId } : id
    api(params).then(res => {
      if (res.code === '200') {
        detailObj.value = res.data
        const answerMap = res.data.answerMap
        console.log('answerMap', answerMap)
        detailObj.value?.topics?.forEach((item) => {
            let value = null
            if (answerMap) value = answerMap[item.id]
            // 填空题逻辑额外处理
            if (TOPICTYPE[item.typeId] === '填空题') {
                const contentItems = item.content.split(/___/)
                let newContent = ''
                item.selectId = []
                contentItems.forEach((content, idx) => {
                  newContent+=content
                  if (idx < contentItems.length-1) {
                    item.selectId.push(item.id+idx)
                    newContent += `<input id="${item.id+idx}" ${disabled ? 'disabled' : ''} value="${value ? value[idx] ?? '' : ''}" />`
                  }
                })
                item.content = newContent
                console.log('item.lib', item)
            } else if (answerMap) {
              if (TOPICTYPE[item.typeId] === '多选题') {
                item.selectId = value && value.length ? value : []
              }else {
                item.selectId = value ? value[0] : ''
              }
            }
        })
      }
    })
  }
  </script>
  
  <style scoped>
  .stu-ques-list {
    background: #fff;
    padding: 10px;
    border-radius: 8px;
    font-size: 13px;
    height: 100%;
    box-sizing: border-box;
  }
  .ques-item-wrap {
    margin-top: 10px;
  }
  </style>