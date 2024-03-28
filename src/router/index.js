import {createRouter, createWebHistory,onBeforeRouteLeave } from 'vue-router';

const rolehome =['teacherhomne','adminhome','superadminhome','secretariatehome','academicaffairshome','deanhome',
    'departmenthome','majormanagerhome','coursemanagerhome',];
// superadminhome 超级管理员首页
// secretariatehome 教学秘书首页
// academicaffairshome 教务处首页
// deanhome 学院负责人首页
// departmenthome 系主任首页
// majormanagerhome 专业负责人首页 
// coursemanagerhome 课程负责人首页

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
        component: () => import('../views/teacherHomePage.vue'),
        children: [
            {
                path: 'sysmangt/rolemangt',
                name: 'Rolemangt', //角色管理
                component: () => import('../components/admin/Rolemangt.vue')
            },
            {
                path: 'sysmangt/rolepurview',
                name: 'Rolepurview', //角色授权
                component: () => import('../components/admin/Rolepurview.vue')
            },
            {
                path: 'sysmangt/termmangt',
                name: 'TermsManagement', //学期管理
                component: () => import('../components/admin/TermMangt.vue')
            },
            {
                path: 'sysmangt/creatteachunit',
                name: 'Unitssmangt', //教学单位管理
                component: () => import('../components/admin/CreateTeachUnit.vue')
            },
            {
                path: 'sysmangt/peoplemangt',
                name: 'PeopleManagement', //人员管理
                component: () => import('../components/admin/Peoplemangt.vue')
            },
            {
                path: 'sysmangt/collegemangt',
                name: 'Collegecollegemangt', //学院管理
                component: () => import('../components/admin/Collegemangt.vue')
            },
            {
                path: 'sysmangt/departmentmangt',
                name: 'Departmentmangt', //部门管理
                component: () => import('../components/admin/Departmentmangt.vue')
            },
            {
                path: 'sysmangt/professionmangt',
                name: 'Professionmangt', //专业管理
                component: () => import('../components/admin/Professionmangt.vue')
            },
            {
                path: 'sysmangt/classmangt',
                name: 'Classmangt', //专业班级管理
                component: () => import('../components/admin/Classmangt.vue')
            },
            {
                path: 'coursemangt/coursemangt',    // 课程管理
                name: 'CourseManagement',
                component: () => import('../components/course/Coursemangt.vue')
            },
            {
                path: 'coursemangt/abilitydictionary',  // 能力字典
                name: 'AbilityDictionary',
                component: () => import('../components/course/AbilityDictionary.vue')
            },
            {
                path: 'coursemanagerhomepage',  // 课程负责人首页
                name: 'CourseManagerHomePage',
                component: () => import('../components/course/CourseManagerHomePage.vue')
            },
            {
                path: 'evasys/courseinfo/formative/keyword',    // 形成性评价模型-关键字
                name: 'Keyword',
                component: () => import('../components/evaluation/Keyword.vue')
            },
            {
                path: 'evasys/courseinfo/formative/ability',    // 形成性评价模型-能力
                name: 'Ability',
                component: () => import('../components/evaluation/Ability.vue')
            },
            {
                path: 'evasys/courseinfo/formative/teachingobjectives', // 形成性评价模型-基本教学目标
                name: 'TeachingObjectives',
                component: () => import('../components/evaluation/TeachingObjectives.vue')
            },
            {
                path: 'evasys/courseinfo/formative/knowledgeunit', // 形成性评价模型-知识单元
                name: 'KnowledgeUnit',
                component: () => import('../components/evaluation/KnowledgeUnit.vue')
            },
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