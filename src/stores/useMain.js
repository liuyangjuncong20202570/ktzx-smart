import { defineStore } from 'pinia';

const useMain = defineStore('Main', {
  state: () => ({
    selectedRoute: '',
    isLoading: false
  }),
  actions: {
    setSelectedRoute(route) {
      this.selectedRoute = route;
    },
    setLoading(payload) {
      this.isLoading = payload;
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
