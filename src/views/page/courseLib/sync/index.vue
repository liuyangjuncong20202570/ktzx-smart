<template>
  <div>
    <el-table ref="tableRef" row-key="date" :data="tableData" style="width: 100%">

      <el-table-column prop="address" label="题型" />
      <el-table-column prop="address" label="题目" />
      <el-table-column prop="address" label="状态" />

      <el-table-column label="操作" width="180" filter-placement="bottom-end">
        <template #default="scope">
          <el-tag type="success" disable-transitions>接收</el-tag>
          <el-tag type="success" disable-transitions>拒绝</el-tag>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination flex-end">
      <el-pagination v-model:currentPage="params.page" v-model:page-size="params.pageSize"
        :page-sizes="[100, 200, 300, 400]" layout="total, sizes, prev, pager, next, jumper" :total="400"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>

</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElTable } from 'element-plus'
import type { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults'

interface User {
  date: string
  name: string
  address: string
  tag: string
}

const params = ref({
  page: 1,
  pageSize: 20,
})

const handleSizeChange = (val) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val) => {
  console.log(`current page: ${val}`)
}

const tableRef = ref<InstanceType<typeof ElTable>>()

const resetDateFilter = () => {
  tableRef.value!.clearFilter(['date'])
}
// TODO: improvement typing when refactor table
const clearFilter = () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  tableRef.value!.clearFilter()
}


const tableData: User[] = [
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
