<template>
    <div class="task-list">
      <Header title="我的实验" />
      <!-- 作业列表 -->
      <el-table ref="multipleTableRef" :data="tableData" style="width: 100%;margin-top: 10px;" @selection-change="handleSelectionChange">
        <el-table-column type="index" label="序号" width="80" />
        <el-table-column property="practiceName" label="名称" />
        <el-table-column property="answerTime" label="上传时间" />
        <el-table-column property="answerPercent" label="完成进度">
          <template #default="scope">
            
            {{ convertToPercentage(scope.row.answerPercent) }}
          </template>
        </el-table-column>
        <el-table-column property="status" label="状态">
          <template #default="scope">
             {{ ['未交卷', '已交卷', '已批改'][scope.row.status] ?? '' }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" property="address" label="操作">
          <template #default="scope">
            <el-button
              v-if="[1,2].includes(scope.row.status)"
              type="text"
              size="small"
              @click="(() => {
                router.push({
                  path: '/homes/studenthome/exam/submitPractice',
                  query: {
                    id: scope.row.practiceId,
                    type: 'view'
                  }
                })
              })"
            >
                查看
            </el-button>

            <el-button
              v-if="scope.row.status === 0"
              type="text"
              size="small"
              @click="(() => {
                router.push({
                  path: '/homes/studenthome/exam/submitPractice',
                  query: {
                    id: scope.row.practiceId,
                    type: 'edit'
                  }
                })
              })"
            >
                去提交
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
  import { practiceList } from '@/api/stuPractice.js'
  import Header from '@/views/page/components/header/index.vue'
  const router = useRouter()
  const { currentRoute } = router
  const route = currentRoute.value
  const tableData = ref([])
  const total = ref(0)
  const params = ref({
    pageIndex: 1,
    pageSize: 20
  })
  onMounted(() => {
    getPracticeList()
  })

  const handleSizeChange = (val) => {
    params.value.pageSize = val
    getPracticeList()
  }

  const handleCurrentChange = (val) => {
    params.value.pageIndex = val
    getPracticeList()
  }

  const convertToPercentage = (number) => {
    return (number * 100).toFixed(2) + '%';
  }
  
  const getPracticeList = () => {
    practiceList(params.value).then(res => {
      if (res.code === '200') {
        tableData.value = res.data.data
        total.value = res?.data?.recordSize ?? 0
      }
    })
  }
  </script>
  
  <style scoped>
  .task-list {
    background: #fff;
    padding: 0 10px 10px 10px;
    font-size: 13px;
  }
  .task-title {
    margin: 10px 0;
  }
  .pagination {
    margin-top: 10px;
  }
  </style>