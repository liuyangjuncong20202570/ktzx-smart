/*
 * @Date: 2024-07-05 09:17:48
 * @LastEditors: Ming
 * @LastEditTime: 2024-07-16 15:01:20
 * @FilePath: \smarttt_ktzx\src\router\index.js
 */
import {createRouter, createWebHashHistory,onBeforeRouteLeave, createWebHistory } from 'vue-router';

const rolehome = ['teacherhomne', 'adminhome', 'superadminhome', 'secretariatehome','coursemanagerhome', 'courseteacherhome', 'studenthome', 'page'];
const pathHeader = `/homes/:rolehome(${rolehome.join('|')})`

console.log('pathHeader', pathHeader)
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
        component: () => import('../views/studentCoursePage.vue'),
        children: [
            // 学生端我的作业
            {
                path: pathHeader + '/exam/myhomework',
                component: () => import('../views/page/job/index.vue')
            },
            {
                path: pathHeader + '/exam/jobAnswer',
                component: () => import('../views/page/job/jobAnswer/index.vue')
            },
            {
                path: pathHeader + '/exam/jobWjList',
                component: () => import('../views/page/job/jobWjList/index.vue')
            },
            // 学生端实验
            {
                path: pathHeader + '/exam/myexperiment',
                component: () => import('../views/page/stuPractice/index.vue')
            },
            {
                path: pathHeader + '/exam/submitPractice',
                component: () => import('../views/page/stuPractice/submitPractice/index.vue')
            },
            // 学生端问卷
            {
                path: pathHeader + '/exam/myquestionnaire',
                component: () => import('../views/page/stuQues/index.vue')
            },
            {
                path: pathHeader + '/exam/detail',
                component: () => import('../views/page/stuQues/detail/index.vue')
            },
        ]
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
            // 课程页
            {
                path: pathHeader + '/exam/coursequelib',
                component: () => import('../views/page/courseLib/index.vue')
            },
            {
                path: pathHeader + '/exam/coursequelib/type',
                component: () => import('../views/page/courseLib/type/index.vue')
            },
            {
                path: pathHeader + '/exam/coursequelib/sync',
                component: () => import('../views/page/courseLib/sync/index.vue')
            },
            // 课堂页
            {
                path: pathHeader + '/exam/classroomquelib',
                component: () => import('../views/page/classroomLib/index.vue')
            },
            {
                path: pathHeader + '/exam/classroomquelib/classroomQTS',
                component: () => import('../views/page/classroomLib/type/index.vue')
            },
            // 作业测试
            {
                path: pathHeader + '/exam/test/testmangt',
                component: () => import('../views/page/taskMgmt/index.vue')
            },
            {
                path: pathHeader + '/exam/test/past',
                component: () => import('../views/page/taskMgmt/prevTask/index.vue')
            },
            {
                path: pathHeader + '/exam/test/taskMgmt/view',
                component: () => import('../views/page/taskMgmt/view/index.vue')
            },
            {
                path: pathHeader + '/exam/test/tpAssembly',
                component: () => import('../views/page/taskMgmt/tpAssembly/index.vue')
            },
            {
                path: pathHeader + '/exam/test/taskList',
                component: () => import('../views/page/taskMgmt/taskList/index.vue')
            },
            {
                path: pathHeader + '/exam/test/assignGrading',
                component: () => import('../views/page/taskMgmt/assignGrading/index.vue')
            },
            // 实验
            {
                path: pathHeader + '/exam/experimental/labmangt',
                component: () => import('../views/page/practice/index.vue')
            },
            {
                path: pathHeader + '/exam/experimental/view',
                component: () => import('../views/page/practice/view/index.vue')
            },
            {
                path: pathHeader + '/exam/experimental/student',
                component: () => import('../views/page/practice/student/index.vue')
            },
            {
                path: pathHeader + '/exam/experimental/practiceInfo',
                component: () => import('../views/page/practice/info/index.vue')
            },
            {
                path: pathHeader + '/exam/experimental/correct',
                component: () => import('../views/page/practice/correct/index.vue')
            },
            // 问卷
            {
                path: pathHeader + '/exam/questionnaire',
                component: () => import('../views/page/ques/list/index.vue')
            },
            {
                path: pathHeader + '/exam/edit',
                component: () => import('../views/page/ques/edit/index.vue')
            },
            {
                path: pathHeader + '/exam/studentList',
                component: () => import('../views/page/ques/studentList/index.vue')
            },
            {
                path: pathHeader + '/exam/view',
                component: () => import('../views/page/ques/view/index.vue')
            }
        ]
    },
    {
        path: pathHeader + '/page',
        name: 'Page',
        component: () => import('../views/page/index.vue'),
        children: [
            // 课程页面
            {
                path: '/page/courseLib',
                component: () => import('../views/page/courseLib/index.vue')
            },
            {
                path: '/page/courseLib/type',
                component: () => import('../views/page/courseLib/type/index.vue')
            },
            {
                path: '/page/courseLib/sync',
                component: () => import('../views/page/courseLib/sync/index.vue')
            },
            // 课堂页面
            {
                path: '/page/classroomLib',
                component: () => import('../views/page/classroomLib/index.vue')
            },
            {
                path: '/page/classroomLib/type',
                component: () => import('../views/page/classroomLib/type/index.vue')
            },
            // 作业管理
            {
                path: '/page/taskMgmt',
                component: () => import('../views/page/taskMgmt/index.vue')
            },
            {
                path: '/page/taskMgmt/view',
                component: () => import('../views/page/taskMgmt/view/index.vue')
            },
            {
                path: '/page/taskMgmt/tpAssembly',
                component: () => import('../views/page/taskMgmt/tpAssembly/index.vue')
            },
            {
                path: '/page/taskMgmt/taskList',
                component: () => import('../views/page/taskMgmt/taskList/index.vue')
            },
            {
                path: '/page/taskMgmt/assignGrading',
                component: () => import('../views/page/taskMgmt/assignGrading/index.vue')
            },
            {
                path: '/page/taskMgmt/prevTask',
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
            // {
            //     path: '/page/job/jobWjDt',
            //     component: () => import('../views/page/job/jobWjDt/index.vue')
            // },
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
                component: () => import('../views/page/practice/index.vue')
            },
            {
                path: '/page/student',
                component: () => import('../views/page/practice/student/index.vue')
            },
            {
                path: '/page/practiceInfo',
                component: () => import('../views/page/practice/info/index.vue')
            },
            {
                path: '/page/correct',
                component: () => import('../views/page/practice/correct/index.vue')
            },
            // 学生端实验
            {
                path: '/page/stuPractice',
                component: () => import('../views/page/stuPractice/index.vue')
            },
            {
                path: '/page/stuPractice/submitPractice',
                component: () => import('../views/page/stuPractice/submitPractice/index.vue')
            }
        ]
    },
    // {
    //     path: '/:pathMatch(.*)*',
    //     redirect: '/login'
    // },

];
const router = createRouter({
    // history: createWebHashHistory(''),
    history: createWebHistory('/'),
    routes,
});
router.beforeEach((to, from, next) => {
    console.log('to', to)
    const storedUserInfo = sessionStorage.getItem('users');
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    if (requiresAuth && !storedUserInfo) {
        next({ name: 'Login' });
        // next();
    } else {
        next();
    }
});
export default router;
