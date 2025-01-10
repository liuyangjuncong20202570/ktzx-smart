import { defineStore } from 'pinia';
import _ from 'lodash';

const usePortrait = defineStore('PortraitMangt', {
  state: () => ({
    // 作业数组
    testLists: [],
    // 图表是否打开
    chartVisible: false,
    // 已交作业学生名单
    submitTestsLists: [
      { id: 0, name: '李静', stuno: '202131', classno: '自xx-1' },
      { id: 1, name: '李明', stuno: '202132', classno: '自xx-1' },
      { id: 2, name: '金立', stuno: '202133', classno: '自xx-1' }
    ]
  }),
  // 此处用于定义异步请求函数与state状态管理
  actions: {
    setChartVisible(payload) {
      this.chartVisible = payload;
    },
    setTestList(payload) {
      this.testLists = _.cloneDeep(payload);
    },
    setSubmitTestsLists(payload) {
      this.submitTestsLists = _.cloneDeep(payload);
    }
  }
});

export default usePortrait;
