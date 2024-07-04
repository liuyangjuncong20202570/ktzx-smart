import {createRouter, createWebHistory,onBeforeRouteLeave } from 'vue-router';

const rolehome = ['teacherhomne', 'adminhome', 'superadminhome', 'secretariatehome'];

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login.vue')
    },
    {
        path: '/homes/studenthome',
        name: 'StudentHomePage',
        component: () => import('../views/studentHomePage.vue')
    },
    {
        path: '/homes/studentcourses',
        name: 'StudentCoursePage',
        component: () => import('../views/StudentCoursePage.vue')
    },
    {
        path: '/homes/:rolehome(' + rolehome.join('|') + ')',
        name: 'Homepage',
        component: () => import('../views/teacherHomePage.vue'),
        children: [
            {
                path: 'sysmangt/rolemangt',
                name: 'Rolemangt',
                component: () => import('../components/admin/Rolemangt.vue')
            },
        ]
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/login'
    },
];
const router = createRouter({
    history: createWebHistory('/'),
    routes,
});
router.beforeEach((to, from, next) => {
    const storedUserInfo = sessionStorage.getItem('users');
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    if (requiresAuth && !storedUserInfo) {
        next({ name: 'Login' });
    } else {
        next();
    }
});
export default router;