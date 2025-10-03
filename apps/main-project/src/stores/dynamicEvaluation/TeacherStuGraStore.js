import { defineStore } from 'pinia';
import _ from 'lodash';
import {
  formatStudentGraphchartT,
  formatStudentGraphchartS,
  formatStudentGraphchartF
} from '../../assets/js/dynamicEvaluationPresets/StudentGraphPresets/Format';
import {
  getStuGraCourseList,
  getstuGraSearch,
  getStuGraStudentList,
  getEvaluationTimes,
  getGraphEvaluation,
  getGraphAttendList
} from '../../api/dynamic';

const useTeacherStuGra = defineStore('TeacherStudentGraph', {
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
    studentList: [],
    // 总评价次数
    totalTimes: 0,
    // 参与评价数组
    attendEvalList: []
  }),
  // 此处用于定义异步请求函数与state状态管理
  actions: {
    setStuList(payload) {
      this.studentList = _.cloneDeep(payload);
    },
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
    updateCharts(num, isInit = true, times, which = 0) {
      // 获取数据后进行数据标准化
      if (which === 1) {
        formatStudentGraphchartF(
          this.charts[0].response,
          this.charts[0].timelineData,
          this.charts[0].options,
          this.charts[0].indicators,
          num,
          isInit,
          this.attendEvalList,
          times
        );
      } else if (which === 2) {
        formatStudentGraphchartS(
          this.charts[1].response,
          this.charts[1].timelineData,
          this.charts[1].options,
          this.charts[1].indicators,
          num,
          isInit,
          this.attendEvalList,
          times
        );
      } else if (which === 3) {
        formatStudentGraphchartT(
          this.charts[2].response,
          this.charts[2].timelineData,
          this.charts[2].options,
          this.charts[2].indicators,
          num,
          isInit,
          this.attendEvalList,
          times
        );
      } else {
        formatStudentGraphchartF(
          this.charts[0].response,
          this.charts[0].timelineData,
          this.charts[0].options,
          this.charts[0].indicators,
          num,
          isInit,
          this.attendEvalList,
          times
        );

        formatStudentGraphchartS(
          this.charts[1].response,
          this.charts[1].timelineData,
          this.charts[1].options,
          this.charts[1].indicators,
          num,
          isInit,
          this.attendEvalList,
          times
        );

        formatStudentGraphchartT(
          this.charts[2].response,
          this.charts[2].timelineData,
          this.charts[2].options,
          this.charts[2].indicators,
          num,
          isInit,
          this.attendEvalList,
          times
        );
      }
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
    },
    // 获取总评价次数
    async fetchEvaluationTimes(courseId, classroomId) {
      const { code, msg, data } = await getEvaluationTimes(courseId, classroomId);
      this.totalTimes = data;
      return { code, msg };
    },
    // 获取评价
    async fetchGraphEvaluation(classroomId, stuId, courseId, num) {
      const { code, msg, data } = await getGraphEvaluation(classroomId, stuId, courseId, num);
      if (code === 200 && msg === 'success') {
        this.charts[0].response = data.ability;
        (this.charts[1].response = data.keyword), (this.charts[2].response = data.unitTree);
      }
      return { code, msg, data };
    },
    // 获取评价次数数组
    async fetchAttenfEvalList(classroomId, stuId, courseId) {
      const { code, msg, data } = await getGraphAttendList(classroomId, stuId, courseId);
      if (code === 200 && msg === 'success') {
        this.attendEvalList = data;
      }
      return { code, msg, data };
    }
  }
});

export default useTeacherStuGra;
