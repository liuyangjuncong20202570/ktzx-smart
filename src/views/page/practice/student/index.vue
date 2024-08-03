<!--
 * @Date: 2024-07-16 11:07:52
 * @LastEditors: Ming
 * @LastEditTime: 2024-07-19 17:38:51
 * @FilePath: \smarttt_ktzx\src\views\page\practice\student\index.vue
-->
<template>
  <el-card>
    <!-- <div class="practice-tool">
      <el-button type="danger" :icon="Download" @click="loadScore">成绩下载</el-button>
      <el-button type="primary" :icon="Download" @click="loadData">数据下载</el-button>
    </div> -->
    <el-table ref="multipleTableRef" :data="tableData" style="width: 100%" :border="true">
      <el-table-column lebel="序号" type="index" fixed="left" />
      <el-table-column label="学号" prop="stuNo" />
      <el-table-column label="姓名" prop="name" />
      <el-table-column label="总评成绩" prop="answerPercent" ></el-table-column>
      <el-table-column label="状态" prop="status" >
        <template #default="scope">
         <span>{{statusMap.get(scope.row.status)  }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="operate" >
        <template #default="scope">
          <el-button type="primary" :text="true" @click="correct(scope.row)">批改</el-button>
          <template v-if="scope.row.status==1">
            <el-button type="primary" :text="true" @click="correct">批改</el-button>
          </template>
          <template v-else>-</template>
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
  </el-card>
</template>

<script setup lang="ts">  
import { onMounted, reactive, ref } from "vue";
import { Download ,Opportunity} from "@element-plus/icons-vue";
import { studentList } from "@/api/practice/index.ts";
import { ResVO ,StudentPracticePageVO} from "@/api/practice/type.ts";
import router from "@/router/index.js";
const statusMap = reactive(new Map([[0,'已发布'],[1,'已作答'],[2,'已批改']]))
const pagination = reactive({
  pageIndex:1,
  pageSize:10,
  total:0
})
const tableData = reactive<StudentPracticePageVO>([]);

const correct = (data:any) =>{
  router.push({path:'/page/correct',query:{sid:data.stuId,pid:data.practiceId}})
}
const handleSizeChange = ()=>{
  loadStudentData()
}
const handleCurrentChange = ()=>{
  loadStudentData()
}
const loadStudentData = async () => {
  const id: string = router.currentRoute.value.query.id;
  const resData:ResVO = await studentList({pageIndex:pagination.pageIndex,pageSize:pagination.pageSize,practiceId:id})
  if (resData.code==200) {
    tableData.length = 0
    tableData.push(...resData.data.data)
    pagination.total = resData.data.recordSize
  }
  
  console.info(999);
  console.info(id);
  console.info(resData)
};
onMounted(() => {
  loadStudentData();
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
