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
      <div class="assign-content">
        <div class="task-item" v-for="(item, i) in taskList" :key="i">
          <span class="task-kwa" v-for="kwa in item.lib.kwas" :key="item.id">({{ kwa.kwaName }})</span>
          <div class="task-title">{{i+1}}、{{ item.lib.title }}</div>
          <div class="task-select flex-between" v-if="['单选题', '多选题', '判断题'].includes(TOPICTYPE[item.lib.questionTypeId])">
            <div>
              <div class="flex-start" v-for="(answer, answerIdx) in item.lib.answers" :key="answer.id">
                <span>{{ String.fromCharCode('A'.charCodeAt() + answerIdx) }}:{{ answer.itemContent }}</span>
                <span v-if="answer.isAnswer">(正确答案)</span>
                <span>(学生答案)</span>
              </div>
            </div>
            <div class="task-score">
              <el-button type="text" style="margin-right: 8px;">本题得分:</el-button> <el-input style="width: 60px;"></el-input>
            </div>
          </div>

          <div class="task-select flex-between" v-if="['简答题'].includes(TOPICTYPE[item.lib.questionTypeId])">
            <el-input
              style="width: 400px"
              :autosize="{ minRows: 4, maxRows: 6 }"
              type="textarea"
            />
            <div class="task-score">
              <el-button type="text" style="margin-right: 8px;">本题得分:</el-button> <el-input style="width: 60px;"></el-input>
            </div>
          </div>

          <div class="task-select flex-between" v-if="['填空题'].includes(TOPICTYPE[item.lib.questionTypeId])">
            <div v-html="item.lib.content"></div>
            <div>
              <el-checkbox-group>
                <el-checkbox value="Online activities" name="type">
                  A
                </el-checkbox>
                <el-checkbox value="Promotion activities" name="type">
                  B
                </el-checkbox>
                <el-checkbox value="Offline activities" name="type">
                  C
                </el-checkbox>
                <el-checkbox value="Simple brand exposure" name="type">
                  D
                </el-checkbox>
              </el-checkbox-group>
              <div class="flex-center" style="margin-bottom: 10px;">
                <el-button type="text" style="margin-right: 8px;">本题得分:</el-button> <el-input-number value="0" :min="0" :max="999" @change="handleChange" />
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
  import { correctDetail } from '@/api/taskMgmt.js'
  import Header from '@/views/page/components/header/index.vue'
  import { TOPICTYPE } from '@/utils/consts.js'
  const routes = useRouter()
  const { currentRoute } = routes
  const route = currentRoute.value
  const testId = route.query.testId
  const stuId = route.query.stuId

  const taskList = ref([])
  onMounted(() => {
    getCorrectDetail()
  })
  
  const getCorrectDetail = () => {
    correctDetail({ testId, stuId }).then(res => {
      if (res.code === '200') {
        taskList.value = res?.data?.items || []
        console.log('taskList.value',  taskList.value)
      }
    })
  }
  </script>
  
  <style scoped>
  .assign-wrap {
    height: 100%;
    border-radius: 8px;
    background: #fff;
    padding: 10px;
    text-align: left;
    font-size: 13px;
  }
    .assign-title {
      padding: 10px 0;
    }

    .task-kwa {
      margin-right: 10px;
    }

    .task-item {
      margin-bottom: 10px;
      border-bottom: 1px solid #ebeef5;
    }

    .task-score {
      height: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

  </style>