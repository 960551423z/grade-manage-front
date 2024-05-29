import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import Home from '../views/home.vue';
import 'nprogress/nprogress.css';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/student',
    },
    {
        path: '/',
        name: 'Home',
        component: Home,
        children: [
            {
                path: '/student',
                name: 'student',
                meta: {
                    title: '学生管理',
                    requiresAuth: true
                },
                component: () => import( '../views/system/user.vue'),
            },
            {
                path: '/course',
                name: 'course',
                meta: {
                    title: '课程管理',
                    requiresAuth: true
                },
                component: () => import( '../views/system/course.vue'),
            },
            {
                path: '/grade',
                name: 'grade',
                meta: {
                    title: '成绩管理',
                    requiresAuth: true
                },
                component: () => import( '../views/system/grade.vue'),
            },
            {
                path: '/ucenter',
                name: 'ucenter',
                meta: {
                    title: '个人中心',
                    requiresAuth: true
                },
                component: () => import('../views/pages/ucenter.vue'),
            },
        ],
    },
    {
        path: '/login',
        meta: {
            title: '登录',
            noAuth: true,
        },
        component: () => import('../views/pages/login.vue'),
    },
    {
        path: '/register',
        meta: {
            title: '注册',
            noAuth: true,
        },
        component: () => import('../views/pages/register.vue'),
    },
    {
        path: '/403',
        meta: {
            title: '没有权限',
            noAuth: true,
        },
        component: () => import('../views/pages/403.vue'),
    },
    {
        path: '/404',
        meta: {
            title: '找不到页面',
            noAuth: true,
        },
        component: () => import('../views/pages/404.vue'),
    },
    { path: '/:path(.*)', redirect: '/404' },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem('authToken'); // 检查是否有 token
    if (to.meta.requiresAuth && !isAuthenticated) {
        // 如果需要认证的路由但未登录，则重定向到登录页面
        next({ path: '/login' });
    } else {
        // 否则允许访问
        next();
    }
});

// router.afterEach(() => {
//     NProgress.done();
// });

export default router;
