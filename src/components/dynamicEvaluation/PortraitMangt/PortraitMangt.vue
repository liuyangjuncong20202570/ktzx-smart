<template>
  <div v-loading="generating" class="container">
    <div class="titel" style="font-weight: bold; padding: 10px 0">画像数据管理</div>
    <el-header
      style="
        height: auto;
        padding: 30px 10px;
        width: 100%;
        display: flex;
        justify-content: flex-end;
        border-top: 2px solid #27a5ff;
      "
    >
      <div class="button">
        <el-button
          class="custom-nav-button custom-nav-button-info"
          type="primary"
          @click="handleUpload"
          v-blur-on-click
        >
          <el-icon><Top /></el-icon>
          上传数据</el-button
        >
        <el-button
          class="custom-nav-button custom-nav-button-delete"
          type="primary"
          @click="handleDelete"
          v-blur-on-click
        >
          <el-icon><DeleteFilled /></el-icon>
          删除数据</el-button
        >
        <el-button
          class="custom-nav-button custom-nav-button-success"
          type="primary"
          @click="handleGenerate"
          v-blur-on-click
        >
          <el-icon><SwitchButton /></el-icon>
          生成画像</el-button
        >
      </div>
    </el-header>

    <div class="dragwrapper">
      <el-table
        class="elTable custom-table"
        :data="portraitStore.testLists"
        :border="true"
        style="width: 100%"
        :header-cell-style="{ textAlign: 'center' }"
        :cell-style="{ textAlign: 'center' }"
        @select-all="handleSelectAll"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" />
        <el-table-column label="序号" width="100%">
          <template #default="scope">{{
            portraitStore.testLists.findIndex(item => item.testId === scope.row.testId) + 1
          }}</template>
        </el-table-column>
        <el-table-column prop="testName" label="名称" />
        <el-table-column prop="operation" label="操作(拖拽改变顺序)">
          <template #default="scope">
            <el-button @click="handleSingleClick(scope)" type="primary">查看</el-button>
          </template>
        </el-table-column>
      </el-table>

      <GraphChart :store="portraitStore">
        <template #title>已交作业学生名单</template>
        <template #GraphItem>
          <List
            @close="handleClose"
            :titleList="titleList"
            :listData="portraitStore.submitTestsLists"
          />
        </template>
      </GraphChart>
    </div>
    <DynamicStudentList
      :studentListTitle="titles"
      :studentList="portraitStore.testInfo"
      :store="portraitStore"
      :isDefault="false"
      :handleSelectAll="handleSelectTestAll"
      :handleSelectionChange="handleSelectionTestChange"
    >
      <template #title>作业总览</template>
      <template #footer>
        <div style="position: absolute; left: 50%; bottom: 5%; transform: translate(-50%, -50%)">
          <el-button type="primary" @click="handleBack">返回</el-button>
          <el-button type="success" @click="handleConfirm">确认</el-button>
        </div>
      </template>
    </DynamicStudentList>
  </div>
</template>

<script setup>
import Header from '@/views/page/components/header/index.vue';
import DynamicStudentList from '../PublicCpns/DynamicStudentList.vue';
import Sortable from 'sortablejs';
import List from '../PublicCpns/List.vue';
import parseJWT from '../../../utils/parseJWT.js';
import GraphChart from '../PublicCpns/GraphChart.vue';
import { getCourseId } from '@/utils/searchCourseId.js';
import { ref, reactive, computed, onMounted, nextTick } from 'vue';
import usePortrait from '../../../stores/dynamicEvaluation/portraitStore';
import { ElMessage } from 'element-plus';
import { Upload } from 'vxe-pc-ui';
/* ********************变量定义******************** */
// props定义
// 普通变量
// 作业列表表头
const titles = [
  { prop: 'testName', label: '考试名称' },
  { prop: 'classroomName', label: '课堂名称' },
  { prop: 'courseName', label: '课程名称' },
  { prop: 'creator', label: '创建人' }
];

const generating = ref(false);

const courseId = ref('');

const classroomId = ref('');

const attendList = ref([]);

const selectionData = ref([]);

const selectTests = ref([]);

const rankingList = ref([]);

// titleList是固定写死的，定义在PortraitMangt中即可
const titleList = [
  { prop: 'userName', label: '姓名' },
  { prop: 'stuNo', label: '学号' },
  { prop: 'obsName', label: '班级' }
];

// pinia状态管理
const portraitStore = usePortrait();

/* ********************方法定义******************** */

const initSort = () => {
  const table = document.querySelector('.elTable .el-table__body-wrapper tbody');
  Sortable.create(table, {
    group: 'shared',
    animation: 150,
    ghostClass: 'sortable-ghost', //拖拽样式
    easing: 'cubic-bezier(1, 0, 0, 1)',
    onStart: item => {},

    // 结束拖动事件
    onEnd: item => {
      setNodeSort(item.oldIndex, item.newIndex);
    }
  });
};

const setNodeSort = (oldIndex, newIndex) => {
  // 使用arr复制一份表格数组数据
  // let arr = myArray.value;
  let arr = portraitStore.testLists;
  const currentRow = arr.splice(oldIndex, 1)[0];
  arr.splice(newIndex, 0, currentRow);
  // 原数组置空
  portraitStore.setTestList([]);
  nextTick(async () => {
    portraitStore.setTestList(arr);
    // 数据处理
    attendList.value = portraitStore.testLists.map(item => item.paperId);
    // // 提交后后台数据进行排序
    rankingList.value = portraitStore.testLists.map(item => item.id);
  });
};

const handleUpload = async () => {
  // 获取作业列表
  const { code, msg } = await portraitStore.fetchAllTests(classroomId.value);
  if (!(code === 200 && msg === 'success')) {
    ElMessage({
      type: 'error',
      message: msg
    });
    return;
  }
  portraitStore.setListVisible(true);
};

const handleSelectTestAll = selection => {
  selectTests.value = selection;
};
const handleSelectionTestChange = selection => {
  selectTests.value = selection;
};

const handleDelete = async () => {
  if (selectionData.value.length === 0) {
    ElMessage({
      type: 'warning',
      message: '还未选择需要删除作业'
    });
    return;
  }
  let arr = selectionData.value.map(item => item.id);
  const { code, msg } = await portraitStore.fetchDelStuList(arr);
  if (!(code === 200 && msg === 'success')) {
    ElMessage({
      type: 'error',
      message: msg
    });
    return;
  }
  ElMessage({
    type: 'success',
    message: '成功'
  });
  await portraitStore.fetchTestList(parseJWT(sessionStorage.getItem('token')).obsid);
};

const handleBack = () => {
  portraitStore.setListVisible(false);
};

const handleConfirm = async () => {
  if (selectTests.value.length === 0) {
    ElMessage({
      type: 'warning',
      message: '您还未选择作业！'
    });
    return;
  }
  const { code, msg, data } = await portraitStore.fetchInsertTests(selectTests.value);
  if (!(code === 200 && data)) {
    ElMessage({
      type: 'error',
      message: msg
    });
    return;
  } else {
    ElMessage({
      type: 'success',
      message: '插入成功'
    });
  }
  await portraitStore.fetchTestList(classroomId.value);
  handleBack();
};

const handleGenerate = async () => {
  if (selectionData.value.length === 0) {
    ElMessage({
      type: 'warning',
      message: '还未选择需要参与评价作业！'
    });
    return;
  }
  generating.value = true;
  // let arr = [];
  const attendSet = new Set(attendList.value);
  const arr = selectionData.value
    .filter(item => attendSet.has(item.paperId))
    .map(item => item.paperId);

  // 进行生成画像
  Promise.all([
    portraitStore.fetchGenerateInstant(courseId.value, classroomId.value, [], arr),
    portraitStore.fetchChangeOrder(classroomId.value, rankingList.value)
  ])
    .then(([{ code, msg, data }]) => {
      if (code === 200 && data) {
        ElMessage({
          type: 'success',
          message: msg
        });
      }
    })
    .catch(err => {
      ElMessage({
        type: 'error',
        message: '生成失败，请稍后再试！'
      });
      console.log(err);
    })
    .finally(() => {
      generating.value = false;
    });
};

const handleSingleClick = async scope => {
  // 此处通过scope中的id或相关信息发送请求得到已交对应作业的学生列表
  console.log(scope.row.testId);
  // 发送请求获取名单
  const { code, msg } = await portraitStore.fetchSubmitList(scope.row.testId);
  if (!(code === 200 && msg === 'success')) {
    ElMessage({
      type: 'error',
      message: msg
    });
    return;
  }
  portraitStore.setChartVisible(true);
};

const handleClose = () => {
  portraitStore.setSubmitTestsLists([]);
};

const handleSelectAll = selection => {
  selectionData.value = selection;
};
const handleSelectionChange = selection => {
  selectionData.value = selection;
};

onMounted(async () => {
  classroomId.value = parseJWT(sessionStorage.getItem('token')).obsid;
  await portraitStore.fetchTestList(classroomId.value);
  const { code, msg, data } = await getCourseId(classroomId.value);
  if (code === 200 && msg === 'success') {
    courseId.value = data;
  }
  // attendList.value = portraitStore.testLists.map(item => item.paperId);
  // rankingList.value = portraitStore.testLists.map(item => item.id);
  portraitStore.testLists.forEach(item => {
    attendList.value.push(item.paperId);
    rankingList.value.push(item.id);
  });
  initSort();
});
</script>

<style lang="less" scoped>
.container {
  height: 92vh;
  display: flex;
  flex-direction: column;

  .title {
    display: flex;
    height: 15vh;
    flex-direction: row;
    flex-shrink: 0;
    .item {
      flex: 1;
    }
  }
}
</style>
