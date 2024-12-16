<template>
  <!-- 课堂列表 -->
  <GraphTemplate
    :store="classroomGraphStore"
    :handleCellClick="handleCellClick"
    :addCellStyle="addCellStyle"
    :graphList="lists"
    :titleList="titles"
    @flushList="handleFlushList"
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
  <!-- 课堂画像图表结束 -->
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { reactive, ref, onMounted, onBeforeUnmount } from 'vue';
import GraphItem from '../PublicCpns/GraphItem.vue';
import GraphChart from '../PublicCpns/GraphChart.vue';
import GraphTemplate from '../PublicCpns/GraphTemplate.vue';
import useClassroomGraph from '../../../stores/dynamicEvaluation/classroomStore';
import { radarOption } from '../../../assets/js/dynamicEvaluationPresets/StudentGraphPresets/Radar';
import { treeOption } from '../../../assets/js/dynamicEvaluationPresets/StudentGraphPresets/Treemap';
import { wordOption } from '../../../assets/js/dynamicEvaluationPresets/StudentGraphPresets/wordmap';
import { wordMapPreset } from '../../../assets/js/dynamicEvaluationPresets/StudentGraphPresets/Wordmap.js';
import parseJWT from '../../../utils/parseJWT.js';
import { ElMessage } from 'element-plus';
import useMain from '../../../stores/useMain.js';

/* ********************变量定义******************** */
// props定义
// 普通变量
const radarCmp = ref(null);
const wordmapCmp = ref(null);
const treeCmp = ref(null);
const radarInstance = radarCmp.value?.getChartInstance();
const wordInstance = wordmapCmp.value?.getChartInstance();
const treeInstance = treeCmp.value?.getChartInstance();

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
const mainStore = useMain();
const { chartVisible } = storeToRefs(classroomGraphStore);

/* ********************课堂数据定义******************** */
const titles = [
  { prop: 'classroomName', label: '课堂名称' }, //大
  { prop: 'termName', label: '学期' },
  { prop: 'courseName', label: '课程' }, //小
  { prop: 'profession', label: '专业' },
  { prop: 'teacherName', label: '主讲教师' },
  { prop: 'labTeacher', label: '实验教师' },
  { prop: 'practiceTeacher', label: '实践教师' },
  { prop: 'creator', label: '创建人' }
];

const lists = ref([]);

/* ********************方法定义******************** */
const onAbilityTimelineChanged = () => {
  // TODO:之后根据timeline的点击节点监听什么时候获取节点数据
  // TODO：1：将新的数据{插入}options中，更新
};
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
const handleCellClick = async (row, column, cell) => {
  // 限定只有courseName单元格才能点击
  if (column.property === 'classroomName') {
    // 记录学生课堂信息
    courseInfo.courseName = row.courseName;
    courseInfo.courseId = row.id;
    // 控制学生列表是否可见
    classroomGraphStore.setChartVisible(true);
    console.log(row.classroomId);
    //TODO 此处将打开学生列表，发送请求将classroomId,courseId(token中的obsid)传过去
    // await classroomGraphStore.fetchCourseEvaluation(
    //   row.classroomId,
    //   parseJWT(sessionStorage.getItem('token')).obsid,
    //   week,
    //   new Date().toISOString().split('T')[0]
    // );
    const { code, msg } = await classroomGraphStore.fetchCourseEvaluation(
      1,
      '1508003654-abbeeeba-9e13-4d5e-b0c2-254bdda7c4c9',
      14,
      // new Date().toISOString().split('T')[0]
      '2024-11-26'
    );
    if (!(code === 200 && msg === 'success')) {
      ElMessage({
        type: 'error',
        message: msg
      });
      return;
    }
    console.log(classroomGraphStore.ability, classroomGraphStore.keyword, classroomGraphStore.unit);
    initChart(14);
  }
};

// 需要传递第几周作业，默认第一周
const initChart = (week = 1) => {
  // 渲染图表
  // 加载数据前清空图表
  radarInstance?.clear();
  wordInstance?.clear();
  treeInstance?.clear();
  classroomGraphStore.updateCharts(week);
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
};

// 获取课堂列表
const initList = async () => {
  const { code, msg } = await classroomGraphStore.fetchCourseList(
    parseJWT(sessionStorage.getItem('token')).obsid
  );
  if (!(code === 200 && msg === 'success')) {
    ElMessage({
      type: 'error',
      message: msg
    });
    return;
  }
  lists.value = classroomGraphStore.courseList;
  // console.log(classroomGraphStore.courseList);
};

// 模糊搜索
const handleFlushList = () => {
  lists.value = classroomGraphStore.courseList;
  mainStore.setDynamicSearchloading(false);
};

onMounted(async () => {
  initList();
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
  classroomGraphStore.setChart(0);
  classroomGraphStore.setChart(1);
  classroomGraphStore.setChart(2);
});
</script>

<style lang="less" scoped></style>
