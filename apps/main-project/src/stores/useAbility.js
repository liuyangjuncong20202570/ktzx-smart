import { defineStore } from 'pinia';
import { getCourseManagerAbility, getProfessionAbility } from '../api/ability';

const useAbility = defineStore('Ability', {
  state: () => ({
    initializeData: {}
  }),
  actions: {
    async fetchProfessionAbility() {
      const res = await getProfessionAbility();
      this.initializeData = res;
    },
    async fetchCourseAbility() {
      const res = await getCourseManagerAbility();
      this.initializeData = res;
    }
  }
});

export default useAbility;
