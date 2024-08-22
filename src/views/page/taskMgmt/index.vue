<template>
  <div class="test-list-wrap">
    <Header title="试卷列表" />

    <header class="flex-between" style="margin: 10px 0;">
      <div class="flex-start">
        <span class="task-term">学期</span>
        <el-select v-model="termId" placeholder="Select" style="width: 240px">
          <el-option @change="handleTerm" v-for="item in termList" :label="item.termname" :value="item.id"></el-option>
        </el-select>
      </div>

      <div>
        <template v-if="!(privilege === 'read')">
          <el-button @click="del" type="danger">批量删除</el-button>
          <!-- <el-button @click="download">下载所有成绩</el-button> -->
          <el-button @click="addTask" type="primary">新建作业</el-button>
        </template>
      </div>
    </header>

    <el-table ref="multipleTableRef" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column property="name" label="名称" />
      <el-table-column property="createTime" label="创建时间" />
      <el-table-column fixed="right" label="操作" width="200">
        <template #default="scope">
          <div class="flex-start table-btn-wrap">
            <el-button 
              type="text" 
              @click="(() => {
                router.push({
                  path: '/homes/courseteacherhome/exam/test/taskMgmt/view',
                  query: {
                    id: scope.row.id,
                    privilege
                  }
                })
              })"
            >
              预览
            </el-button>

            <el-button v-if="[1, 2].includes(scope.row.status)" @click="(() => {
              router.push({
                path: '/homes/courseteacherhome/exam/test/taskList',
                query: {
                  id: scope.row.id,
                  privilege
                }
              })
            })" type="text">
              查看学生
            </el-button>

            <template v-if="!(privilege === 'read')">
              <el-button type="text" @click="copy(scope.row.id)">
                复制
              </el-button>

              <el-button v-if="[0, 1].includes(scope.row.status)" type="text" @click="edit(scope.row.id)">
                编辑
              </el-button>

              <el-button v-if="[0].includes(scope.row.status)" @click="publish(scope.row.id)" type="text">
                发布作业
              </el-button>

              <el-button v-if="[0, 1].includes(scope.row.locked)" @click="lock(scope.row)" type="text">
                {{ scope.row.locked ? '解锁' : '锁定' }}
              </el-button>

              <el-button v-if="[0, 1].includes(scope.row.status)" type="text" @click="del(scope.row)">
                删除
              </el-button>

              <!-- <el-button v-if="[2].includes(scope.row.status)" @click="unlock(scope.row.id)" type="text">
                解锁
              </el-button> -->
            </template>
          </div>

        </template>
      </el-table-column>
    </el-table>

    <div class="pagination flex-end">
      <el-pagination v-model:currentPage="params.pageIndex" v-model:page-size="params.pageSize"
        :page-sizes="[10, 20, 30, 40]" layout="total, sizes, prev, pager, next, jumper" :total="total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>

    <!-- 无权限显示 -->
    <NoAccessPermission v-if="privilege === 'none'" />

    <New ref="newRef" @save="() => {
      params.pageIndex = 1
      getTaskList()
    }" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElTable, ElMessage, ElMessageBox } from 'element-plus'
import { taskList, getTermAll, queFormDel, taskCopy, taskPublish, taskLock, taskUnlock, courseLiWR } from '@/api/taskMgmt.js'
import Header from '@/views/page/components/header/index.vue'
import New from './components/new/index.vue'
import NoAccessPermission from '@/views/page/components/noAccessPermission/index.vue'

const router = useRouter()
const newRef = ref(null)
const multipleTableRef = ref()
const termId = ref('')
const termList = ref([])
const tableData = ref([])
const delIds = ref([])
const total = ref(0)
const params = ref({
  pageIndex: 1,
  pageSize: 20,
  termId: ''
})
const privilege = ref('')
const getWR = () => {
  courseLiWR().then(res => {
    if (res.code === '200') {
      privilege.value = res.data
    }
  })
}

onMounted(() => {
  _getTermAll()
  getWR()
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

const publish = (id) => {
  taskPublish(id).then(res => {
    if (res.code === '200') {
      ElMessage.success('发布成功')
      getTaskList()
    }
  })
}

const lock = (row) => {
  const api = row.locked ? taskUnlock : taskLock
  api(row.id).then(res => {
    if (res.code === '200') {
      ElMessage.success(row.locked ? '解锁成功' : '锁定成功')
      getTaskList()
    }
  })
}

const unlock = (id) => {
  taskUnlock(id).then(res => {
    if (res.code === '200') {
      ElMessage.success('解锁成功')
      getTaskList()
    }
  })
}

const edit = (id) => {
  router.push({
    path: '/homes/courseteacherhome/exam/test/tpAssembly',
    query: {
      id
    }
  })
}

const _getTermAll = () => {
  getTermAll().then(res => {
    if (res.code === '200') {
      // 
      termList.value = res.data?.filter((item) => item.iscurrentterm === '1')
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
  taskList(params.value).then(res => {
    if (res.code === '200') {
      tableData.value = res?.data?.data
      total.value = res?.data?.recordSize
    }
  })
}

const handleSizeChange = (val) => {
  params.value.pageSize = val
  getTaskList()
  console.log(`${val} items per page`)
}

const handleCurrentChange = (val) => {
  params.value.pageIndex = val
  getTaskList()
  console.log(`current page: ${val}`)
}

const del = (row) => {
  let ids = []
  if (row.id) ids.push(row.id)
  if (delIds.value.length) ids = delIds.value
  if (!ids.length) return
  ElMessageBox.confirm(
    '确认删除此试卷吗?',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    queFormDel(ids).then(res => {
      if (res.code === '200') {
        ElMessage({
          type: 'success',
          message: '删除成功',
        })
        getTaskList()
      }
    })
  })
}

const download = () => {

}

const addTask = () => {
  if (newRef.value) newRef.value.init()
}

const handleSelectionChange = (val) => {
  console.log('val', val)
  delIds.value = val.map((item) => item.id)
}
</script>
<style scoped>
.test-list-wrap {
  background: #fff;
  padding: 10px;
  border-radius: 10px;
  position: relative;
  box-sizing: border-box;
  height: 100%;
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
.table-btn-wrap {
  flex-wrap: wrap;
  button {
    padding-left: 0 !important;
    margin-left: 0 !important;
    margin-right: 5px !important;
  }
}
</style>
