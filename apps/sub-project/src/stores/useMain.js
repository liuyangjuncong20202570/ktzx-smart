import { defineStore } from 'pinia';

const useMain = defineStore('Main', {
  state: () => ({
    selectedRoute: '',
    isLoading: false,
    dynamicSearchloading: false
  }),
  actions: {
    setSelectedRoute(route) {
      this.selectedRoute = route;
    },
    setLoading(payload) {
      this.isLoading = payload;
    },
    setDynamicSearchloading(payload) {
      this.dynamicSearchloading = payload;
    }
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'selectedRoute',
        storage: sessionStorage,
        paths: ['selectedRoute']
      },
      {
        key: 'isLoading',
        storage: sessionStorage,
        paths: ['isLoading']
      }
    ]
  }
});

export default useMain;
