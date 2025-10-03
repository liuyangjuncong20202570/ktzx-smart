import { defineStore } from 'pinia';
import {
  getCourseEvaluation,
  getCourseList,
  getCourseSearch,
  getEvaluationTimes
} from '../../api/dynamic';
import {
  formatClassroomGraphchartT,
  formatClassroomGraphchartS,
  formatClassroomGraphchartF
} from '../../assets/js/dynamicEvaluationPresets/StudentGraphPresets/Format';

const useCourseGraph = defineStore('CourseGraph', {
  state: () => ({
    // 学生列表是否打开
    stuListVisible: false,
    // 图表是否打开
    chartVisible: false,
    //  该模块下所有组件数据
    charts: [
      { timelineData: [], options: [], response: [] || {}, indicators: [], expected: [] },
      { timelineData: [], options: [], response: [] || {}, indicators: [] },
      { timelineData: [], options: [], response: [] || {}, indicators: [] }
    ],
    // 课堂列表
    courseList: [],
    // 评价总次数
    totalTimes: 0
  }),
  // 此处用于定义异步请求函数与state状态管理
  actions: {
    setStuListVisible(payload) {
      this.stuListVisible = payload;
    },
    setChartVisible(payload) {
      this.chartVisible = payload;
    },
    setChart(index, timelineData = [], options = [], indicators = [], response = []) {
      if (index > 2) return;
      this.charts[index].response = response;
      this.charts[index].timelineData = timelineData;
      this.charts[index].options = options;
      this.charts[index].indicators = indicators;
    }, // 定义获取图表数据异步函数
    updateCharts(num, isInit = true, which = 0) {
      // 获取数据后进行数据标准化
      if (which === 1) {
        formatClassroomGraphchartF(
          this.charts[0].response,
          this.charts[0].timelineData,
          this.charts[0].options,
          this.charts[0].indicators,
          num,
          isInit
        );
      } else if (which === 2) {
        formatClassroomGraphchartS(
          this.charts[1].response,
          this.charts[1].timelineData,
          this.charts[1].options,
          this.charts[1].indicators,
          num,
          isInit
        );
      } else if (which === 3) {
        formatClassroomGraphchartT(
          this.charts[2].response,
          this.charts[2].timelineData,
          this.charts[2].options,
          this.charts[2].indicators,
          num,
          isInit
        );
      } else {
        formatClassroomGraphchartF(
          this.charts[0].response,
          this.charts[0].timelineData,
          this.charts[0].options,
          this.charts[0].indicators,
          num,
          isInit
        );

        formatClassroomGraphchartS(
          this.charts[1].response,
          this.charts[1].timelineData,
          this.charts[1].options,
          this.charts[1].indicators,
          num,
          isInit
        );

        formatClassroomGraphchartT(
          this.charts[2].response,
          this.charts[2].timelineData,
          this.charts[2].options,
          this.charts[2].indicators,
          num,
          isInit
        );
      }
    },
    // 获取课堂列表
    async fetchCourseList(payload) {
      const { code, msg, data } = await getCourseList(payload);
      if (code === 200 && msg === 'success') {
        this.courseList = data;
      }
      return { code, msg };
    },
    // 获取课堂评价
    async fetchCourseEvaluation(classroomId, courseId, num) {
      const { code, msg, data } = await getCourseEvaluation(classroomId, courseId, num);
      if (code === 200 && msg === 'success') {
        this.charts[0].response = data.ability;
        (this.charts[1].response = data.keyword), (this.charts[2].response = data.unitTree);
      }
      return { code, msg };
    },
    // 模糊搜索
    async fetchSearchList(courseId, search) {
      const { code, msg, data } = await getCourseSearch(courseId, search);
      this.courseList = data;
      return { code, msg };
    },
    // 获取总体评价次数
    async fetchEvaluationTimes(courseId, classroomId) {
      const { code, msg, data } = await getEvaluationTimes(courseId, classroomId);
      this.totalTimes = data;
      return { code, msg };
    }
  }
});

export default useCourseGraph;
