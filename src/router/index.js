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
            },
            {
                path: '/page/taskMgmt/prevTask',
                name: 'TaskMgmtAssignGrading',
                component: () => import('../views/page/taskMgmt/prevTask/index.vue')
            },
            // 学生端
            {
                path: '/page/job/list',
                component: () => import('../views/page/job/index.vue')
            },
            {
                path: '/page/job/jobAnswer',
                component: () => import('../views/page/job/jobAnswer/index.vue')
            },
            {
                path: '/page/job/jobWjList',
                component: () => import('../views/page/job/jobWjList/index.vue')
            },
            {
                path: '/page/job/jobWjDt',
                component: () => import('../views/page/job/jobWjDt/index.vue')
            },
            // 调查问卷相关
            {
                path: '/page/ques/list',
                component: () => import('../views/page/ques/list/index.vue')
            },
            {
                path: '/page/ques/edit',
                component: () => import('../views/page/ques/edit/index.vue')
            },
            {
                path: '/page/ques/studentList',
                component: () => import('../views/page/ques/studentList/index.vue')
            },
            {
                path: '/page/ques/view',
                component: () => import('../views/page/ques/view/index.vue')
            },
            // 学生端问卷
            {
                path: '/page/stuQues/list',
                component: () => import('../views/page/stuQues/index.vue')
            },
            {
                path: '/page/stuQues/detail',
                component: () => import('../views/page/stuQues/detail/index.vue')
            },
            // 实验
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
            // {
            //     path: '/page/job/jobWjDt',
            //     component: () => import('../views/page/job/jobWjDt/index.vue')
            // },
            // {
            //     path: '/page/job/jobWjDt',
            //     component: () => import('../views/page/job/jobWjDt/index.vue')
            // },
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
