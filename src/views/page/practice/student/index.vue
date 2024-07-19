<!--
 * @Date: 2024-07-16 11:07:52
 * @LastEditors: Ming
 * @LastEditTime: 2024-07-19 17:38:51
 * @FilePath: \smarttt_ktzx\src\views\page\practice\student\index.vue
-->
<template>
  <el-card>
    <div class="practice-tool">
      <el-button type="danger" :icon="Download" @click="loadScore">成绩下载</el-button>
      <el-button type="primary" :icon="Download" @click="loadData">数据下载</el-button>
    </div>
    <el-table ref="multipleTableRef" :data="tableData" style="width: 100%" :border="true">
      <el-table-column lebel="序号" type="index" fixed="left" />
      <el-table-column label="创建时间" prop="updateTime" />
      <el-table-column label="创建时间" prop="update2Time" />
      <el-table-column label="创建时间" prop="update3Time" />
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { Download } from "@element-plus/icons-vue";
import { studentList } from "@/api/practice/index.ts";
import { ResVO } from "@/api/practice/type.ts";
import router from "@/router/index.js";
const tableData = reactive([]);
const loadScore = () => {};
const loadData = () => {};
const loadStudentData = async () => {
  const id: string = router.currentRoute.value.query.id;
  const resData:ResVO = await studentList(id)
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
