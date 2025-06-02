import { defineStore } from 'pinia';
import { getHistoryList, usrLogin } from '../api/history';

const useHistory = defineStore('History', {
  state: () => ({
    historyList: [],
    nowToken: '',
    useObj: {},
    nowUsr: {},
    pastTerm: ''
  }),
  actions: {
    async fetchHistoryList() {
      const { code, msg, data } = await getHistoryList();
      this.historyList = data;
      return {
        code,
        msg
      };
    },
    setToken(payload) {
      this.nowToken = payload;
    },
    setUsr(payload) {
      this.nowUsr = payload;
    },
    async fetchLogin(data) {
      const { code, msg, data: useObj } = await usrLogin(data);
      this.useObj = useObj;
      return {
        code,
        msg
      };
    }
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'nowToken',
        storage: sessionStorage,
        paths: ['nowToken']
      },
      {
        key: 'nowUsr',
        storage: sessionStorage,
        paths: ['nowUsr']
      }
    ]
  }
});

export default useHistory;
