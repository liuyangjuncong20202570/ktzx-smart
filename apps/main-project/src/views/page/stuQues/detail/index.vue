<template>
    <div class="stu-ques-list">
      <Header title="问卷答题" :pathData="pathData" />
      <div class="ques-title flex-between">
        <div>
          当前问卷：{{ detailObj.name }}
        </div>
        <el-button v-if="!disabled" type="primary" @click="submit">提交</el-button>
      </div>
      <div v-for="(item, i) in detailObj.topics" :key="i">
        <QueItem :row="item" :index="i" :disabled="disabled"  />
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

  const pathData = [
    {
      name: '问卷列表',
      path: '/homes/studentcourses/exam/myquestionnaire'
    },
    {
      name: route.query.type === 'view' ? '查看问卷' : '编辑问卷',
      path: ''
    }
  ]

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
                    newContent += `<input id="${item.id+idx}" ${disabled ? 'disabled' : ''} value="${value ? value[idx] ?? '' : ''}" />`
                  }
                })
                item.content = newContent
                console.log('item.lib', item)
            } else if (answerMap) {
              if (TOPICTYPE[item.typeId] === '多选题') {
                // 其他输入项
                const isOther = value?.map((valueItem) => {
                  if (valueItem.indexOf('other:') !== -1) {
                    return valueItem
                  }
                })[0] ?? ''
                if (value && isOther) {
                  item.other = isOther.split(':')[1]
                } else {
                  item.selectId = value && value.length ? value : []
                }
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
          [item.id]: (Array.isArray(item.selectId) || item.other) ? (item.other ? [`other:${item.other}`] : item.selectId) : [item.selectId]
        }
      }
    }
    return itemMap
  }

  const submit = () => {
    ElMessageBox.confirm(
      '确定提交吗?',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    ).then(() => {
      const itemMap = itemMaps()
      myQueFormSubmit({
        qfId: id,
        itemMap
      }).then(res => {
        if (res.code === '200') {
          ElMessage.success('提交成功')
          router.push('/homes/studentcourses/exam/myquestionnaire')
        }
      })
    }).catch(() => { })
  }

  </script>
  
  <style scoped>
  .stu-ques-list {
    background: #fff;
    padding: 0 10px 10px 10px;
    font-size: 13px;
    height: 100%;
    box-sizing: border-box;
  }
  .ques-title {
    margin: 10px 0;
    font-size: 16px;
  }
  </style>