import { defineStore } from 'pinia';
import { addIdea, delIdea, fuzzyIdea, getIdea, updateIdea } from '../api/idealogy';

const useIdealogy = defineStore('Idealogy', {
  state: () => ({
    ideaList: []
  }),
  actions: {
    async fetchIdeaList() {
      const { code, msg, data } = await getIdea();
      this.ideaList = data;
      return {
        code,
        msg
      };
    },
    async fetchAddIdea({ vname, remark }) {
      const { code, msg } = await addIdea(vname, remark);
      return { code, msg };
    },
    async fetchDelIdea(idList) {
      const { data } = await delIdea(idList);
      return { data };
    },
    async fetchUpdIdea(payload) {
      const { code, msg } = await updateIdea(payload);
      return {
        code,
        msg
      };
    },
    async fetchFuzzyQuery(payload) {
      const { code, msg, data } = await fuzzyIdea(payload);
      this.ideaList = data;
      return { code, msg };
    }
  }
});

export default useIdealogy;
