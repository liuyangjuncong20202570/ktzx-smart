import {createRouter, createWebHistory} from 'vue-router';

const rolehome =['teacherhomne','adminhome','superadminhome', 'secretariatHome'];
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
        path: '/homes/:rolehome(' + rolehome.join('|') + ')',
        // path: '/homes/:rolehome(superadminhome|otherhome)',
        name: 'Homepage',
        component: () => import('../views/HomePage.vue'),
        children: [
            {
                path: 'sysmangt/rolemangt',
                name: 'Rolemangt',
                component: () => import('../components/Rolemangt.vue')
            },
            {
                path: 'sysmangt/rolepurview',
                name: 'Rolepurview',
                component: () => import('../components/Rolepurview.vue')
            },
            {
                path: 'sysmangt/termsmangt',
                name: 'TermsManagement',
                component: () => import('../components/Termsmangt.vue')
            },
            {
                path: 'sysmangt/unitsmangt',
                name: 'Unitssmangt',
                component: () => import('../components/Unitsmangt.vue')
            }
        ]
    },
];

const router = createRouter({
    history: createWebHistory('/'),
    routes,
});


export default router;