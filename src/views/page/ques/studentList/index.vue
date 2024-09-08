<template>
  <div class="task-list">
    <Header title="问卷学生列表" :pathData="pathData" />
    <!-- 作业列表 -->
    <el-table ref="multipleTableRef" :data="tableData" style="width: 100%;margin-top: 10px;" @selection-change="handleSelectionChange">
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column property="stuNo" label="学号" />
      <el-table-column property="userName" label="姓名" />
      <el-table-column property="status" label="状态">
        <template #default="scope">
           <span :style="`color:${statusColors[scope.row.status]}`">{{ ['未完成', '已完成'][scope.row.status] }}</span>
        </template>
      </el-table-column>
      <el-table-column property="address" label="操作">
        <template #default="scope">
          <el-button
            v-if="scope.row.status === 1"
            type="text"
            size="small"
            @click="() => {
              routes.push({
                path: '/homes/courseteacherhome/exam/view',
                query: {
                  type: 'student',
                  qfId: scope.row.qfId,
                  stuId: scope.row.userId,
                  ...route.query
                }
              })
            }"
          >
            查看
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
import { queStudentList } from '@/api/ques.js'
import Header from '@/views/page/components/header/index.vue'
const routes = useRouter()
const { currentRoute } = routes
const route = currentRoute.value
const id = route.query.id
const tableData = ref([])
const statusColors = ['red', '#169bd5' ,'#169bd5']
const pathData = [
  {
    name: '问卷列表',
    path: '/homes/courseteacherhome/exam/questionnaire'
  },
  {
    name:  '问卷学生列表',
    path: ''
  }
]
onMounted(() => {
  getStudentList()
})

const getStudentList = () => {
  queStudentList(id).then(res => {
    if (res.code === '200') {
      tableData.value = res.data
    }
  })
}


</script>

<style scoped>
.task-list {
  background: #fff;
  padding: 0 10px 10px 10px;
  height: 100%;
  box-sizing: border-box;
}
</style>