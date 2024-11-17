import { defineStore } from 'pinia';

const useMain = defineStore('Main', {
  state: () => ({
    selectedRoute: ''
  }),
  actions: {
    setSelectedRoute(route) {
      this.selectedRoute = route;
    }
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'selectedRoute',
        storage: sessionStorage,
        paths: ['selectedRoute']
      }
    ]
  }
});

export default useMain;
