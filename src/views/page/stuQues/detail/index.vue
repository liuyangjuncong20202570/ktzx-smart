<template>
    <div class="stu-ques-list">
      <Header title="问卷答题" />
      <div class="ques-title flex-between">
        <div>
          当前问卷：{{ detailObj.name }}
        </div>
        <button @click="submit">提交</button>
      </div>
      <div v-for="(item, i) in detailObj.topics" :key="i">
        <QueItem :row="item" :disabled="disabled"  />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted, nextTick } from 'vue'
  import { useRouter } from 'vue-router'
  import { ElTable, ElMessage, ElMessageBox } from 'element-plus'
  import { myQueFormDetail, myQueFormSubmit } from '@/api/stuQues.js'
  import Header from '@/views/page/components/header/index.vue'
  import QueItem from '@/views/page/components/queItem/index.vue'
  import { TOPICTYPE } from '@/utils/consts.js'
  const router = useRouter()
  const { currentRoute } = router
  const route = currentRoute.value
  const id = route.query.id
  const disabled = route.query.type === 'edit' ? false : true
  const detailObj = ref({})

  onMounted(() => {
    getMyQueFormDetail()
  })

  const getMyQueFormDetail = () => {
    myQueFormDetail(id).then(res => {
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
                    newContent += `<input id="${item.id+idx}" ${disabled ? 'disabled' : ''} value="${value ? value[idx] : ''}" />`
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

  const itemMaps = () => {
    // 过滤出填写的答案
    let itemMap = {}
    for(let i = 0; i < detailObj.value?.topics?.length; i++) {
      const item = detailObj.value?.topics[i]
      if (!item.selectId) {
        return ElMessage.error(`请填写题${i+1}答案!`)
      }
      if (item.typeId === '0204') {
          let value = []
          item.selectId.forEach((input) => {
            const elValue = document.getElementById(input).value || ''
            value.push(elValue)
          })
          itemMap = {
            ...itemMap,
            [item.id]: value
          }
      } else {
        itemMap = {
          ...itemMap,
          [item.id]: Array.isArray(item.selectId) ? item.selectId : [item.selectId]
        }
      }
    }
    return itemMap
  }

  const submit = () => {
    console.log(detailObj.value)
    console.log(itemMaps())
    const itemMap = itemMaps()
    console.log('itemMap', itemMap)
    // myQueFormSubmit({
    //   qfId: id,
    //   itemMap
    // }).then(res => {
    //   if (res.code === '200') {
    //     ElMessage.success('提交成功')
    //     router.push('/page/stuQues/list')
    //   }
    // })
  }

  </script>
  
  <style scoped>
  .stu-ques-list {
    background: #fff;
    padding: 10px;
    border-radius: 8px;
    font-size: 13px;
  }
  .ques-title {
    margin: 10px 0;
  }
  </style>