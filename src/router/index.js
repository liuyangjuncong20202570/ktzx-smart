import {createRouter, createWebHistory} from 'vue-router';

const rolehome =['teacherhomne','adminhome','superadminhome','secretariatehome'];
//superadminhome 超级管理员首页
//secretariatehome 教学秘书首页

const routes = [
    {
        path: '/:pathMatch(.*)*',
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
                path: 'sysmangt/termmangt',
                name: 'TermManagement',
                component: () => import('../components/Termmangt.vue')
            },
            {
                path: 'sysmangt/creatteachunit',
                name: 'CreatTeachUnit',
                component: () => import('../components/CreatTeachUnit.vue')
            },
            {
                path: 'sysmangt/peoplemangt',
                name: 'PeopleManagement',
                component: () => import('../components/Peoplemangt.vue')
            }
        ]
    },
];

const router = createRouter({
    history: createWebHistory('/'),
    routes,
});


export default router;