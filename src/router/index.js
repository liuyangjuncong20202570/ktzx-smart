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
                path: '/page/courseLib/type',
                name: 'CourseLibType',
                component: () => import('../views/page/courseLib/type/index.vue')
            },
            {
                path: '/page/courseLib/sync',
                name: 'CourseLibSycn',
                component: () => import('../views/page/courseLib/sync/index.vue')
            },
            {
                path: '/page/classroomLib',
                name: 'ClassroomLib',
                component: () => import('../views/page/classroomLib/index.vue')
            },
            {
                path: '/page/classroomLib/type',
                name: 'ClassroomLibType',
                component: () => import('../views/page/classroomLib/type/index.vue')
            },
            // 作业管理
            {
                path: '/page/taskMgmt',
                name: 'TaskMgmt',
                component: () => import('../views/page/taskMgmt/index.vue')
            },
            {
                path: '/page/taskMgmt/view',
                name: 'TaskMgmtView',
                component: () => import('../views/page/taskMgmt/view/index.vue')
            },
            {
                path: '/page/taskMgmt/tpAssembly',
                name: 'TaskMgmtTpAssembly',
                component: () => import('../views/page/taskMgmt/tpAssembly/index.vue')
            },
            {
                path: '/page/taskMgmt/taskList',
                name: 'TaskMgmtTaskList',
                component: () => import('../views/page/taskMgmt/taskList/index.vue')
            },
            {
                path: '/page/taskMgmt/assignGrading',
                name: 'TaskMgmtAssignGrading',
                component: () => import('../views/page/taskMgmt/assignGrading/index.vue')
            }
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
