<!-- 问卷列表 --><template>
    <div class="task-list">
      <Header title="问卷列表" />
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
              size="small"
              v-if="scope.row.status === 0"
              @click="(() => {
                router.push({
                  path: '/homes/studenthome/exam/jobAnswer',
                  query: {
                    id: scope.row.testId
                  }
                })
              })"
            >
                答题
            </el-button>
            <el-button
              v-else
              type="text"
              size="small"
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
  import { queFormList } from '@/api/job.js'
  import Header from '@/views/page/components/header/index.vue'
  const router = useRouter()
  const { currentRoute } = router
  const route = currentRoute.value
  const tableData = ref([])
  const params = ref({
    pageIndex: 1,
    pageSize: 20
  })
  onMounted(() => {
    getQueFormList()
  })
  
  const getQueFormList = () => {
    queFormList(params.value).then(res => {
      if (res.code === '200') {
        tableData.value = res.data.data
      }
    })
  }
  
  
  </script>
  
  <style scoped>
  .task-list {
    background: #fff;
    padding: 0 10px 10px 10px;
  }
  </style>