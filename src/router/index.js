/*
 * @Date: 2024-07-05 09:17:48
 * @LastEditors: Ming
 * @LastEditTime: 2024-07-16 15:01:20
 * @FilePath: \smarttt_ktzx\src\router\index.js
 */
import {createRouter, createWebHashHistory,onBeforeRouteLeave } from 'vue-router';

const rolehome = ['teacherhomne', 'adminhome', 'superadminhome', 'secretariatehome','coursemanagerhome'];

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
    // {
    //     path: '/homes/studentcourses',
    //     name: 'StudentCoursePage',
    //     component: () => import('../views/StudentCoursePage.vue')
    // },
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
        path: '/page',
        name: 'Page',
        component: () => import('../views/page/index.vue'),
        children: [
            {
                path: '/page/courseLib',
                name: 'CourseLib',
                component: () => import('../views/page/courseLib/index.vue')
            },
            {
                path: '/page/type',
                name: 'CourseLibType',
                component: () => import('../views/page/courseLib/type/index.vue')
            },
            {
                path: '/page/sync',
                name: 'CourseLibSycn',
                component: () => import('../views/page/courseLib/sync/index.vue')
            },
            {
                path: '/page/practice',
                name: 'Practice',
                component: () => import('../views/page/practice/index.vue')
            },
            {
                path: '/page/student',
                name: 'Student',
                component: () => import('../views/page/practice/student/index.vue')
            },
            {
                path: '/page/practiceInfo',
                name: 'PracticeInfo',
                component: () => import('../views/page/practice/info/index.vue')
            },
            {
                path: '/page/correct',
                name: 'PracticeCorrect',
                component: () => import('../views/page/practice/correct/index.vue')
            },
        ]
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/login'
    },

];
const router = createRouter({
    history: createWebHashHistory(''),
    routes,
});
router.beforeEach((to, from, next) => {
    console.log('to', to)
    const storedUserInfo = sessionStorage.getItem('users');
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    if (requiresAuth && !storedUserInfo) {
        next({ name: 'Login' });
    } else {
        next();
    }
});
export default router;
