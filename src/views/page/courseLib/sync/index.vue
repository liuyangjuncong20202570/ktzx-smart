<template>
  <div>
    <Header title="题库同步" />
    <el-table ref="tableRef" row-key="date" :data="tableData" style="width: 100%">

      <el-table-column prop="address" label="题型" />
      <el-table-column prop="address" label="题目" />
      <el-table-column prop="address" label="状态" />

      <el-table-column label="操作" width="180" filter-placement="bottom-end">
        <template #default="scope">
          <el-tag type="success">接收</el-tag>
          <el-tag type="success">拒绝</el-tag>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination flex-end">
      <el-pagination v-model:currentPage="params.pageIndex" v-model:page-size="params.pageSize"
        :page-sizes="[20, 30, 40]" layout="total, sizes, prev, pager, next, jumper" :total="400"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>

</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElTable } from 'element-plus'
import { courseLibSyncPager, courseLibSyncAccept, courseLibSyncReject } from '@/api/courseLib.js'
import Header from '../../components/header/index.vue'

onMounted(() => {
  getCourseLibSyncPager()
})
const params = ref({
  pageIndex: 1,
  pageSize: 20,
})
const tableRef = ref()
const total = ref()
const handleSizeChange = (val) => {
  params.value.pageSize = val
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val) => {
  params.value.pageIndex = val
  console.log(`current page: ${val}`)
}

const resetDateFilter = () => {
  tableRef.value?.clearFilter(['date'])
}
// TODO: improvement typing when refactor table
const clearFilter = () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  tableRef.value?.clearFilter()
}

const getCourseLibSyncPager = () => {
  courseLibSyncPager(params.value).then(res => {
    if (res.code === '200') {

    }
  })
}


const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
    tag: 'Home',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
    tag: 'Office',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
    tag: 'Home',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
    tag: 'Office',
  },
]
</script>
<style>
.pagination {
  margin-top: 10px;
}
</style>
