import { defineStore } from 'pinia';
import {
  formatClassroomGraphchartT,
  formatClassroomGraphchartS,
  formatClassroomGraphchartF
} from '../../assets/js/dynamicEvaluationPresets/StudentGraphPresets/Format';

const useClassroomGraph = defineStore('ClassroomGraph', {
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
    ]
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
    updateCharts() {
      // 获取数据后进行数据标准化
      const {
        timelineData: timelineDataF,
        options: optionsF,
        indicators: indicatorsF
      } = formatClassroomGraphchartF(
        null,
        this.charts[0].timelineData,
        this.charts[0].options,
        this.charts[0].indicators
      );
      // console.log(indicatorsF);
      this.setChart(0, timelineDataF, optionsF, indicatorsF);

      const { response: responseS, timelineData: timelineDataS } = formatClassroomGraphchartS(
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
      } = formatClassroomGraphchartT(
        this.charts[2].response,
        this.charts[2].timelineData,
        this.charts[2].options,
        this.charts[2].indicators
      );
      this.setChart(2, timelineDataT, optionsT, null, responseT);
    }
  }
});

export default useClassroomGraph;
