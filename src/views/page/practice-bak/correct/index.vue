<template>
  <div class="practice">
    <Header title="实验批改" :pathData="pathData" />
    <div class="flex-end practice-submit">
      <el-button type="primary" @click="submit">提交</el-button>
    </div>

    <div v-for="(item, i) in items" :key="item.id">
      <template v-if="item.beDefault === 0 && item.beValid">
        <div class="item-title">{{ item.itemName }}</div>
        <div class="practice-item flex-between">
          <div class="item-left">
            <!-- {{ host + item.defaultPath }} -->
            <div class="flex-start">
              <div class="task-upload-url flex-start">
                <div v-if="!item.urlArr || !item.urlArr.length" class="flex-center task-no-data">当前实验未提交</div>
                <div class="url-wrap" v-for="(url, urlIdx) in item.urlArr" :key="url">
                  <el-image v-if="isImageURL(url)" style="width: 178px; height: 178px" :src="url" :zoom-rate="1.2"
                    :max-scale="7" :min-scale="0.2" :preview-src-list="[url]" :initial-index="4" fit="cover" />
                  <div class="file-msg flex-center" v-else>
                    <div>
                      <div class="file-name">格式：{{ getFileExtensionFromUrl(url) }}</div>
                      <el-button v-if="getFileExtensionFromUrl(url) === 'pdf'"
                        @click="lock(url || host + '/static/' + item.defaultPath)">查看</el-button>
                      <el-button v-else
                        @click="download((url || host + '/static/' + item.defaultPath), item.itemName)">下载</el-button>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 不是批改才显示上传 -->
              <div class="task-upload" v-if="type != 'homeworkCorrecting'">
                <el-upload :action="action" :data="data" :show-file-list="false"
                  :on-success="(response, file) => handleAvatarSuccess(response, file, item)">
                  <!-- <img v-if="imageUrl" :src="imageUrl" class="avatar" /> -->
                  <el-icon class="avatar-uploader-icon">
                    <Plus />
                  </el-icon>
                </el-upload>
              </div>
            </div>
          </div>

          <div class="item-right">
            <el-checkbox-group v-model="item.check" :min="0" @change="handleCheck($event, item)">
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
            <div class="flex-between" style="margin: 10px 0 15px 0;">
              <el-button type="text" style="margin-right: 8px;">总分:</el-button>
              <el-input style="width: 60px;" disabled v-model="item.score"></el-input>
              <el-button type="text" style="margin-right: 8px;">得分:</el-button>
              <el-input style="width: 60px;" disabled v-model="item.goal"></el-input>
            </div>
            <div class="flex-center" style="margin-bottom: 10px;" v-for="(v, idx) in taskData" :key="idx">
              <el-button type="text" style="margin-right: 8px;">{{ v.name }}</el-button>
              <el-input-number @change="handleScore($event, item)" v-model="item[v.value]" :min="0" :max="item.score" />
            </div>
          </div>
        </div>
      </template>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, toRaw } from "vue";
import { useRouter } from 'vue-router'
import { studentCorrect, studentSave } from '@/api/practice/index.ts'
import { host } from "@/utils/request.js";
import { getFileExtensionFromUrl, isImageURL, downloadFile } from '@/utils/index.js'
import { ElMessage, ElMessageBox } from "element-plus";
import Header from '@/views/page/components/header/index.vue'

const router = useRouter()
const { currentRoute } = router
const route = currentRoute.value
const stuId = route.query.sid
const practiceId = route.query.pid
const type = route.query.type

const taskData = [
  {
    name: '报告格式:',
    value: 'format'
  },
  {
    name: '报告字数:',
    value: 'num'
  },
  {
    name: '结构合理:',
    value: 'structure'
  },
  {
    name: '内容充实:',
    value: 'content'
  }
]

const items = ref([])

const pathData = [
  {
    name: '实验管理',
    path: '/homes/courseteacherhome/exam/experimental/labmangt'
  },
  {
    name: '实验学生列表',
    path: '/homes/courseteacherhome/exam/experimental/student',
    query: {
      id: route.query.id,
      privilege: route.query.privilege,
    }
  },
  {
    name: '实验批改',
    path: ''
  },
]

onMounted(() => {
  getStudentCorrect()
})

const handleCheck = (val, item) => {
  const total = item.score ?? 0
  const values = val.length > 1 ? [val[val.length - 1]] : val
  item.check = values
  const currentTotal = Math.floor(total * values)
  const averageScore = Math.floor(currentTotal / 4)
  const finalScore = currentTotal - averageScore * 3
  taskData.forEach((f, i) => {
    item[f.value] = taskData.length === i + 1 ? finalScore : averageScore
  })
  console.log('taskData', taskData)
  // 得分
  item.goal = 0
  taskData.forEach((f) => {
    if (item[f.value]) {
      item.goal+=item[f.value]
    }
  })
}

const changeGoal = (item) => {
  item.goal = 0
  taskData.forEach((f) => {
    if (item[f.value]) {
      item.goal+=item[f.value]
    }
  })
}

const handleScore = (val, item) => {
  // console.log('handleScore', val, item)
  changeGoal(item)
}

const lock = (url) => {
  window.open(url)
}

const download = (url, name) => {
  downloadFile(url, name)
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
    const correctMap = {}
    items.value.forEach((item) => {
      if (item.urlArr && item.urlArr.length) {
        const itemTotal = []
        taskData.forEach((t) => {
          itemTotal.push(item[t.value] ?? 0)
        })
        correctMap[item.id] = itemTotal
      } else {
        correctMap[item.id] = [0, 0, 0, 0]
      }
    })
    studentSave({
      correctMap,
      stuId, 
      practiceId
    }).then(res => {
      if (res.code === '200') {
        ElMessage.success('提交成功')
        router.back(-1)
      }
    })
  }).catch(() => { })
}

const getStudentCorrect = () => {
  studentCorrect({ stuId, practiceId }).then(res => {
    console.log('res', res)
    if (res.code === '200') {
      items.value = res?.data?.items
      const answerMap = res?.data?.stu?.answerMap
      // 内容回显
      if (answerMap) {
        items.value?.forEach((item) => {
          if (item.beDefault === 0 && answerMap[item.id]) {
            item.urlArr = answerMap[item.id]?.map((url) => {
              return host + '/static/' + url
            })
          }
          taskData.forEach((f) => {
            item[f.value] = 0
          })
          item.goal = 0
        })
      }
      console.log('items', items)
    }
  })
}
//   const greeting = "Hello, Vue 3!";
</script>

<style scoped>
.practice-submit {
  margin-top: 10px;
}
.practice {
  background: #fff;
  padding: 0 10px 10px 10px;
  text-align: left;
  font-size: 13px;
  box-sizing: border-box;
}

.practice-item {
  margin-bottom: 10px;
}

.item-title {
  margin-bottom: 10px;
  border-bottom: 1px solid rgba(116, 116, 116, 0.543);
  font-size: 14px;
  font-weight: bold;
}

.item-left {
  width: 100%;
}

.item-right {
  width: 220px;
}

.task-upload-url {
  width: 100%;
  height: 178px;
}

.task-no-data {
  width: 100%;
}

.url-wrap {
  margin-right: 10px;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #d9d9d9;
}

.file-msg {
  width: 178px;
  height: 178px;
  text-align: center;
}

.file-name {
  font-size: 15px;
  font-weight: bold;
  margin-bottom: 10px;
}
</style>