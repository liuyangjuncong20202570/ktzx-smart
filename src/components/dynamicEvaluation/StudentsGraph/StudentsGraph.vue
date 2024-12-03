<template>
  <!-- 课堂列表 -->
  <GraphTemplate
    :handleCellClick="handleCellClick"
    :addCellStyle="addCellStyle"
    :graphList="lists"
    :titleList="titles"
    keyword="请输入课堂名称关键字检索"
  />
  <!-- 课堂列表结束 -->
  <!-- 学生列表浮窗 -->
  <DynamicStudentList
    :handleCellClick="stuListCellClick"
    :addCellStyle="stuListCellStyle"
    :studentList="studentLists"
    :studentListTitle="studentTitles"
  >
    <template #title>画像学生列表</template>
  </DynamicStudentList>
  <!-- 学生列表浮窗结束 -->
  <!-- 图标列表 -->
  <GraphChart>
    <template #title
      >学生课程画像：{{ stuInfo.courseName }} - {{ stuInfo.stuname }}({{ stuInfo.stuNo }})</template
    >
  </GraphChart>
  <!-- 图标列表结束 -->
</template>

<script setup>
import { storeToRefs } from 'pinia';
import GraphChart from '../PublicCpns/GraphChart.vue';
import useStudentGraph from '../../../stores/dynamicEvaluation/studentGraphStore';
import DynamicStudentList from '../PublicCpns/DynamicStudentList.vue';
import GraphTemplate from '../PublicCpns/GraphTemplate.vue';
import { onMounted, reactive, ref } from 'vue';

/* ********************变量定义******************** */
// props
// 普通变量
const stuInfo = reactive({
  stuId: 0, //学生id
  curriculumId: 0, //课程id
  courseName: '',
  stuname: '',
  stuNo: ''
});

// pinia状态
const studentGraphStore = useStudentGraph();
const { stuListVisible, chartVisible } = storeToRefs(studentGraphStore);

/* ********************课程数据定义******************** */
const titles = [
  { prop: 'courseName', label: '课堂名称' }, //大
  { prop: 'term', label: '学期' },
  { prop: 'curriculum', label: '课程' }, //小
  { prop: 'profession', label: '专业' },
  { prop: 'mainTeacher', label: '主讲教师' },
  { prop: 'experimentTeacher', label: '实验教师' },
  { prop: 'practiceTeacher', label: '实践教师' },
  { prop: 'creator', label: '创建人' }
];

const lists = [
  {
    id: 0,
    courseName: '单片机原理及应用I-2023春-自实验21',
    term: '2023春季学期',
    curriculum: '单片机原理及应用I',
    profession: '自动化专业',
    mainTeacher: '赵仁涛',
    experimentTeacher: '',
    practiceTeacher: '',
    creator: '自动化专业负责人'
  },
  {
    id: 3,
    courseName: '单片机原理及应用I-2024春-自实验22',
    term: '2024春季学期',
    curriculum: '单片机原理及应用I',
    profession: '自动化专业',
    mainTeacher: '赵仁涛',
    experimentTeacher: '',
    practiceTeacher: '',
    creator: '李志军'
  }
];

/* ********************学生数据数据定义******************** */
const studentTitles = [
  { prop: 'name', label: '姓名' },
  { prop: 'stuno', label: '学号' },
  { prop: 'classname', label: '班级' }
];

const studentLists = [
  { id: 0, name: '古子阳', stuno: '18101150110', classname: '自实验21' },
  { id: 1, name: '杨金立', stuno: '21101150107', classname: '自实验21' }
];

/* ********************方法定义******************** */

/* ************课程单元格样式定义*********** */
// 单元格样式定义
const addCellStyle = ({ row, column, rowIndex, columnIndex }) => {
  if (column.property === 'courseName') {
    return {
      color: '#86BFA8',
      textAlign: 'center',
      textDecoration: 'underline',
      cursor: 'pointer'
    };
  }
  return {
    textAlign: 'center'
  };
};

// 单元格点击事件
const handleCellClick = (row, column, cell) => {
  // 限定只有courseName单元格才能点击
  if (column.property === 'courseName') {
    // 记录学生课堂信息
    stuInfo.courseName = row.courseName;
    stuInfo.curriculumId = row.id;
    // 控制学生列表是否可见
    studentGraphStore.setStuListVisible(true);
    console.log(row.id);
    //TODO 此处将打开学生列表，发送请求将id传过去
  }
};

/* ************学生列表单元格样式定义*********** */
const stuListCellStyle = ({ row, column, rowIndex, columnIndex }) => {
  if (column.property === 'name' || column.property === 'stuno') {
    return {
      color: '#86BFA8',
      textAlign: 'center',
      textDecoration: 'underline',
      cursor: 'pointer'
    };
  }
  return {
    textAlign: 'center'
  };
};

// 单元格点击事件
const stuListCellClick = (row, column, cell) => {
  // 限定只有courseName单元格才能点击
  if (column.property === 'name' || column.property === 'stuno') {
    // 将被点击的学生记录
    stuInfo.stuId = row.id;
    stuInfo.stuname = row.name;
    stuInfo.stuNo = row.stuno;
    studentGraphStore.setChartVisible(true);
    console.log(row.id);
    //TODO 此处将打开学生列表，发送请求将id传过去
  }
};

onMounted(() => {
  // TODO 此处获取课堂名单
});
</script>

<style lang="less" scoped></style>
