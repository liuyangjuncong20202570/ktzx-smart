import { defineStore } from 'pinia';

const useStudentGraph = defineStore('StudentGraph', {
  state: () => ({
    // 学生列表是否打开
    stuListVisible: false,
    // 图表是否打开
    chartVisible: false
  }),
  // 此处用于定义异步请求函数与state状态管理
  actions: {
    setStuListVisible(payload) {
      this.stuListVisible = payload;
    },
    setChartVisible(payload) {
      this.chartVisible = payload;
    }
  }
});

export default useStudentGraph;
