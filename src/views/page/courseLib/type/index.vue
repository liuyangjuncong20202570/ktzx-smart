<template>
  <div class="course-type">
    <Header title="题库管理" />
    <div style="margin-top: 20px" class="flex-end" v-if="!(privilege === 'read')">
      <el-button type="primary" @click="save()">保存</el-button>
    </div>
    <el-table ref="multipleTableRef" :data="typeList" style="width: 100%;" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column property="name" label="题型" show-overflow-tooltip />
      <el-table-column property="status" label="状态" show-overflow-tooltip>
        <template #default="scope">{{ scope.row.status === 1 ? '开启' : '关闭' }}</template>
      </el-table-column>
    </el-table>
    <!-- 无权限显示 -->
    <NoAccessPermission v-if="privilege === 'none'" />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { ElTable, ElMessage } from 'element-plus'
import { courseLibTypeList, courseLibTypeSetStatus, courseLibWR } from '@/api/courseLib.js'
import Header from '../../components/header/index.vue'
import NoAccessPermission from '@/views/page/components/noAccessPermission/index.vue'
onMounted(() => {
  getCourseLibTypeList()
  getCourseLibWR()
})

const multipleTableRef = ref()
const multipleSelection = ref([])
const typeList = ref([])
const privilege = ref('')

const getCourseLibWR = () => {
  courseLibWR().then(res => {
    if (res.code === '200') {
      privilege.value = res.data
    }
  })
}

const toggleSelection = (rows) => {
  if (rows) {
    rows.forEach((row) => {
      if (row.status) {
        multipleTableRef.value?.toggleRowSelection(row, undefined)
      }
    })
  } else {
    multipleTableRef.value?.clearSelection()
  }
}
const handleSelectionChange = (val) => {
  multipleSelection.value = val
}

const getCourseLibTypeList = () => {
  courseLibTypeList().then(res => {
    if (res.code === '200') {
      typeList.value = res?.data
      console.log('multipleTableRef', multipleTableRef)
      nextTick(() => {
        toggleSelection(typeList.value)
      })
    }
  })
}

const save = () => {
  const selectionRows = multipleTableRef.value?.getSelectionRows()
  const queTypeIds = selectionRows.map((item) => item.queTypeId)
  const params = typeList.value.map((item) => {
    const { queTypeId } = item
    const flag = queTypeIds.indexOf(item.queTypeId) !== -1
    return {
      queTypeId,
      status: flag ? 1 : 0
    }
  })
  courseLibTypeSetStatus(params).then(res => {
    if (res.code === '200') {
      ElMessage.success('设置成功')
      getCourseLibTypeList()
    }
  })
}
</script>
<style scoped>
  .course-type {
    background: #fff;
    padding: 0 10px 10px 10px;
    position: relative;
    box-sizing: border-box;
    height: 100%;
  }
</style>
