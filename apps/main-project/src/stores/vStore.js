import { defineStore } from 'pinia';
import {
  bindV,
  createType,
  createV,
  deleteType,
  deleteValue,
  getV,
  updateType,
  updateV
} from '../api/v';

const useV = defineStore('v', {
  // 存放数据
  state: () => ({
    vList: []
  }),
  // 存放异步请求函数
  actions: {
    async fetchV() {
      const { code, msg, data } = await getV();
      this.vList = data;
      return {
        code,
        msg
      };
    },
    async fetchBindV(kwaId, kwaValueTagBindReqList) {
      const { code, msg } = await bindV(kwaId, kwaValueTagBindReqList);
      return {
        code,
        msg
      };
    },
    async fetchUpdateV(payload, isValue = true) {
      if (isValue) {
        const { code, msg } = await updateV(payload);
        return {
          code,
          msg
        };
      } else {
        const { code, msg } = await updateType(payload);
        return {
          code,
          msg
        };
      }
    },
    async fetchCreate(payload, isValue) {
      let res;
      if (isValue) {
        res = await createV(payload);
      } else {
        res = await createType(payload);
      }
      return {
        code: res.code,
        msg: res.msg
      };
    },
    async fetchDelete(payload, isValue) {
      let res;
      if (isValue) {
        res = await deleteValue(payload);
      } else {
        res = await deleteType(payload);
      }
      return {
        code: res.code,
        msg: res.msg
      };
    }
  }
});

export default useV;
