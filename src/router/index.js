import {createRouter, createWebHistory} from 'vue-router';

const rolehome =['teacherhomne','adminhome','superadminhome'];
const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login.vue')
    },
    {
        path: '/:rolehome(superadminhome|otherhome)',
        name: 'Homepage',
        component: () => import('../views/HomePage.vue'),
        children: [
            {
                path: 'rolemangt',
                name: 'Rolemangt',
                component: () => import('../components/Rolemangt.vue')
            },
            {
                path: 'rolepurview',
                name: 'Rolepurview',
                component: () => import('../components/Rolepurview.vue')
            }
        ]
    },

];

const router = createRouter({
    history: createWebHistory('/'),
    routes,
});


export default router;