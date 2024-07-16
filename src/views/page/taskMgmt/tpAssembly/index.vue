<template>
  <!-- 试题组卷 -->
  <div class="course-type">
    <Header title="试题组卷" />
    <div class="task-msg">
      <div class="flex-start task-name">
        <span>作业名称</span>
        <el-input style="width: 200px;"></el-input>
        <el-button style="margin-left: 10px;">搜索</el-button>
      </div>

      <div class="flex-start">
        <span>总分</span> <el-input style="width: 60px;"></el-input>
      </div>
    </div>

    <div class="cpirse-lib-btn flex-between">
      <el-checkbox label="全选" @change="handleSelectAll"></el-checkbox>
      <div>
        <el-button type="danger" @click="batchDel">批量删除</el-button>
        <el-button type="primary">保存</el-button>
      </div>
    </div>

    <vuedraggable class="" v-model="image.list" @start="drag = true" @end="drag = false" item-key="index">
      <template #item="{ element, index }">
        <div class="topic-item">
          <div class="topic-kwa">
            <!-- v-for="(kwa, kwaIdx) in course.kwas" :key="kwaIdx" -->
            <span style="margin-right: 20px">kwa</span>
          </div>
          <div>
            <span class="flex-start">
              <!-- v-model="course.isChecked" -->
              <el-checkbox label=""></el-checkbox>
              <span class="topic-title">title</span>
            </span>
            <!-- v-for="(answer, answerIdx) in course.answers" :key="answerIdx" -->
            <div class="topic-answer-item">
              A:7666
              <!-- {{ String.fromCharCode('A'.charCodeAt() + answerIdx) }}: {{ answer.itemContent }} -->
              <span>标准答案</span>
            </div>
            <div class="flex-start task-grade">
              <span>分数：</span> <el-input style="width: 60px;"></el-input>
            </div>
          </div>
          <div class="topic-item-icon flex-between">
            <el-icon @click="del(course)">
              <Delete />
            </el-icon>
          </div>
        </div>
      </template>
    </vuedraggable>


    <div style="margin-top: 20px">
      <el-button @click="toggleSelection(typeList)">Clear selection</el-button>
      <el-button @click="save()">保存</el-button>
    </div>
  </div>
</template>

<script setup>
import vuedraggable from "vuedraggable"
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElTable, ElMessage } from 'element-plus'
import { Edit, DocumentCopy, Delete } from '@element-plus/icons-vue'
import { courseLibTypeList, courseLibTypeSetStatus } from '@/api/courseLib.js'
import Header from '@/views/page/components/header/index.vue'
onMounted(() => {
  getCourseLibTypeList()
})

let drag = ref(false)
let image = reactive({
  list: ['1', '2', '3']
})

const multipleTableRef = ref()
const multipleSelection = ref([])
const typeList = ref([])

const toggleSelection = (rows) => {
  if (rows) {
    rows.forEach((row) => {
      if (row.status) {
        multipleTableRef.value?.toggleRowSelection(row, undefined)
      }
    })
  } else {
    multipleTableRef.value?.clearSelection()
  }
}
const handleSelectionChange = (val) => {
  console.log('val', val)
  multipleSelection.value = val
}

const getCourseLibTypeList = () => {
  courseLibTypeList().then(res => {
    if (res.code === '200') {
      typeList.value = res?.data
      console.log('multipleTableRef', multipleTableRef)
      nextTick(() => {
        toggleSelection(typeList.value)
      })
    }
  })
}

const del = () => {

}

const save = () => {
  const selectionRows = multipleTableRef.value?.getSelectionRows()
  const queTypeIds = selectionRows.map((item) => item.queTypeId)
  const params = typeList.value.map((item) => {
    const { queTypeId } = item
    const flag = queTypeIds.indexOf(item.queTypeId) !== -1
    return {
      queTypeId,
      status: flag ? 1 : 0
    }
  })
  courseLibTypeSetStatus(params).then(res => {
    if (res.code === '200') {
      ElMessage.success('设置成功')
      getCourseLibTypeList()
    }
  })
}

</script>
<style scoped>
.course-type {
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
</style>
