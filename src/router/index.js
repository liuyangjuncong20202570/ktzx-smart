import {createRouter, createWebHistory,onBeforeRouteLeave } from 'vue-router';

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
                name: 'TermsManagement',
                component: () => import('../components/TermMangt.vue')
            },
            {
                path: 'sysmangt/creatteachunit',
                name: 'Unitssmangt',
                component: () => import('../components/CreateTeachUnit.vue')
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

onBeforeRouteLeave((to, from, next) => {
    // 检查用户是否已经登录
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');

    // 如果用户从登录页面离开，且没有登录标志，则清除sessionStorage中的用户信息
    if (from.path === '/login' && !isLoggedIn) {
        sessionStorage.removeItem('users');
    }

    next();
});

router.beforeEach((to, from, next) => {
    // 尝试从 sessionStorage 中获取用户信息
    const storedUserInfo = sessionStorage.getItem('users');

    // 检查目标路由是否需要认证（假设需要认证的路由有一个'meta'字段）
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

    if (requiresAuth && !storedUserInfo) {
        // 如果目标路由需要认证，但没有存储的用户信息，则重定向到登录页面
        next({ name: 'Login' });
    } else {
        // 如果不需要认证，或者用户信息存在，则正常导航
        next();
    }
});


export default router;