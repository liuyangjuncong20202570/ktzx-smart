<template>
  <!-- 试题组卷 -->
  <div class="tpAssembly-type">
    <Header title="试题组卷" />
    <div class="task-msg">
      <div class="flex-start task-name">
        <span>作业名称</span>
        <el-input v-model="taskName" style="width: 200px;"></el-input>
        <el-button type="primary" style="margin-left: 10px;" @click="openSearch">添加题目</el-button>
      </div>

      <div class="flex-start task-name">
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
              <span style="font-size: 13px;">{{index+1}}、</span>
              <span class="topic-title">{{ element.lib.title }}({{ TOPICTYPE[element.lib.questionTypeId] }})</span>
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
            <el-icon title="上移" @click="(() => {
              if (index !== 0) {
                swapArrayElements(taskList, index, index - 1)
              }
            })">
              <Top :style="index === 0 ? 'color: #c8c9cb;' : ''" />
            </el-icon>
            <el-icon title="下移" @click="(() => {
              if (index !== taskList.length - 1) {
                swapArrayElements(taskList, index, index + 1)
              }
            })">
              <Bottom :style="index === taskList.length - 1 ? 'color: #c8c9cb;' : ''" />
            </el-icon>
            <el-icon @click="del(element)">
              <Delete />
            </el-icon>
          </div>
        </div>
      </template>
    </vuedraggable>

    <!-- 无权限显示 -->
    <NoAccessPermission v-if="privilege === 'none'" />
    <Search ref="searchRef" @save="(() => {
      getPreviewDetail()
    })" />
  </div>
</template>

<script setup>
import vuedraggable from "vuedraggable"
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Top, Bottom, Delete } from '@element-plus/icons-vue'
// import { courseLibTypeSetStatus } from '@/api/courseLib.js'
import { previewDetail, taskSave, taskdel, courseLiWR } from '@/api/taskMgmt.js'
import Header from '@/views/page/components/header/index.vue'
import Search from './components/search/index.vue'
import NoAccessPermission from '@/views/page/components/noAccessPermission/index.vue'
import { swapArrayElements } from '@/utils/index.js'
import { TOPICTYPE } from '@/utils/consts.js'

const router = useRouter()
const route = router.currentRoute.value
let drag = ref(false)
const searchRef = ref(null)
const taskList = ref([])
const taskName = ref('')
const total = ref(0)
const privilege = ref('')
const getWR = () => {
  courseLiWR().then(res => {
    if (res.code === '200') {
      privilege.value = res.data
    }
  })
}
const openSearch = () => {
  if (searchRef.value) searchRef.value.init()
}
onMounted(() => {
  getWR()
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
      res.data?.items.forEach((item) => {
        // 设置默认勾选值
        item.checkbox = false
      })
      taskList.value = res.data?.items
    }
  })
}

const del = (row) => {
  const data = {
    paperId: route.query.id,
    libIds: [row.lib.id]
  }
  _taskdel(data, '确认要删除此题目吗?')
}

const allDel = () => {
  const selectTask = taskList.value?.filter((item) => item.checkbox)
  const data = {
    paperId: route.query.id,
    libIds: selectTask?.map((item) => item.lib.id)
  }
  if (!selectTask?.length) return ElMessage.error('请勾选要删除的题目')
  _taskdel(data, '确定删选中的题目?')
}

const _taskdel = (data, title) => {
  ElMessageBox.confirm(
    title,
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
      router.push('/homes/courseteacherhome/exam/test/testmangt')
    }
  })
  console.log('data', data)
}

</script>
<style scoped>
.tpAssembly-type {
  text-align: left;
  background: #fff;
  padding: 0 10px 10px 10px;
  position: relative;
  color: #000000;
  height: 100%;
  box-sizing: border-box;
}

.task-msg {
  margin-top: 10px;
  width: 400px;
}

.task-msg span {
  font-size: 14px;
  width: 70px;
  text-align: left;
}

.task-name {
  color: #000000;
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
    font-weight: bold;
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
  font-size: 13px;
  margin-right: 10px;
}
</style>
