import {createRouter, createWebHistory} from 'vue-router';

const routes = [
    // {
    //     path: '/home',
    //     name: 'Home',
    //     component: () => import('../views/Home.vue')
    // },
    {
        path: '/',
        redirect: 'login'
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login.vue')
    },
    {
        path: '/homepage',
        name: 'HomePage',
        component: () => import('../views/HomePage.vue'),
        children: [
            {
                path: '/homepage/page1',
                name: 'page1',
                component: () => import('../components/Page1.vue')
            },
            {
                path: '/homepage/page2',
                name: 'page2',
                component: () => import('../components/Page2.vue')
            }]
    },


];

const router = createRouter({
    history: createWebHistory('/'),
    routes,
});

export default router;