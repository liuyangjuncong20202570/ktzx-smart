<template>
  <!-- 课堂列表 -->
  <GraphTemplate
    :store="studentGraphStore"
    :handleCellClick="handleCellClick"
    :addCellStyle="addCellStyle"
    :graphList="lists"
    :titleList="titles"
    @flushList="handleFlushList"
    keyword="请输入课堂名称关键字检索"
  />
  <!-- 课堂列表结束 -->
  <!-- 学生列表浮窗 -->
  <DynamicStudentList
    :store="studentGraphStore"
    :handleCellClick="stuListCellClick"
    :addCellStyle="stuListCellStyle"
    :studentList="studentLists"
    :studentListTitle="studentTitles"
  >
    <template #title>画像学生列表</template>
  </DynamicStudentList>
  <!-- 学生列表浮窗结束 -->
  <!-- 图标列表 -->
  <!-- 在GraphChart组件的具名插槽中可以插入GraphItem，可自定义图表 -->
  <GraphChart :store="studentGraphStore">
    <template #title
      >学生课程画像：{{ stuInfo.courseName }} - {{ stuInfo.stuname }}({{ stuInfo.stuNo }})</template
    >
    <template #GraphItem>
      <GraphItem
        title="能力画像"
        :onTimelineChanged="onAbilityTimelineChanged"
        chartHeight="65"
        :chartOption="currentRadarOption"
        ref="radarCmp"
      />
      <GraphItem
        title="关键字画像"
        :onTimelineChanged="onKWTimelineChanged"
        :chartOption="currentWordOption"
        ref="wordmapCmp"
      />
      <GraphItem title="KWA画像" />
      <GraphItem ref="treeCmp" title="知识单元画像" :chartOption="currentTreeOption" />
    </template>
  </GraphChart>
  <!-- 图标列表结束 -->
</template>

<script setup>
import { storeToRefs } from 'pinia';
import GraphChart from '../PublicCpns/GraphChart.vue';
import GraphItem from '../PublicCpns/GraphItem.vue';
import parseJWT from '../../../utils/parseJWT.js';
import { wordMapPreset } from '../../../assets/js/dynamicEvaluationPresets/StudentGraphPresets/Wordmap.js';
import { radarOption } from '../../../assets/js/dynamicEvaluationPresets/StudentGraphPresets/Radar';
import { treeOption } from '../../../assets/js/dynamicEvaluationPresets/StudentGraphPresets/Treemap';
import { wordOption } from '../../../assets/js/dynamicEvaluationPresets/StudentGraphPresets/wordmap';
import useStudentGraph from '../../../stores/dynamicEvaluation/studentGraphStore';
import DynamicStudentList from '../PublicCpns/DynamicStudentList.vue';
import GraphTemplate from '../PublicCpns/GraphTemplate.vue';
import { onMounted, reactive, ref, nextTick, onBeforeUnmount } from 'vue';
import useMain from '../../../stores/useMain.js';

/* ********************变量定义******************** */
// props
// 普通变量
const currentTreeOption = ref({});
const currentRadarOption = ref({});
const currentWordOption = ref({});

// echarts实例
const radarCmp = ref(null);
const wordmapCmp = ref(null);
const treeCmp = ref(null);
const radarInstance = radarCmp.value?.getChartInstance();
const wordInstance = wordmapCmp.value?.getChartInstance();
const treeInstance = treeCmp.value?.getChartInstance();

const stuInfo = reactive({
  stuId: 0, //学生id
  courseName: '', //课程名称
  classroomId: 0, //课堂id
  courseName: '',
  stuname: '',
  stuNo: ''
});

// pinia状态
const studentGraphStore = useStudentGraph();
const mainStore = useMain();
const { stuListVisible, chartVisible } = storeToRefs(studentGraphStore);

/* ********************课程数据定义******************** */
const titles = [
  { prop: 'classroomName', label: '课堂名称' }, //小
  { prop: 'termName', label: '学期' },
  { prop: 'courseName', label: '课程' }, //大
  { prop: 'profession', label: '专业' },
  { prop: 'teacherName', label: '主讲教师' },
  { prop: 'labTeacher', label: '实验教师' },
  { prop: 'practiceTeacher', label: '实践教师' },
  { prop: 'creator', label: '创建人' }
];

const lists = ref([]);

/* ********************学生数据数据定义******************** */
const studentTitles = [
  { prop: 'userName', label: '姓名' },
  { prop: 'stuno', label: '学号' },
  { prop: 'obsName', label: '班级' }
];

const studentLists = ref([]);

/* ********************方法定义******************** */

/* ************课程单元格样式定义*********** */
const onAbilityTimelineChanged = event => {
  // TODO此处将会把timeline点击索引获取，保存到store中，作为图解
};

const onKWTimelineChanged = event => {
  // 更新词云中的内容
  const currentId = event.currentIndex;
  // TODO:获取关键字数据进行渲染,将在store中发送异步请求并进行重新赋值
  try {
    const chartInstance = wordmapCmp.value?.getChartInstance();
    // currentWordOption.value =
    console.log(chartInstance);
    chartInstance.setOption(
      {
        series: [
          {
            ...wordMapPreset,
            data: studentGraphStore.charts[1].response.wordCloudData[currentId]
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
  if (column.property === 'classroomName') {
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
  if (column.property === 'classroomName') {
    // 记录学生课堂信息
    stuInfo.courseName = row.courseName;
    stuInfo.classroomId = row.classroomId;
    // 控制学生列表是否可见
    studentGraphStore.setListVisible(true);
    // 获取学生列表
    initStuList(row.classroomId);
  }
};

/* ************学生列表单元格样式定义*********** */
const stuListCellStyle = ({ row, column, rowIndex, columnIndex }) => {
  if (column.property === 'userName' || column.property === 'stuno') {
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
  if (column.property === 'userName' || column.property === 'stuno') {
    // 将被点击的学生记录
    stuInfo.stuId = row.stuId;
    stuInfo.stuname = row.userName;
    stuInfo.stuNo = row.stuno;
    studentGraphStore.setChartVisible(true);
    console.log(row.id);
    //TODO 此处将打开具体学生评价画像，需要在此调用initChart方法
  }
};

const initChart = () => {
  // TODO 此处获取课堂名单
  // 加载数据前清空图表
  radarInstance?.clear();
  wordInstance?.clear();
  treeInstance?.clear();
  // 渲染图表
  studentGraphStore.updateCharts();
  currentRadarOption.value = {
    ...radarOption(
      studentGraphStore.charts[0].timelineData,
      studentGraphStore.charts[0].options,
      studentGraphStore.charts[0].indicators
    )
  };
  currentWordOption.value = {
    ...wordOption(
      studentGraphStore.charts[1].timelineData,
      studentGraphStore.charts[1].response.wordCloudData[0]
    )
  };
  currentTreeOption.value = {
    ...treeOption(
      studentGraphStore.charts[2].timelineData,
      studentGraphStore.charts[2].options,
      studentGraphStore.charts[2].response
    )
  };
};

const initStuList = async classroomId => {
  const { code, msg } = await studentGraphStore.fetchStuGraStudentlist(classroomId);
  if (!(code === 200 && msg === 'success')) {
    ElMessage({
      type: 'error',
      message: msg
    });
    return;
  }
  studentLists.value = studentGraphStore.studentList;
};

const initList = async () => {
  const { code, msg } = await studentGraphStore.fetchStuGraCourseList(
    parseJWT(sessionStorage.getItem('token')).obsid
  );
  if (!(code === 200 && msg === 'success')) {
    ElMessage({
      type: 'error',
      message: msg
    });
    return;
  }
  lists.value = studentGraphStore.courseList;
};
const handleFlushList = () => {
  lists.value = studentGraphStore.courseList;
  mainStore.setDynamicSearchloading(false);
};

onMounted(async () => {
  // 获取课程列表
  initList();
  // 此为异步操作，应为await，此处为模拟
  initChart();
});

onBeforeUnmount(() => {
  if (radarInstance || wordInstance || treeInstance) {
    radarInstance.dispose();
    radarInstance = null;
    wordInstance.dispose();
    wordInstance = null;
    treeInstance.dispose();
    treeInstance = null;
  }
  // 初始化pinia数据
  studentGraphStore.setChart(0);
  studentGraphStore.setChart(1);
  studentGraphStore.setChart(2);
});
</script>

<style lang="less" scoped></style>
