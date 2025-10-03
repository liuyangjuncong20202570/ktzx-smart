import { defineStore } from 'pinia';

const useInstructor = defineStore('Instructor', {
  state: () => ({
    isDefaultTerm: false
  }),
  actions: {
    changeDefaultTerm(payload) {
      this.isDefaultTerm = payload;
    }
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'isDefaultTerm',
        storage: sessionStorage,
        paths: ['isDefaultTerm']
      }
    ]
  }
});

export default useInstructor;
