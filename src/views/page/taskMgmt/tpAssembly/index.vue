<template>
  <!-- 试题组卷 -->
  <div class="course-type">
    <Header title="试题组卷" />
    <div class="task-msg">
      <div class="flex-start task-name">
        <span>作业名称</span>
        <el-input v-model="taskName" style="width: 200px;"></el-input>
        <el-button style="margin-left: 10px;" @click="openSearch">搜索</el-button>
      </div>

      <div class="flex-start">
        <span>总分</span> <el-input v-model="total" disabled style="width: 60px;"></el-input>
      </div>
    </div>

    <div class="cpirse-lib-btn flex-between">
      <el-checkbox label="全选" @change="handleSelectAll"></el-checkbox>
      <div>
        <el-button type="danger" @click="allDel">批量删除</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </div>
    </div>
    <div class="flex-center" v-if="!taskList?.length">暂无数据</div>
    <vuedraggable v-model="taskList" @start="drag = true" @end="drag = false" item-key="index">
      <template #item="{ element, index }">
        <div class="topic-item">
          <div class="topic-kwa">
            <span v-for="(kwa, kwaIdx) in element.lib.kwas" :key="kwaIdx" style="margin-right: 20px">
              {{ kwa.kwaName }}
            </span>
          </div>
          <div>
            <span class="flex-start">
              <el-checkbox v-model="element.checkbox" label=""></el-checkbox>
              <span class="topic-title">{{ element.lib.title }}</span>
            </span>
            <div v-html="element.lib.content"></div>
            <div v-for="(answer, answerIdx) in element.lib.answers" :key="answerIdx" class="topic-answer-item">
              {{ String.fromCharCode('A'.charCodeAt() + answerIdx) }}: {{ answer.itemContent }}
              <span v-if="answer.isAnswer">标准答案</span>
            </div>
            <div class="flex-start task-grade">
              <span>分数：</span> 
              <el-input v-model="element.score" @input="handleScore" style="width: 60px;" oninput="value=value.replace(/^0|[^0-9]/g,'')"></el-input>
            </div>
          </div>
          <div class="topic-item-icon flex-between">
            <el-icon @click="del(element)">
              <Delete />
            </el-icon>
          </div>
        </div>
      </template>
    </vuedraggable>

    <Search ref="searchRef" @save="(() => {
      getPreviewDetail()
    })" />
  </div>
</template>

<script setup>
import vuedraggable from "vuedraggable"
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Edit, DocumentCopy, Delete } from '@element-plus/icons-vue'
// import { courseLibTypeSetStatus } from '@/api/courseLib.js'
import { previewDetail, taskSave, taskdel } from '@/api/taskMgmt.js'
import Header from '@/views/page/components/header/index.vue'
import Search from './components/search/index.vue'
const { currentRoute } = useRouter()
const route = currentRoute.value

let drag = ref(false)
const searchRef = ref(null)
const taskList = ref([])
const taskName = ref('')
const total = ref(0)
const openSearch = () => {
  if (searchRef.value) searchRef.value.init()
}
onMounted(() => {
  console.log(route.query)
  getPreviewDetail()
})

const handleSelectAll = (val) => {
  taskList.value.forEach((item) => {
    item.checkbox = val
  })
}

const handleScore = () => {
  let num = 0
  taskList.value.forEach((item) => {
    if (item.score) {
      num += Number(item.score)
    }
  })
  total.value = num
}
 
const getPreviewDetail = () => {
  previewDetail(route.query.id).then(res => {
    if (res.code === '200') {
      total.value = res.data.totalScore
      taskName.value = res.data.name
      taskList.value = res.data?.items
    }
  })
}

const del = (row) => {
  const data = {
    paperId: route.query.id,
    libIds: [row.lib.id]
  }
  _taskdel(data)
}

const allDel = () => {
  const selectTask = taskList.value.filter((item) => item.checkbox)
  const data = {
    paperId: route.query.id,
    libIds: selectTask.map((item) => item.lib.id)
  }
  _taskdel(data)
}

const _taskdel = (data) => {
  ElMessageBox.confirm(
    '确认删除此试卷吗?',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    taskdel(data).then(res => {
      if (res.code === '200') {
        ElMessage.success('删除成功')
        getPreviewDetail()
      }
    })
  })
}

const save = () => {
  const questionDtos = taskList.value?.map((item) => {
    return {
      libId: item.lib.id,
      score: Number(item.score || 0)
    }
  })
  const data = {
    id: route.query.id,
    name: taskName.value,
    questionDtos
  }
  taskSave(data).then(res => {
    if (res.code === '200') {
      ElMessage.success('保存成功')
    }
  })
  console.log('data', data)
}

</script>
<style scoped>
.course-type {
  text-align: left;
  background: #fff;
  padding: 10px;
  border-radius: 10px;
}

.task-msg {
  margin-top: 10px;
  width: 400px;
}

.task-msg span {
  font-size: 14px;
  width: 100px;
  text-align: left;
}

.task-name {
  margin-bottom: 10px;
}

.topic-item {
  text-align: left;
  margin: 10px 0;
  border-bottom: 1px solid #a9a9a9;
  padding-bottom: 10px;
  position: relative;

  .topic-title {
    font-size: 14px;
  }

  .topic-item-icon {
    position: absolute;
    right: 10px;
    bottom: 10px;
    width: 60px;
    font-size: 18px;
    color: #103ccc;
  }

  .topic-answer-item {
    font-size: 14px;

    span {
      font-size: 12px;
      margin-left: 8px;
      color: #409eff;
    }
  }

  .task-grade {
    font-size: 12px;
  }
}

.topic-kwa {
  margin-right: 10px;
}
</style>
