import { defineStore } from 'pinia';

const useStudentGraph = defineStore('StudentGraph', {
  state: () => ({
    // 学生列表是否打开
    listVisible: false,
    // 图表是否打开
    chartVisible: false
  }),
  // 此处用于定义异步请求函数与state状态管理
  actions: {
    setListVisible(payload) {
      this.listVisible = payload;
    },
    setChartVisible(payload) {
      this.chartVisible = payload;
    }
  }
});

export default useStudentGraph;
