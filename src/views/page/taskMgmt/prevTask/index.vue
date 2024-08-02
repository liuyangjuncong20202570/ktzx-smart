<template>
  <div class="test-list-wrap">
    <Header title="往届作业" />

    <header class="flex-between" style="margin: 10px 0;">
      <div class="flex-start">
        <span class="task-term">学期</span>
        <el-select v-model="termId" placeholder="Select" style="width: 240px">
          <el-option @change="handleTerm" v-for="item in termList" :label="item.termname" :value="item.id"></el-option>
        </el-select>
      </div>
    </header>

    <el-table ref="multipleTableRef" :data="tableData" style="width: 100%">
      <el-table-column type="index" label="序号" width="55" />
      <el-table-column property="name" label="名称" />
      <el-table-column property="createTime" label="创建时间" />
      <el-table-column fixed="right" label="操作">
        <template #default="scope">
          <el-button type="text" size="small" @click="(() => {
            router.push({
              path: '/page/taskMgmt/view',
              query: {
                id: scope.row.id
              }
            })
          })">
            预览
          </el-button>

          <el-button type="text" size="small" @click="copy(scope.row.id)">
            复制
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
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElTable, ElMessage } from 'element-plus'
import { taskList, getTermAll, taskCopy, prevPager } from '@/api/taskMgmt.js'
import Header from '@/views/page/components/header/index.vue'

const router = useRouter()
const multipleTableRef = ref()
const termId = ref('')
const termList = ref([])
const tableData = ref([])
const total = ref(0)
const params = ref({
  pageIndex: 1,
  pageSize: 20,
  termId: ''
})

onMounted(() => {
  _getTermAll()
})

const copy = (id) => {
  taskCopy(id).then(res => {
    if (res.code === '200') {
      ElMessage.success('复制成功')
      params.pageIndex = 1
      getTaskList()
    }
  })
}

const _getTermAll = () => {
  getTermAll().then(res => {
    if (res.code === '200') {
      // 
      termList.value = res.data?.filter((item) => item.iscurrentterm === '0')
      if (termList?.value?.length) {
        // 默认展示第一个学期
        termId.value = termList.value[0].id
        getTaskList()
      }
      console.log('termList.value', termList)
    }
  })
}

const handleTerm = (termId) => {
  termId.value = termId
  getTaskList()
}

const getTaskList = () => {
  params.value.termId = termId.value
  prevPager(params.value).then(res => {
    if (res.code === '200') {
      tableData.value = res?.data?.data
      total.value = res?.data?.recordSize
    }
  })
}

const handleSizeChange = (val) => {
  params.value.pageSize = val
  console.log(`${val} items per page`)
}

const handleCurrentChange = (val) => {
  params.value.pageIndex = val
  console.log(`current page: ${val}`)
}
</script>
<style scoped>
.test-list-wrap {
  background: #fff;
  padding: 10px;
  border-radius: 10px;
}

.pagination {
  margin-top: 10px;
}

.task-term {
  font-size: 14px;
  margin-right: 5px;
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
