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
  <DynamicStudentList
    :store="studentReportStore"
    :handleCellClick="stuListCellClick"
    :addCellStyle="stuListCellStyle"
    :studentList="studentLists"
    :studentListTitle="studentTitles"
  >
    <template #title>画像学生列表</template>
  </DynamicStudentList>
  <!-- 学生列表浮窗结束 -->
  <!-- 课堂画像图表 -->
  <GraphChart :store="studentReportStore">
    <template #title>评价学生列表</template>
    <!-- TODO：此处需要对每个图表的公共部分进行封装，同时每个组件的私有部分需要单独写，否则会共享同一个配置项 -->
    <!-- TODO：使用store进行存储每一个配置项私有部分 -->
    <template #GraphItem>
      <GraphItem
        title="关键词评价"
        :onTimelineChanged="onAbilityTimelineChanged"
        :chartOption="currentBarFOption"
      />
      <GraphItem
        title="能力评价"
        :onTimelineChanged="onKWTimelineChanged"
        :chartOption="currentRadarOption"
        ref="wordmapCmp"
      />
      <GraphItem title="KWA评价" :chartOption="currentBarSOption" />
    </template>
  </GraphChart>
  <!-- 课堂画像图表结束 -->
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { reactive, ref, onMounted } from 'vue';
import GraphItem from '../PublicCpns/GraphItem.vue';
import GraphChart from '../PublicCpns/GraphChart.vue';
import GraphTemplate from '../PublicCpns/GraphTemplate.vue';
import DynamicStudentList from '../PublicCpns/DynamicStudentList.vue';
import useClassroomGraph from '../../../stores/dynamicEvaluation/classroomStore';
import { barOption } from '../../../assets/js/dynamicEvaluationPresets/StudentGraphPresets/Bar.js';
import { radarOption } from '../../../assets/js/dynamicEvaluationPresets/StudentGraphPresets/Radar';
import { treeOption } from '../../../assets/js/dynamicEvaluationPresets/StudentGraphPresets/Treemap';
import { wordOption } from '../../../assets/js/dynamicEvaluationPresets/StudentGraphPresets/wordmap';
import { wordMapPreset } from '../../../assets/js/dynamicEvaluationPresets/StudentGraphPresets/Wordmap.js';
import useStudentReport from '../../../stores/dynamicEvaluation/studentReportStore.js';
/* ********************变量定义******************** */
// props定义
// 普通变量
const wordmapCmp = ref(null);

const stuInfo = reactive({
  stuId: 0, //学生id
  curriculumId: 0, //课程id
  courseId: 0, //课堂id
  courseName: '',
  stuname: '',
  stuNo: ''
});

const currentBarFOption = ref({});
const currentRadarOption = ref({});
const currentBarSOption = ref({});

// pinia状态管理
const studentReportStore = useStudentReport();

/* ********************课堂数据定义******************** */
const titles = [
  { prop: 'testName', label: '考试/作业名称' }, //大
  { prop: 'paperName', label: '试卷名称' },
  { prop: 'course', label: '课堂' }, //小
  { prop: 'curriculum', label: '课程' }, //小
  { prop: 'submit', label: '提交人' },
  { prop: 'submitTime', label: '提交时间' },
  { prop: 'note', label: '备注' }
];

const lists = [
  {
    id: 0,
    testName: '2024-春-RTC原理及应用',
    paperName: '第十六章-RTC原理及应用',
    course: '单片机原理及应用I-2023春-自实验21',
    curriculum: '单片机原理及应用I（STM32）',
    submit: '赵仁涛',
    submitTime: '2024-07-10 09:17:53',
    note: ''
  },
  {
    id: 3,
    testName: '2024-春-ADC+DMA综合应用',
    paperName: '第十五章-ADC+DMA综合应用',
    course: '单片机原理及应用I-2023春-自实验21',
    curriculum: '单片机原理及应用I（STM32）',
    submit: '赵仁涛',
    submitTime: '2024-07-10 09:17:29',
    note: ''
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
const onKWTimelineChanged = event => {
  // 更新词云中的内容
  const currentId = event.currentIndex;
  // TODO:获取关键字数据进行渲染,将在store中发送异步请求并进行重新赋值
  try {
    const chartInstance = wordmapCmp.value?.getChartInstance();
    // currentWordOption.value =
    // console.log(chartInstance);
    chartInstance.setOption(
      {
        series: [
          {
            ...wordMapPreset,
            data: classroomGraphStore.charts[1].response.wordCloudData[currentId]
          }
        ]
      },
      { replaceMerge: 'series' }
    );
  } catch (error) {
    console.log(error);
  }
};
// 单元格样式定义
const addCellStyle = ({ row, column, rowIndex, columnIndex }) => {
  if (column.property === 'testName') {
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
  if (column.property === 'testName') {
    // 记录学生课堂信息
    stuInfo.courseName = row.courseName;
    stuInfo.courseId = row.id;
    // 控制学生列表是否可见
    studentReportStore.setListVisible(true);
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
    studentReportStore.setChartVisible(true);
    console.log(row.id);
    //TODO 此处将打开学生列表，发送请求将id传过去
  }
};

onMounted(async () => {
  // TODO 此处获取课堂名单
  // 渲染图表
  studentReportStore.updateCharts();
  currentBarFOption.value = {
    ...barOption(studentReportStore.charts[0].xData, studentReportStore.charts[0].values)
  };
  const options = radarOption(
    null,
    studentReportStore.charts[1].options,
    studentReportStore.charts[1].indicators,
    false
  );
  // 更改配置项
  options.baseOption.legend.show = false;
  options.baseOption.graphic.invisible = true;
  currentRadarOption.value = {
    ...options
  };
  currentBarSOption.value = {
    ...barOption(studentReportStore.charts[2].xData, studentReportStore.charts[2].values)
  };
});
</script>

<style lang="less" scoped></style>
