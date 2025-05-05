import { defineStore } from 'pinia';
import _ from 'lodash';
import { expStuList } from '../../api/dynamic';
import { getTestList, getStuList } from '@/api/portraitManagt.js';
import {
  changeOrder,
  delStuList,
  generatePortrait,
  getTestAllList,
  insertTests
} from '../../api/portraitManagt';

const usePortrait = defineStore('PortraitMangt', {
  state: () => ({
    testInfo: [],
    // 作业数组
    testLists: [],
    // 图表是否打开
    chartVisible: false,
    // 作业表单是否打开
    listVisible: false,
    // 已交作业学生名单
    submitTestsLists: [
      { id: 0, name: '李静', stuno: '202131', classno: '自xx-1' },
      { id: 1, name: '李明', stuno: '202132', classno: '自xx-1' },
      { id: 2, name: '金立', stuno: '202133', classno: '自xx-1' }
    ],
    // 用于轮询
    taskid: ''
  }),
  // 此处用于定义异步请求函数与state状态管理
  actions: {
    setTaskId(payload) {
      this.taskid = payload;
    },
    setChartVisible(payload) {
      this.chartVisible = payload;
    },
    setTestList(payload) {
      this.testLists = _.cloneDeep(payload);
    },
    setSubmitTestsLists(payload) {
      this.submitTestsLists = _.cloneDeep(payload);
    },
    setListVisible(payload) {
      this.listVisible = payload;
    },
    async fetchTestList(classroomId) {
      const { code, msg, data } = await getTestList(classroomId);
      this.testLists = data;
      return { code, msg };
    },
    async fetchSubmitList(testId) {
      const { code, msg, data } = await getStuList(testId);
      this.submitTestsLists = data;
      return { code, msg };
    },
    async fetchDelStuList(arr) {
      return await delStuList(arr);
    },
    async fetchGenerateInstant(courseId, classroomId, stuIdList, paperIdList) {
      const { code, msg, data } = await generatePortrait(
        courseId,
        classroomId,
        stuIdList,
        paperIdList
      );
      this.taskid = data;
      console.log(this.taskid);
      return { code, msg };
    },
    async fetchChangeOrder(classroomId, arr) {
      return await changeOrder(classroomId, arr);
    },
    async fetchAllTests(classroomId) {
      const { code, msg, data } = await getTestAllList(classroomId);
      this.testInfo = data;
      return { code, msg };
    },
    async fetchInsertTests(arr) {
      return insertTests(arr);
    },
    async fetchExpStuList(id, classname) {
      const { data, result, message } = await expStuList(id);
      this.submitTestsLists = data.data.map(item => ({
        id: item.stuId,
        userName: item.name,
        stuNo: item.stuNo,
        obsName: classname
      }));
      return { result, message };
    }
  }
});

export default usePortrait;
