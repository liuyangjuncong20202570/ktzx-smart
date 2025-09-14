<template>
  <div class="inner">
    <el-dialog
      class="!h-[600px]"
      :destroy-on-close="true"
      :show-close="true"
      :close-on-click-modal="true"
      style="width: 50vw; padding-top: 0; height: 78vh"
      @close="handleBack"
      v-model="isItemShow"
      @open="handleShow"
      @opened="handleShow"
    >
      <h2 style="margin-top: 0">已绑定的考核项</h2>
      <div class="wrapper">
        <div class="h-[400px] overflow-auto">
          <el-table
            v-loading="loading"
            :data="bindList"
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
            <el-table-column label="描述">
              <template #default="scope">
                <div style="display: flex; align-items: center">
                  <span>{{ scope.row.itemDescription }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button size="small" type="danger" @click="handleDelete(scope)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="mt-4">
          <el-button style="margin-right: 10px" @click="handleBack">关闭</el-button>
          <!-- 添加内联样式 -->
          <el-button type="success" @click="handleDelAll">批量删除</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import useItem from '../../../stores/useItem';
import { ElMessage } from 'element-plus';

/* ********************变量定义******************** */
// props定义
const props = defineProps({
  classroomId: {
    type: String,
    default: ''
  }
});
// 普通变量
// pinia状态管理
const delList = ref([]);
const itemStore = useItem();
const { setItemShow, fetchDelBind, fetchGetBind } = itemStore;
const { isItemShow, bindList, courseId } = storeToRefs(itemStore);

const handleShow = () => {
  console.log('show');
};

const handleBack = () => {
  setItemShow(false);
};

const handleDelAll = async () => {
  if (!delList.value.length) {
    ElMessage.info('未选择考核项');
    return;
  }
  const data = await fetchDelBind(delList.value);
  if (data.msg === 'success') {
    await fetchGetBind(courseId.value, -1, 1);
    ElMessage.success('删除成功');
    return;
  }
  ElMessage.error('删除失败');
};

const handleDelete = async scope => {
  console.log(scope);
  let delList = [scope.row.id];
  const data = await fetchDelBind(delList);
  if (data.msg === 'success') {
    await fetchGetBind(courseId.value, -1, 1);
    return ElMessage.success('删除成功');
  }
  ElMessage.error('删除失败');
};

const handleSelect = selection => {
  delList.value = selection.map(i => i.id);
  console.log(delList.value);
};

const handleSelectAll = selection => {
  delList.value = selection.map(i => i.id);
  console.log(delList.value);
};
/* ********************方法定义******************** */
</script>

<style lang="less" scoped></style>
