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
    <template #title>课堂画像：{{ courseInfo.courseName }}</template>
    <!-- TODO：此处需要对每个图表的公共部分进行封装，同时每个组件的私有部分需要单独写，否则会共享同一个配置项 -->
    <!-- TODO：使用store进行存储每一个配置项私有部分 -->
    <template #GraphItem>
      <GraphItem
        title="能力画像"
        :onTimelineChanged="onAbilityTimelineChanged"
        chartHeight="65"
        :chartOption="currentRadarOption"
      />
      <GraphItem
        title="关键字画像"
        :onTimelineChanged="onKWTimelineChanged"
        :chartOption="currentWordOption"
        ref="wordmapCmp"
      />
      <GraphItem title="KWA画像" />
      <GraphItem title="知识单元画像" :chartOption="currentTreeOption" />
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
import useClassroomGraph from '../../../stores/dynamicEvaluation/classroomStore';
import { radarOption } from '../../../assets/js/dynamicEvaluationPresets/StudentGraphPresets/Radar';
import { treeOption } from '../../../assets/js/dynamicEvaluationPresets/StudentGraphPresets/Treemap';
import { wordOption } from '../../../assets/js/dynamicEvaluationPresets/StudentGraphPresets/wordmap';
import { wordMapPreset } from '../../../assets/js/dynamicEvaluationPresets/StudentGraphPresets/Wordmap.js';
/* ********************变量定义******************** */
// props定义
// 普通变量
const wordmapCmp = ref(null);

const courseInfo = reactive({
  courseName: '',
  curriculumId: 0, //课程id
  courseId: 0 //课堂id
});

const currentRadarOption = ref({});
const currentWordOption = ref({});
const currentTreeOption = ref({});

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

onMounted(async () => {
  // TODO 此处获取课堂名单
  // 渲染图表
  classroomGraphStore.updateCharts();
  currentRadarOption.value = {
    ...radarOption(
      classroomGraphStore.charts[0].timelineData,
      classroomGraphStore.charts[0].options,
      classroomGraphStore.charts[0].indicators
    )
  };
  currentWordOption.value = {
    ...wordOption(
      classroomGraphStore.charts[1].timelineData,
      classroomGraphStore.charts[1].response.wordCloudData[0]
    )
  };
  currentTreeOption.value = {
    ...treeOption(
      classroomGraphStore.charts[2].timelineData,
      classroomGraphStore.charts[2].options,
      classroomGraphStore.charts[2].response
    )
  };
  // provide('indicators');
});
</script>

<style lang="less" scoped></style>
