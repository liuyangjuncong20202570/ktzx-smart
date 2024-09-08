<template>
  <el-card class="practice-wrap">
    <Header title="实验管理":pathData="pathData" />
    <div class="practice-tool" v-if="!(privilege === 'read')">
      <el-button type="danger" :icon="Delete" @click="delPracticeData">批量删除</el-button>
      <el-button type="primary" :icon="Plus" @click="addPractice">新建实验</el-button>
    </div>
    <el-table ref="multipleTableRef" :data="tableData" style="width: 100%" :row-key="(row: any)=> row.id">
      <el-table-column lebel="选择" type="selection" width="55" fixed="left" :reserve-selection="true"  />
      <el-table-column label="题目" prop="name" fixed="left"></el-table-column>
      <el-table-column label="创建时间" prop="updateTime"  />
      <el-table-column label="创建人" prop="updateMan">
        <template #default="scope">
          {{scope.row.updateMan?scope.row.updateMan:'-'  }}
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="operate">
        <template #default="scope">
          <!-- status -->
          <template v-if="scope.row.status==0 && !(privilege === 'read')">
            <el-button type="primary" :text="true" @click="publishPracticeData(scope.row.id)">发布</el-button>
          </template>
          <template v-else>
            <el-button type="primary" :text="true" @click="lookStudent(scope.row)">查看学生</el-button>
          </template>
          <el-button :disabled="scope.row.status" v-if="!(privilege === 'read')" type="primary" :text="true" @click="editPractice(scope.row)">编辑</el-button>
          <el-button :disabled="scope.row.status" v-if="!(privilege === 'read')" type="danger" :text="true" @click="delPracticeRow(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-box">
      <el-pagination
        v-model:current-page="pagination.pageIndex"
        v-model:page-size ="pagination.pageSize"
        :background="false"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 无权限显示 -->
    <NoAccessPermission v-if="privilege === 'none'" />
  </el-card>
</template>

<script setup lang="ts">
import { onMounted,reactive ,ref} from "vue";
import {Plus,Delete} from '@element-plus/icons-vue'
import router from "@/router/index.js";
import { practicePage,delPractice,publishPractice, studentWR } from "@/api/practice/index.ts";
import { PracticePageVO } from "@/api/practice/type.ts";
import { ElMessage, ElMessageBox } from "element-plus";
import NoAccessPermission from '@/views/page/components/noAccessPermission/index.vue'
import Header from '@/views/page/components/header/index.vue'

const pagination = reactive({
  pageIndex:1,
  pageSize:10,
  total:0
})
const multipleTableRef = ref(null)
const privilege = ref('')
const pathData = [
  {
    name: '实验管理',
    path: ''
  }
]
const getWR = () => {
  studentWR().then(res => {
    if (res.code === '200') {
      privilege.value = res.data
    }
  })
}
const addPractice = ()=>{
  router.push('/homes/courseteacherhome/exam/experimental/practiceInfo')
}
const tableData = ref([])
const handleSizeChange = ()=>{
  getPracticePage()
}
const handleCurrentChange = ()=>{
  getPracticePage()
}
const publishPracticeData = async(id:string) =>{
  ElMessageBox.confirm(
    '确定发布吗?',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async() => {
    const resData = await publishPractice(id)
    if (resData.code==200) {
      ElMessage({message: '发布成功',type: 'success'})
      getPracticePage()
    }
  }).catch(() => { })
}
// 查看学生实验
const lookStudent = (row:any)=>{
  router.push({path:'/homes/courseteacherhome/exam/experimental/student',query:{ id:row.id, privilege: privilege.value }})
}
// 分页列表
const getPracticePage = async () => {
  const data = await practicePage({ pageIndex: pagination.pageIndex, pageSize: pagination.pageSize});
  if (data.code==200) {
    tableData.value = data.data.data
    pagination.total = data.data.recordSize
  }
};
// 编辑数据
const editPractice = (row: any)=>{
  router.push({path:'/homes/courseteacherhome/exam/experimental/practiceInfo',query:{id:row.id}})
}
// 删除一条实验
const delPracticeRow = async (id:string)=>{
  ElMessageBox.confirm(
    '确定删除吗?',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async() => {
    const resData = await  delPractice([id])
    if (resData.code==200) {
      ElMessage({message: '删除成功！',type: 'success'})
      getPracticePage()
    }
  }).catch(() => { })
}
// 批量删除实验
const delPracticeData = async ()=>{
  ElMessageBox.confirm(
    '确定删除吗?',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async() => {
    const selectRow = multipleTableRef.value?.getSelectionRows()
    if (selectRow.length<=0) {
      ElMessage({message: '请选择要删除的实验',type: 'error'})
      return
    }
    const ids:string[] = selectRow.map((item) => item.id)
    console.log('ids', ids)
    const resData = await delPractice(ids)
    if (resData.code==200) {
      ElMessage({message: '删除成功！',type: 'success'})
      multipleTableRef.value?.clearSelection()
      getPracticePage()
    }
  }).catch(() => { })
}
onMounted(() => {
  getPracticePage();
  getWR()
});
</script>
<style>
.practice-wrap .el-card__body {
  padding: 0 20px 20px 20px !important;
}
</style>
<style scoped>
  .practice-wrap {
    position: relative;
  }
  .practice-tool {
    margin-top: 10px;
    padding-bottom: 10px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    background-color: #fff;
  }
  .pagination-box {
    padding: 5px 0;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    background-color: #fff;
  }
</style>
