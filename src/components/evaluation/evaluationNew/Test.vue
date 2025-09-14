<template>
  <div class="inner">
    <el-dialog
      class="!h-[600px]"
      :destroy-on-close="true"
      :show-close="true"
      :close-on-click-modal="true"
      style="width: 50vw; padding-top: 0; height: 78vh"
      @close="handleBack"
      v-model="isShow"
    >
      <h2 style="margin-top: 0">请选择需要绑定的考核项</h2>
      <div class="wrapper">
        <div>
          <el-dropdown>
            <el-tree-select
              v-model="treeValue"
              :props="defaultProps"
              :data="typeList"
              :render-after-expand="false"
              style="width: 240px"
              :check-on-click-node="true"
              @node-click="nodeClick"
              node-key="id"
              placeholder="请选择考核类别"
            />
          </el-dropdown>
        </div>
        <div class="h-[400px] overflow-auto">
          <el-table
            v-loading="loading"
            :data="[...testList.testPaper, ...testList.practice]"
            @select="handleSelect"
            @selectAll="handleSelectAll"
            style="width: 100%"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column label="作业/实验名称">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <span>{{ scope.row.itemName }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="类别">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <span>{{ scope.row.itemType }}</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="mt-4">
          <el-button style="margin-right: 10px" @click="handleBack">关闭</el-button>
          <!-- 添加内联样式 -->
          <el-button type="success" @click="submitUpload">绑定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import useItem from '../../../stores/useItem';
import useCourseAim from '../../../stores/useCourseAim';
import useEvaluationNew from '../../../stores/useEvaluationNew';
import { ElMessage } from 'element-plus';

/* ********************变量定义******************** */
// props定义
const defaultProps = {
  children: node => node.children || node.studentDtos, // 子节点字段
  label: node => node.categoryName // 显示文本字段
};
// 普通变量
// pinia状态管理
const treeValue = ref();
const inputList = ref([]);
const itemStore = useItem();
const aimStore = useCourseAim();
const typeStore = useEvaluationNew();
const { typeList } = storeToRefs(typeStore);
const { setShow, setCategoryId, fetchBind } = itemStore;
const { isShow, testList, categoryId, objectiveId } = storeToRefs(itemStore);

const handleBack = () => {
  setShow(false);
};

const handleSelectAll = selection => {
  inputList.value = selection.map(i => ({
    ...i,
    categoryId: categoryId.value,
    objectiveId: objectiveId.value
  }));
  console.log(inputList.value);
};

const handleSelect = selection => {
  // console.log(selection);
  inputList.value = selection.map(i => ({
    ...i,
    categoryId: categoryId.value,
    objectiveId: objectiveId.value
  }));
  console.log(inputList.value);
};

const nodeClick = (data, node, event) => {
  // treeValue.value = data.categoryName;
  setCategoryId(data.id);
};

const submitUpload = async () => {
  const { code, msg } = await fetchBind(inputList.value);

  ElMessage({
    type: code === 200 ? 'success' : 'error',
    message: msg === 'success' ? '绑定成功' : msg
  });
};

/* ********************方法定义******************** */
</script>

<style lang="less" scoped></style>
