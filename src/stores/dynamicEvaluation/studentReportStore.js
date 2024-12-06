import { defineStore } from 'pinia';
import {
  formatStudentReportGraphchartF,
  formatStudentReportGraphchartS,
  formatStudentReportGraphchartT
} from '../../assets/js/dynamicEvaluationPresets/StudentGraphPresets/Format';

const useStudentReport = defineStore('StudentReport', {
  state: () => ({
    // 学生列表是否打开
    listVisible: false,
    // 图表是否打开
    chartVisible: false,

    //  该模块下所有组件数据
    charts: [
      { timelineData: [], options: [], response: [] || {}, indicators: [], xData: [], values: [] },
      { timelineData: [], options: [], response: [] || {}, indicators: [], expected: [] },
      { timelineData: [], options: [], response: [] || {}, indicators: [], xData: [], values: [] }
    ]
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
      this.charts[index].values = values;
    }, // 定义获取图表数据异步函数
    updateCharts() {
      // 获取数据后进行数据标准化
      const { xData: xDataF, values: valuesF } = formatStudentReportGraphchartF(
        null,
        null,
        null,
        null,
        this.charts[0].xData,
        this.charts[0].values
      );
      this.setChart(0, null, null, null, null, xDataF, valuesF);

      const { options: optionsS, indicators: indicatorsS } = formatStudentReportGraphchartS(
        null,
        null,
        this.charts[1].options,
        this.charts[1].indicators
      );
      this.setChart(1, null, optionsS, indicatorsS);

      const { xData: xDataT, values: valuesT } = formatStudentReportGraphchartT(
        null,
        null,
        null,
        null,
        this.charts[0].xData,
        this.charts[0].values
      );
      this.setChart(2, null, null, null, null, xDataT, valuesT);

      // const { response: responseS, timelineData: timelineDataS } = formatStudentGraphchartS(
      //   this.charts[1].response,
      //   this.charts[1].timelineData,
      //   this.charts[1].options,
      //   this.charts[1].indicators
      // );
      // this.setChart(1, timelineDataS, null, null, responseS);

      // const {
      //   timelineData: timelineDataT,
      //   options: optionsT,
      //   response: responseT
      // } = formatStudentGraphchartT(
      //   this.charts[2].response,
      //   this.charts[2].timelineData,
      //   this.charts[2].options,
      //   this.charts[2].indicators
      // );
      // this.setChart(2, timelineDataT, optionsT, null, responseT);
    }
  }
});

export default useStudentReport;
