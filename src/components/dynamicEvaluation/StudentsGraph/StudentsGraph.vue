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
import { getCourseId } from '@/utils/searchCourseId.js';
import GraphChart from '../PublicCpns/GraphChart.vue';
import GraphItem from '../PublicCpns/GraphItem.vue';
import parseJWT from '../../../utils/parseJWT.js';
import { ElMessage, ElMessageBox } from 'element-plus';
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
const currentWordIndex = ref(0);
const courseId = ref('');
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
  { prop: 'proName', label: '专业' },
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
const onAbilityTimelineChanged = async params => {
  // 如果保存的options中的配置数据为空，则发送请求，否则直接使用
  if (currentRadarOption.value.options[params.currentIndex].series[0].data[0].value.length === 0) {
    const { code, msg } = await studentGraphStore.fetchGraphEvaluation(
      stuInfo.classroomId,
      // '292104772-9c9f88f0-7af9-438c-a117-e2efc2020b7b',
      stuInfo.stuId,
      courseId.value,
      // '1508003654-abbeeeba-9e13-4d5e-b0c2-254bdda7c4c9',
      params.currentIndex + 1
    );
    if (!(code === 200 && msg === 'success')) {
      ElMessage({
        type: 'error',
        message: msg
      });
    }
    // 渲染数据
    initChart(params.currentIndex + 1, false, 'WORD');
  }
  currentRadarOption.value.baseOption.timeline.currentIndex = params.currentIndex;
  currentRadarOption.value.baseOption.graphic.style.text = `当前展示第${
    params.currentIndex + 1
  }次评价，已评价${studentGraphStore.totalTimes}次`;
};

const onKWTimelineChanged = async params => {
  // 更新词云中的内容
  // 更新词云中的内容
  currentWordIndex.value = params.currentIndex;
  if (studentGraphStore.charts[1].options[currentWordIndex.value].length === 0) {
    const { code, msg } = await studentGraphStore.fetchGraphEvaluation(
      stuInfo.classroomId,
      // '292104772-9c9f88f0-7af9-438c-a117-e2efc2020b7b',
      stuInfo.stuId,
      courseId.value,
      // '1508003654-abbeeeba-9e13-4d5e-b0c2-254bdda7c4c9',
      params.currentIndex + 1
    );
    if (!(code === 200 && msg === 'success')) {
      ElMessage({
        type: 'error',
        message: msg
      });
    }
    const chartInstance = wordmapCmp.value?.getChartInstance();
    // wordInstance.dispose();
    // wordmapCmp.value = null;

    chartInstance.setOption(
      {
        series: [
          {
            ...wordMapPreset,
            data: studentGraphStore.charts[1].options[currentWordIndex.value]
          }
        ]
      },
      { replaceMerge: 'series' }
    );
  }
  initChart(params.currentIndex + 1, false, 'WORD');
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
const stuListCellClick = async (row, column, cell) => {
  // 限定只有courseName单元格才能点击
  if (column.property === 'userName' || column.property === 'stuno') {
    // 将被点击的学生记录
    stuInfo.stuId = row.userId;
    stuInfo.stuname = row.userName;
    stuInfo.stuNo = row.stuno;
    console.log(row.id);
    //TODO 此处将打开具体学生评价画像，需要在此调用initChart方法
    // 1：获取总评价次数
    const { code: timeCode, msg: timeMsg } = await studentGraphStore.fetchEvaluationTimes(
      courseId.value,
      stuInfo.classroomId
      // '292104772-9c9f88f0-7af9-438c-a117-e2efc2020b7b'
    );
    if (!(timeCode === 200 && timeMsg === 'success')) {
      ElMessage({
        type: 'error',
        message: timeMsg + '或暂无相关评价'
      });
      return;
    }
    studentGraphStore.setChartVisible(true);
    const { code, msg } = await studentGraphStore.fetchGraphEvaluation(
      stuInfo.classroomId,
      stuInfo.stuId,
      // '292104772-9c9f88f0-7af9-438c-a117-e2efc2020b7b',
      courseId.value,
      // '1508003654-abbeeeba-9e13-4d5e-b0c2-254bdda7c4c9',
      // studentGraphStore.totalTimes
      3
    );
    if (!(code === 200 && msg === 'success')) {
      ElMessage({
        type: 'error',
        message: msg
      });
      return;
    }
    // 按业务来说，拿到的是最近一次的评价，也就是第六次
    // 但是这里由于只有第三次有数据，所以我让他初始化的时间节点是第三次，但是由于options中插入的数据是在数组末尾
    // 所以这里显示的最新节点的数据是第三次的评价，而当前第三次数据是空的

    initChart(studentGraphStore.totalTimes);
    // 这段代码之后要删除(已注释)！
    // currentRadarOption.value.baseOption.timeline.currentIndex = 2;
    currentRadarOption.value.baseOption.graphic.style.text = `当前展示第${studentGraphStore.totalTimes}次评价，已评价${studentGraphStore.totalTimes}次`;
  }
};

// 需要传递第几次作业，默认最新一次评价
const initChart = (num = studentGraphStore.totalTimes, isInit, which = 'all') => {
  // TODO 此处获取课堂名单
  // 加载数据前清空图表
  radarInstance?.clear();
  wordInstance?.clear();
  treeInstance?.clear();
  // 渲染图表
  studentGraphStore.updateCharts(num, isInit);

  if (which === 'RADAR') {
    currentRadarOption.value = {
      ...radarOption(
        studentGraphStore.charts[0].timelineData,
        studentGraphStore.charts[0].options,
        studentGraphStore.charts[0].indicators
      )
    };
  } else if (which === 'WORD') {
    try {
      const chartInstance = wordmapCmp.value?.getChartInstance();
      wordInstance.dispose();
      wordmapCmp.value = null;

      chartInstance.setOption(
        {
          series: [
            {
              ...wordMapPreset,
              data: studentGraphStore.charts[1].options[currentWordIndex.value]
            }
          ]
        },
        { replaceMerge: 'series' }
      );

      currentWordOption.value.timeline.currentIndex = currentWordIndex.value;
      currentWordOption.value.graphic[1].style.text = `当前展示第${
        currentWordIndex.value + 1
      }次评价，已评价${studentGraphStore.totalTimes}次`;
    } catch (error) {
      console.log(error);
    }
  } else if (which === 'TREE') {
    currentTreeOption.value = {
      ...treeOption(
        studentGraphStore.charts[2].timelineData,
        studentGraphStore.charts[2].options,
        studentGraphStore.charts[2].response
      )
    };
  } else {
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
        studentGraphStore.charts[1].options[studentGraphStore.totalTimes - 1]
      )
    };
    currentTreeOption.value = {
      ...treeOption(
        studentGraphStore.charts[2].timelineData,
        studentGraphStore.charts[2].options,
        studentGraphStore.charts[2].response
      )
    };
  }
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
  const role = JSON.parse(sessionStorage.getItem('users'));
  if (role.rolename === '任课教师') {
    const { code, msg, data } = await getCourseId(parseJWT(sessionStorage.getItem('token')).obsid);
    if (code === 200 && msg === 'success') {
      courseId.value = data;
    }
  } else {
    courseId.value = parseJWT(sessionStorage.getItem('token')).obsid;
  }
  const { code, msg } = await studentGraphStore.fetchStuGraCourseList(
    // parseJWT(sessionStorage.getItem('token')).obsid
    courseId.value
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
  // initChart();
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
