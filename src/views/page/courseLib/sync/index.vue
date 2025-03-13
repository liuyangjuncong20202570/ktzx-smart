<template>
  <div class="course-lib-sync">
    <Header :pathData="pathData" title="题库同步" />
    <el-table ref="tableRef" class="custom-table" row-key="date" :data="tableData" style="width: 100%;margin-top: 20px;">
      <el-table-column type="index" width="50" />
      <el-table-column prop="address" label="题型">
        <template #default="scope">
          {{ TOPICTYPE[scope.row.questionTypeId] ?? '' }}
        </template>
      </el-table-column>
      <el-table-column prop="title" label="题目" />
      <el-table-column prop="address" label="状态">
        <template #default="scope">
          {{ ['草稿', '待审核', '入库', '弃用', '锁定'][scope.row.status] ?? '' }}
        </template>
      </el-table-column>
      <el-table-column prop="creator" label="上传人" />
      <el-table-column label="操作" width="180" filter-placement="bottom-end" v-if="!(privilege === 'read')">
        <template #default="scope">
          <el-button type="text" @click="reception(scope.row.id)">接收</el-button>
          <el-button type="text" @click="refuse(scope.row.id)">拒绝</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination flex-end">
      <!-- <el-pagination v-model:currentPage="params.pageIndex" v-model:page-size="params.pageSize"
        :page-sizes="[20, 30, 40]" layout="total, sizes, prev, pager, next, jumper" :total="total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" /> -->
      <Pagination v-if="total" :pageIndex="params.pageIndex" :pageSize="params.pageSize" :total="total" @update:pageIndex="handleCurrentChange" />
    </div>
    <!-- 无权限显示 -->
    <NoAccessPermission v-if="privilege === 'none'" />
  </div>

</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElTable, ElMessage, ElMessageBox } from 'element-plus'
import { courseLibSyncPager, syncAccept, syncReject, courseLibWR } from '@/api/courseLib.js'
import Header from '../../components/header/index.vue'
import Pagination from "@/views/page/components/pagination/index.vue";
import NoAccessPermission from '@/views/page/components/noAccessPermission/index.vue'
import { TOPICTYPE } from '@/utils/consts.js'

onMounted(() => {
  getCourseLibSyncPager()
  getCourseLibWR()
})

const params = ref({
  pageIndex: 1,
  pageSize: 20,
})
const tableRef = ref()
const total = ref(0)
const tableData = ref([])
const privilege = ref('')

const pathData = [
  {
    name: '题库同步',
    path: ''
  }
]

const getCourseLibWR = () => {
  courseLibWR().then(res => {
    if (res.code === '200') {
      privilege.value = res.data
    }
  })
}

const handleSizeChange = (val) => {
  params.value.pageSize = val
  getCourseLibSyncPager()
}

const handleCurrentChange = (val) => {
  params.value.pageIndex = val
  getCourseLibSyncPager()
}

const getCourseLibSyncPager = () => {
  courseLibSyncPager(params.value).then(res => {
    if (res.code === '200') {
      total.value = res?.data?.recordSize || 0
      tableData.value = res?.data?.data || []
    }
  })
}

const reception = (id) => {
  ElMessageBox.confirm(
    '确定接收吗?',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    syncAccept([id]).then(res => {
      if (res.code === '200') {
        getCourseLibSyncPager()
        ElMessage.success('接收成功')
      }
    })
  }).catch(() => { })
}

const refuse = (id) => {
  ElMessageBox.confirm(
    '确定拒绝吗?',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    syncReject([id]).then(res => {
      if (res.code === '200') {
        getCourseLibSyncPager()
        ElMessage.success('拒绝成功')
      }
    })
  }).catch(() => { })
}
</script>
<style>
.course-lib-sync {
  background: #fff;
  padding: 0 20px 20px 20px;
  position: relative;
  box-sizing: border-box;
  height: 100%;
}
.pagination {
  margin-top: 10px;
}
</style>
