<template>
  <div class="test-list-wrap">
    <Header title="问卷列表" />

    <header class="flex-end" style="margin: 10px 0;">

      <div>
        <el-button @click="del" type="danger">批量删除</el-button>
        <!-- <el-button @click="download">下载所有成绩</el-button> -->
        <el-button @click="addTask" type="primary">新建问卷</el-button>
      </div>
    </header>

    <el-table ref="multipleTableRef" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column property="name" label="名称" />
      <el-table-column property="createTime" label="创建时间" />
      <el-table-column fixed="right" label="操作">
        <template #default="scope">
          <el-button type="text" size="small" @click="(() => {
            router.push({
              path: '/page/ques/view',
              query: {
                id: scope.row.id
              }
            })
          })">
            预览
          </el-button>

          <el-button 
            v-if="[1, 2].includes(scope.row.status)" 
            type="text" size="small" 
            @click="(() => {
              router.push({
                path: '/page/ques/studentList',
                query: {
                  id: scope.row.id
                }
              })
            })">
            查看学生
          </el-button>

          <el-button v-if="[0].includes(scope.row.status)" type="text" size="small" @click="publish(scope.row.id)">
            发布
          </el-button>

          <el-button type="text" size="small" @click="edit(scope.row.id)">
            编辑
          </el-button>

          <el-button type="text" size="small" @click="del(scope.row)">
            删除
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
import { ElTable, ElMessage, ElMessageBox } from 'element-plus'
import { queFormPager, queFormDel } from '@/api/ques.js'
import Header from '@/views/page/components/header/index.vue'

const router = useRouter()
const newRef = ref(null)
const multipleTableRef = ref()
const tableData = ref([])
const delIds = ref([])
const total = ref(0)
const params = ref({
  pageIndex: 1,
  pageSize: 20,
})

onMounted(() => {
  getQuesList()
})

const publish = () => {

}

const edit = (id) => {
  router.push({
    path: '/page/ques/edit',
    query: {
      id
    }
  })
}

const getQuesList = () => {
  queFormPager(params.value).then(res => {
    if (res.code === '200') {
      tableData.value = res?.data?.data
      total.value = res?.data?.recordSize
    }
  })
}

const handleSizeChange = (val) => {
  params.value.pageSize = val
  getQuesList()
  console.log(`${val} items per page`)
}

const handleCurrentChange = (val) => {
  params.value.pageIndex = val
  getQuesList()
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
        getQuesList()
      }
    })
  })
}

const download = () => {

}

const addTask = () => {
  router.push('/page/ques/edit')
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
