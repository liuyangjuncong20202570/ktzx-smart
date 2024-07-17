<!--
 * @Date: 2024-07-16 14:59:49
 * @LastEditors: Ming
 * @LastEditTime: 2024-07-17 09:53:23
 * @FilePath: \smarttt_ktzx\src\views\page\practice\info\index.vue
-->
<template>
  <el-card>
    <div class="practice-tool">
      <el-form :model="practiceForm" label-width="auto" :inline="true">
        <el-form-item label="实验名称">
          <el-input v-model="practiceForm.name" />
        </el-form-item>
        <el-form-item label="总分">
          <el-input v-model="practiceForm.totalScore" />
        </el-form-item>
      </el-form>
      <el-button type="primary" :icon="Plus" @click="saveData">保存</el-button>
    </div>
    <el-table ref="multipleTableRef" :data="tableData" style="width: 100%">
      <el-table-column lebel="选择" type="selection" width="55" fixed="left" :selectable="checkSelectable" />
      <el-table-column label="名称" property="itemName" width="120" fixed="left"></el-table-column>
      <el-table-column label="KWA" property="kwa"  />
      <el-table-column label="权重" property="weight" width="240" >
        <template #default="scope">
          <template v-if="scope.row.setWeight==1">
            <el-input-number v-model="scope.row.weight" :min="0" :max="100" step-strictly />%
          </template>
          <template v-else>-</template>
        </template>
      </el-table-column>
      <el-table-column label="学生可见" property="stuVisible" >
        <template #default="scope">
          <el-checkbox v-model="scope.row.stuVisible" :true-value="1" :false-value="0" />
        </template>
      </el-table-column>
      <el-table-column label="操作" property="address" width="280">
        <template #default="scope">
          <el-button type="primary" :text="true">预览</el-button>
          <el-button type="primary" :text="true" >上传</el-button>
          <el-button type="primary" :text="true"  :disabled="scope.row.setKwa==0" >KWA关联</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted,reactive } from "vue";
import {Plus} from '@element-plus/icons-vue'
import router from "@/router/index.js";
import { getTemplate } from "@/api/practice/index.ts";
import { PracticeTemplateVO } from "@/api/practice/type.ts";
const practiceForm = reactive({
  name:'',
  totalScore:''
})
const checkSelectable = (row: any)=>{
  console.info(row)
  return row.beDefault==1?false:true
}
const saveData = ()=>{
  console.info('保存数据')
}
const tableData = reactive<PracticeTemplateVO>([])
const getTemplateList = async () => {
  const data = await getTemplate();
  if (data.code==200) {
    data.data.forEach((item: any) =>{
      item.kwa = ''
    })
    tableData.length = 0
    tableData.push(...data.data)
  }
  console.info(9999);
  console.info(data);
};
onMounted(() => {
  getTemplateList();
});
</script>
<style scoped>
  .practice-tool {
    padding-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
  }
</style>
