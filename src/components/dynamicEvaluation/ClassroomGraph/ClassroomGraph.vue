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
  <!-- 课堂画像图表 -->
  <GraphChart :store="classroomGraphStore">
    <template #title>学生课程画像：{{ courseInfo.courseName }}</template>
    <template #GraphItem>
      <GraphItem title="能力画像" :chartOption="radarOption" />
      <GraphItem title="关键字画像" :chartOption="wordOption" />
      <GraphItem title="KWA画像" />
      <GraphItem title="知识单元画像" :chartOption="treeOption" />
    </template>
  </GraphChart>
  <!-- 课堂画像图表结束 -->
</template>

<script setup>
import { reactive } from 'vue';
import { storeToRefs } from 'pinia';
import GraphItem from '../PublicCpns/GraphItem.vue';
import GraphChart from '../PublicCpns/GraphChart.vue';
import GraphTemplate from '../PublicCpns/GraphTemplate.vue';
import useClassroomGraph from '../../../stores/dynamicEvaluation/classroomStore';
import { radarOption } from '../../../assets/js/dynamicEvaluationPresets/StudentGraphPresets/Radar';
import { treeOption } from '../../../assets/js/dynamicEvaluationPresets/StudentGraphPresets/Treemap';
import { wordOption } from '../../../assets/js/dynamicEvaluationPresets/StudentGraphPresets/wordmap';
/* ********************变量定义******************** */
// props定义
// 普通变量
const courseInfo = reactive({
  courseName: '',
  curriculumId: 0, //课程id
  courseId: 0 //课堂id
});
// pinia状态管理
const classroomGraphStore = useClassroomGraph();
const { chartVisible } = storeToRefs(classroomGraphStore);

/* ********************课堂数据定义******************** */
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

/* ********************方法定义******************** */
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
    courseInfo.courseName = row.courseName;
    courseInfo.courseId = row.id;
    // 控制学生列表是否可见
    classroomGraphStore.setChartVisible(true);
    console.log(row.id);
    //TODO 此处将打开学生列表，发送请求将id传过去
  }
};
</script>

<style lang="less" scoped></style>
