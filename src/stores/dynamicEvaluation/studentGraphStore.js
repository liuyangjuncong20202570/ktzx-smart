import { defineStore } from 'pinia';
import {
  formatStudentGraphchartT,
  formatStudentGraphchartS,
  formatStudentGraphchartF
} from '../../assets/js/dynamicEvaluationPresets/StudentGraphPresets/Format';
import { getStuGraCourseList, getstuGraSearch, getStuGraStudentList } from '../../api/dynamic';

const useStudentGraph = defineStore('StudentGraph', {
  state: () => ({
    // 学生列表是否打开
    listVisible: false,
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
    // 学生列表
    studentList: []
  }),
  // 此处用于定义异步请求函数与state状态管理
  actions: {
    setListVisible(payload) {
      this.listVisible = payload;
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
    updateCharts() {
      // 获取数据后进行数据标准化
      const {
        timelineData: timelineDataF,
        options: optionsF,
        indicators: indicatorsF
      } = formatStudentGraphchartF(
        null,
        this.charts[0].timelineData,
        this.charts[0].options,
        this.charts[0].indicators
      );
      this.setChart(0, timelineDataF, optionsF, indicatorsF);

      const { response: responseS, timelineData: timelineDataS } = formatStudentGraphchartS(
        this.charts[1].response,
        this.charts[1].timelineData,
        this.charts[1].options,
        this.charts[1].indicators
      );
      this.setChart(1, timelineDataS, null, null, responseS);

      const {
        timelineData: timelineDataT,
        options: optionsT,
        response: responseT
      } = formatStudentGraphchartT(
        this.charts[2].response,
        this.charts[2].timelineData,
        this.charts[2].options,
        this.charts[2].indicators
      );
      this.setChart(2, timelineDataT, optionsT, null, responseT);
    },
    // 获取课程列表
    async fetchStuGraCourseList(courseId) {
      const { code, msg, data } = await getStuGraCourseList(courseId);
      this.courseList = data;
      return { code, msg };
    },
    // 获取学生名单
    async fetchStuGraStudentlist(classroomId) {
      const { code, msg, data } = await getStuGraStudentList(classroomId);
      this.studentList = data;
      return { code, msg };
    },
    // 搜索功能
    async fetchSearchList(courseId, search) {
      const { code, msg, data } = await getstuGraSearch(courseId, search);
      this.courseList = data;
      return { code, msg };
    }
  }
});

export default useStudentGraph;
