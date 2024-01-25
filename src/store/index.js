import { createStore } from 'vuex';
import moduleA from './modules/moduleA';
import moduleB from './modules/moduleB';

const store = createStore({
    state: {
        // 这里是根状态
    },
    mutations: {
        // 这里是根 mutations
    },
    actions: {
        // 这里是根 actions
    },
    modules: {
        // 这里添加模块
        moduleA,
        moduleB,
    },
});

export default store;
