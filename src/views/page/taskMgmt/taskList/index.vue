<template>
  <div class="task-list">
    <Header title="作业学生列表" :pathData='pathData' />
    <div class="flex-end" style="margin-top: 10px;" v-if="tableData && tableData.length">
      <el-button type="danger" :icon="Download" @click="download">成绩下载</el-button>
    </div>
    <!-- 作业列表 -->
    <el-table ref="multipleTableRef" :data="tableData" style="width: 100%;margin-top: 10px;" @selection-change="handleSelectionChange">
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column property="stuNo" label="学号" />
      <el-table-column property="userName" label="姓名" />
      <el-table-column property="status" label="状态">
        <template #default="scope">
           <span class="task-status" :style="`background:${statusColors[scope.row.status]}`"></span>
        </template>
      </el-table-column>
      <el-table-column property="totalScore" label="总评成绩" />
      <el-table-column property="address" label="操作" v-if="!(privilege === 'read')">
        <template #default="scope">
          <span v-if="scope.row.status === 0">--</span>
          <el-button
            type="text"
            size="small"
            v-if="scope.row.status === 1"
            @click="(() => {
              routes.push({
                path: '/homes/courseteacherhome/exam/test/assignGrading',
                query: {
                  testId: scope.row.testId,
                  stuId: scope.row.stuId,
                  type: 'edit',
                  ...route.query
                }
              })
            })"
          >
            批改
          </el-button>

          <el-button
            type="text"
            size="small"
            v-if="scope.row.status === 2"
            @click="(() => {
              routes.push({
                path: '/homes/courseteacherhome/exam/test/assignGrading',
                query: {
                  testId: scope.row.testId,
                  stuId: scope.row.stuId,
                  type: 'view',
                  ...route.query
                }
              })
            })"
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
import { studentList, studentDownload } from '@/api/taskMgmt.js'
import Header from '@/views/page/components/header/index.vue'
import { downloadFile } from '@/utils/index'
import { host } from '@/api/host.js'
const routes = useRouter()
const { currentRoute } = routes
const route = currentRoute.value
const id = route.query.id
const privilege = route.query?.privilege
const tableData = ref([])
const statusColors = ['red', '#169bd5' ,'#169bd5']

const pathData = [
  {
    name: '作业管理',
    path: '/homes/courseteacherhome/exam/test/testmangt'
  },
  {
    name: '作业学生列表',
    path: ''
  },
]

onMounted(() => {
  getStudentList()
})

const download = () => {
  const testId = tableData.value[0].testId
  studentDownload(testId).then(res => {
    if (res.code === '200') {
      downloadFile(host + '/static/' + res.data, '成绩单')
      ElMessage.success('下载成功')
    }
  })
}

const getStudentList = () => {
  studentList(id).then(res => {
    if (res.code === '200') {
      tableData.value = res.data
      // totalScore
      tableData.value.forEach((item) => {
        if (item.totalScore == null) item.totalScore = '--'
      })
    }
  })
}

</script>

<style scoped>
.task-list {
  background: #fff;
  padding: 0 10px 10px 10px;
}
.task-status {
  border-radius: 50%;
  display: inline-block;
  width: 15px;
  height: 15px;
}
</style>