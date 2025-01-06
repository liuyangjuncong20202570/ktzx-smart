import { defineStore } from 'pinia';
import {
  formatStudentReportGraphchartF,
  formatStudentReportGraphchartS,
  formatStudentReportGraphchartT
} from '../../assets/js/dynamicEvaluationPresets/StudentGraphPresets/Format';
import {
  getReportEvaluation,
  getStuRepCourseList,
  getstuRepSearch,
  getStuRepStudentList
} from '../../api/dynamic';

const useStudentReport = defineStore('StudentReport', {
  state: () => ({
    // 学生列表是否打开
    listVisible: false,
    // 图表是否打开
    chartVisible: false,

    //  该模块下所有组件数据
    charts: [
      { timelineData: [], options: [], response: [] || {}, indicators: [], xData: [], values: [] },
      {
        timelineData: [],
        options: [],
        response: [] || {},
        indicators: [],
        expected: [],
        expectdValue: []
      },
      { timelineData: [], options: [], response: [] || {}, indicators: [], xData: [], values: [] }
    ],
    courseList: [],
    studentlist: []
  }),
  // 此处用于定义异步请求函数与state状态管理
  actions: {
    setListVisible(payload) {
      this.listVisible = payload;
    },
    setChartVisible(payload) {
      this.chartVisible = payload;
    },
    setChart(
      index,
      timelineData = [],
      options = [],
      indicators = [],
      response = [],
      xData = [],
      values = []
    ) {
      if (index > 2) return;
      this.charts[index].response = response;
      this.charts[index].timelineData = timelineData;
      this.charts[index].options = options;
      this.charts[index].indicators = indicators;
      this.charts[index].xData = xData;
      (this.charts[index].expected = xData), (this.charts[index].expectdValue = values);
      this.charts[index].values = values;
    }, // 定义获取图表数据异步函数
    updateCharts() {
      // 获取数据后进行数据标准化
      formatStudentReportGraphchartF(
        this.charts[0].response,
        null,
        null,
        null,
        this.charts[0].xData,
        this.charts[0].values
      );

      formatStudentReportGraphchartS(
        null,
        this.charts[1].response,
        this.charts[1].options,
        this.charts[1].indicators,
        this.charts[1].expected,
        this.charts[1].expectdValue
      );

      formatStudentReportGraphchartT(
        this.charts[2].response,
        null,
        null,
        null,
        this.charts[2].xData,
        this.charts[2].values
      );
    },
    // 获取课堂列表
    async fetchStuRepCourseList(courseId) {
      const { code, msg, data } = await getStuRepCourseList(courseId);
      this.courseList = data;
      return { code, msg };
    },
    // 获取学生列表
    async fetchStuRepStudnetList(testId) {
      const { code, msg, data } = await getStuRepStudentList(testId);
      this.studentlist = data;
      return { code, msg };
    },
    // 模糊搜索
    async fetchSearchList(courseId, search) {
      const { code, msg, data } = await getstuRepSearch(courseId, search);
      this.courseList = data;
      return { code, msg };
    },
    // 获取评价
    async fetchReportEvaluation(classroomId, stuId, courseId, paperId) {
      const { code, msg, data } = await getReportEvaluation(classroomId, stuId, courseId, paperId);
      if (code === 200 && msg === 'success') {
        this.charts[0].response = data.keyword;
        this.charts[1].response = data.ability;
        this.charts[1].expected = data.classAbility;
        this.charts[2].response = data.kwa;
      }
      return { code, msg };
    }
  }
});

export default useStudentReport;
