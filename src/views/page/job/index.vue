<template>
    <div class="task-list">
      <Header title="我的作业" :pathData="pathData" />
      <div class="flex-start task-title">
        <span>已布置作业：{{ summaryMsg?.publishTimes ?? '0' }}次</span>
        <span>已完成作业：{{ summaryMsg?.finishedTimes ?? '0' }}次</span>
        <span>完成度：{{ convertToPercentage(summaryMsg?.finishedPercent ?? 0) }}</span>
      </div>
      <!-- 作业列表 -->
      <el-table ref="multipleTableRef" :data="tableData" style="width: 100%;margin-top: 10px;" @selection-change="handleSelectionChange">
        <el-table-column type="index" label="序号" width="80" />
        <el-table-column property="title" label="名称" />
        <el-table-column property="submitTime" label="上传时间" />
        <el-table-column property="status" label="状态">
          <template #default="scope">
             {{ ['未交卷', '已交卷', '已批改'][scope.row.status] ?? '' }}
          </template>
        </el-table-column>
        <el-table-column property="address" label="操作">
          <template #default="scope">
            <el-button
              type="text"
              v-if="scope.row.status === 0"
              @click="(() => {
                router.push({
                  path: '/homes/studenthome/exam/jobAnswer',
                  query: {
                    id: scope.row.testId,
                    type: 'edit'
                  }
                })
              })"
            >
                答题
            </el-button>
            <el-button
              v-else
              type="text"
              @click="(() => {
                router.push({
                  path: '/homes/studenthome/exam/jobAnswer',
                  query: {
                    id: scope.row.testId,
                    type: 'view'
                  }
                })
              })"
            >
                查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination flex-end">
        <el-pagination v-model:currentPage="params.pageIndex" v-model:page-size="params.pageSize"
          :page-sizes="[10, 20, 30, 40]" layout="total, sizes, prev, pager, next, jumper" :total="total"
          @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { ElTable } from 'element-plus'
  import { jobList, answerSummary } from '@/api/job.js'
  import Header from '@/views/page/components/header/index.vue'
  const router = useRouter()
  const { currentRoute } = router
  const route = currentRoute.value
  const tableData = ref([])
  const summaryMsg = ref({})
  const total = ref(0)
  const params = ref({
    pageIndex: 1,
    pageSize: 20
  })
  const pathData = [
    {
      name: '我的作业',
      path: ''
    }
  ]
  onMounted(() => {
    getJobList()
    getAnswerSummary()
  })

  const handleSizeChange = (val) => {
    params.value.pageSize = val
    getJobList()
  }

  const handleCurrentChange = (val) => {
    params.value.pageIndex = val
    getJobList()
  }

  const convertToPercentage = (number) => {
    return (number * 100).toFixed(2) + '%';
  }
  
  const getJobList = () => {
    jobList(params.value).then(res => {
      if (res.code === '200') {
        tableData.value = res.data.data
        total.value = res?.data?.recordSize ?? 0
      }
    })
  }

  const getAnswerSummary = () => {
    answerSummary().then(res => {
      if (res.code === '200') {
        summaryMsg.value = res.data
      }
    })
  }
  </script>
  
  <style scoped>
  .task-list {
    background: #fff;
    padding: 0 10px 10px 10px;
    font-size: 13px;
    height: 100%;
    box-sizing: border-box;
  }
  .task-title {
    margin: 10px 0;
    span {
      margin-right: 20px;
    }
  }
  .pagination {
    margin-top: 10px;
  }
  </style>