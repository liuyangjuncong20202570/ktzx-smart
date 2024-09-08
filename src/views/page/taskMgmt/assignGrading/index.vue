<template>
  <!-- 作业批改页面 -->
    <div class="assign-wrap">
      <Header :title="disabled ? '作业查看' : '作业批改'" /> 
      <div class="flex-between assign-title">
        <div class="flex-start">
          <span>总分：</span>
          <el-input disabled v-model="total" style="width: 60px;"></el-input>
        </div>
        <div v-if="!disabled">
          <el-button @click="auto">自动批改</el-button>
          <el-button @click="save">保存</el-button>
        </div>
      </div>
      <div class="assign-content">
        <div class="task-item" v-for="(item, i) in taskList" :key="i">
          <span class="task-kwa" v-for="kwa in item.lib.kwas" :key="item.id">({{ kwa.kwaName }})</span>
          <div class="task-title">{{i+1}}、{{ item.lib.title }}({{ TOPICTYPE[item.lib.questionTypeId] ?? '预留题' }})</div>
          <div class="flex-center total-score">本题总分：{{ item.score }}</div>
          <div v-html="item.lib.content"></div>
          <div class="task-select flex-between" v-if="['单选题', '多选题', '判断题'].includes(TOPICTYPE[item.lib.questionTypeId])">
            <div>
              <div class="flex-start" v-for="(answer, answerIdx) in item.lib.answers" :key="answer.id">
                <span>{{ String.fromCharCode('A'.charCodeAt() + answerIdx) }}&nbsp;:&nbsp;{{ answer.itemContent }}</span>
                <span v-if="answer.isAnswer" style="color: #409eff;">(正确答案)</span>
                <span v-if="answer.answer" style="color: #af9b0f;">(学生答案)</span>
              </div>
            </div>
            <div class="task-score">
              <el-button type="text" style="margin-right: 8px;">本题得分:</el-button> 
              <el-input-number :disabled="disabled" @change="handleScore($event, item)" v-model="item.lib.value" :min="0" :max="item.score" />
            </div>
          </div>

          <div class="task-select flex-between" v-else>
            <div>
              <el-input
                v-if="['简答题'].includes(TOPICTYPE[item.lib.questionTypeId])"
                style="width: 400px"
                :autosize="{ minRows: 4, maxRows: 6 }"
                type="textarea"
                v-model="item.lib.answer"
                disabled
              />
            </div>
            <div>
              <el-checkbox-group v-if="!disabled" :disabled="disabled" v-model="item.lib.check" @change="handleCheck($event, item)">
                <el-checkbox :label="1">
                  A
                </el-checkbox>
                <el-checkbox :label="0.8">
                  B
                </el-checkbox>
                <el-checkbox :label="0.6">
                  C
                </el-checkbox>
                <el-checkbox :label="0.4">
                  D
                </el-checkbox>
              </el-checkbox-group>
              <div class="flex-center" style="margin-bottom: 10px;">
                <el-button type="text" style="margin-right: 8px;">本题得分:</el-button> 
                <el-input-number :disabled="disabled" @change="handleScore($event, item)" v-model="item.lib.value" :min="0" :max="item.score" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { correctDetail, correctAuto, correctSubmit } from '@/api/taskMgmt.js'
  import Header from '@/views/page/components/header/index.vue'
  import { TOPICTYPE } from '@/utils/consts.js'
  import { ElMessage } from 'element-plus'
  const routes = useRouter()
  const { currentRoute } = routes
  const route = currentRoute.value
  const testId = route.query.testId
  const stuId = route.query.stuId
  const type = route.query.type
  const autoObj = ref({})
  const total = ref(0)
  const disabled = type === 'view' ? true : false

  const taskList = ref([])
  onMounted(() => {
    getCorrectDetail()
  })

  const scoreToatl = (type) => {
    total.value = 0
    taskList.value.forEach((item) => {
      // 根据返回值判断满分
      if (autoObj.value[item.lib?.id] && type === 'auto') {
        item.lib.value  = item.score
      }
      // 自动批改错误 && 没有老师写入值
      if (autoObj.value[item.lib?.id] === false && !item.lib.value) {
        item.lib.value  = 0
      }

      if (item.lib.value) total.value += Number(item.lib.value)
    })
  }
  const auto = () => {
    correctAuto({ testId, stuId }).then(res => {
      if (res.code === '200') {
        autoObj.value = res.data
        scoreToatl('auto')
        ElMessage.success('批改完成')
      }
    })
  }
  
  const getCorrectDetail = () => {
    correctDetail({ testId, stuId }).then(res => {
      if (res.code === '200') {
        taskList.value = res?.data?.items || []
        
        const answerMap = res.data.answerMap
        const correctMap = res.data.correctMap
        // 回显各项分数总分
        if (correctMap) {
          taskList.value.forEach((item) => {
            const score = correctMap[item.lib.id] ?? 0
            if (score) {
              total.value += score
            }
            item.lib.value  = score ? score : 0
          })
        }
        taskList.value.forEach((item) => {
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
                  newContent += `<input id="${item.id+idx}" disabled value="${value ?? value[idx]}" />`
                }
              })
              item.lib.content = newContent
              console.log('item.lib', item.lib)
          }

          if (answerMap) {
            if (['单选题', '多选题', '判断题'].includes(TOPICTYPE[item.lib.questionTypeId])) {
              const da = answerMap[item.lib.id] || []
              item.lib.answers?.forEach((a) => {
                if (da.indexOf(a.itemOption) !== -1) {
                  a.answer = true
                }
              })
            }

            if (['简答题'].includes(TOPICTYPE[item.lib.questionTypeId])) {
              item.lib.answer = answerMap[item.lib.id]
            }
          }
        })
        console.log('taskList.value',  taskList.value)
      }
    })
  }

  const handleScore = (val, item) => {
    console.log('handleScore', val, item)
    item.lib.value = val
    console.log('item.lib.value', item.lib.value)
    scoreToatl()
  }
  const handleCheck = (val, item) => {
    const values = val.length > 1 ? [val[val.length - 1]] : val
    item.lib.check = values
    item.lib.value = parseFloat((item.score * values[0]).toFixed(2))
    scoreToatl()
  }
  // 提交
  const save = () => {
    const scoreMap = {}
    taskList.value.map((item) => {
      scoreMap[item.lib.id] = Number(item.lib.value) ?? 0
    })

    correctSubmit({ scoreMap, testId, stuId }).then(res => {
      if (res.code === '200') {
        ElMessage.success('保存成功')
        routes.push('/homes/courseteacherhome/exam/test/testmangt')
      }
    })
  }
  </script>
  
  <style scoped>
  .assign-wrap {
    background: #fff;
    padding: 0 10px 10px 10px;
    text-align: left;
    font-size: 13px;
  }
    .assign-title {
      padding: 10px 0;
    }

    .task-kwa {
      margin: 0 10px 5px 0;
      display: inline-block;
    }

    .task-title {
      margin-bottom: 5px;
      font-size: 14px;
      font-weight: bold;
    }

    .task-item {
      padding-bottom: 10px;
      margin-bottom: 10px;
      border-bottom: 1px solid #ebeef5;
      position: relative;
    }

    .total-score {
      position: absolute;
      top: 10px;
      right: 10px;
    }

    .task-score {
      height: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

  </style>