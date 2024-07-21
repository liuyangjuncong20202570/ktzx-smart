<template>
  <div class="task-list">
    <Header title="作业学生列表" />
    <!-- 作业列表 -->
    <el-table ref="multipleTableRef" :data="tableData" style="width: 100%;margin-top: 10px;" @selection-change="handleSelectionChange">
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column property="stuNo" label="学号" />
      <el-table-column property="userName" label="姓名" />
      <el-table-column property="status" label="状态" />
      <el-table-column property="totalScore" label="总评成绩" />
      <el-table-column property="address" label="操作">
        <template #default="scope">
          <el-button
            type="text"
            size="small"
          >
            批改
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElTable, ElMessage, ElMessageBox } from 'element-plus'
import { studentList } from '@/api/taskMgmt.js'
import Header from '@/views/page/components/header/index.vue'
const { currentRoute } = useRouter()
const route = currentRoute.value
const tableData = ref([])
onMounted(() => {
  getStudentList()
})

const getStudentList = () => {
  studentList(route.query.id).then(res => {
    if (res.code === '200') {
      tableData.value = res.data
    }
  })
}


</script>

<style scoped>
.task-list {
  background: #fff;
  padding: 10px;
  border-radius: 8px;
}
</style>