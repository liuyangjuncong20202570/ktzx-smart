<template>
  <Header title="作业学生列表" />
  <!-- 作业列表 -->
  <el-table ref="multipleTableRef" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="55" />
    <el-table-column label="Date" width="120">
      <template #default="scope">{{ scope.row.date }}</template>
    </el-table-column>
    <el-table-column property="name" label="Name" width="120" />
    <el-table-column property="address" label="Address" />
    <el-table-column fixed="right" label="Operations" min-width="120">
      <template #default="scope">
        <el-button type="text" size="small" @click="(() => {
          router.push('/page/taskMgmt/view')
        })">
          批改
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Header from '@/views/page/components/header/index.vue'

onMounted(() => {
  
})

const tableData = ref([])
</script>

<style scoped></style>