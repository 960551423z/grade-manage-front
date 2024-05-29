import { Menus } from '@/types/menu';

export const menuData: Menus[] = [
    {
        title: '学生成绩管理',
        index: '/',
        icon: 'HomeFilled',
        children: [
            {
                index: '/student',
                title: '学生管理',
            },
            {
                index: '/course',
                title: '课程管理',
            },
            {
                index: '/grade',
                title: '成绩管理',
            },
        ],
    },
    {
        icon: 'List',
        index: '6',
        title: '其他',
        children: [
            {
                index: '/ucenter',
                title: '个人中心',
            },
            {
                index: '/login',
                title: '登录',
            },
            {
                index: '/register',
                title: '注册',
            },
        ],
    },
];
