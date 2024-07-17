<template>
  <el-card>
    <div class="practice-tool">
      <el-button type="danger" :icon="Delete" >批量删除</el-button>
      <el-button type="primary" :icon="Plus" @click="addPractice">新建实验</el-button>
    </div>
    <el-table ref="multipleTableRef" :data="tableData" style="width: 100%" :border="true">
      <el-table-column lebel="选择" type="selection" width="55" fixed="left" />
      <el-table-column label="题目" property="222" fixed="left"></el-table-column>
      <el-table-column label="创建时间" property="name"  />
      <el-table-column label="创建人" property="address" />
      <el-table-column label="操作" property="address" />
    </el-table>
    <div class="pagination-box">
      <el-pagination
        v-model:current-page="pagination.pageIndex"
        :page-size="[10, 20, 30, 40]"
        :background="false"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted,reactive } from "vue";
import {Plus,Delete} from '@element-plus/icons-vue'
import router from "@/router/index.js";
import { practicePage } from "@/api/practice/index.ts";
import { PracticePageVO } from "@/api/practice/type.ts";
const pagination = reactive({
  pageIndex:1,
  total:0
})
const addPractice = ()=>{
  router.push('/page/practiceInfo')
}
const tableData = reactive<PracticePageVO>([])
const handleSizeChange = (pageSize: number)=>{
  console.info(pageSize)
}
const handleCurrentChange = (pageIndex:number)=>{
  console.info(pageIndex)
}
const getPracticePage = async () => {
  const data = await practicePage({ pageIndex: 1, pageSize: 2 });
  console.info(data);
};
onMounted(() => {
  getPracticePage();
  console.info(9999);
});
</script>
<style scoped>
  .practice-tool {
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
