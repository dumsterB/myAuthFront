import {createRouter, createWebHistory, type RouteRecordRaw} from 'vue-router'


const routes: Array<RouteRecordRaw> = [
    {
        path: '/signIn',
        name: 'SignIn',
        component: () => import("../src/views/auth/signIn.vue")
    },
    {
        path: '/signUp',
        name: 'SignUp',
        component: () => import("../src/views/auth/signUp.vue")
    },
    {
        path: '/user',
        name: 'User',
        component: () => import("../src/views/user/index.vue")
    }
]
const router = createRouter({
    history: createWebHistory('/'),
    routes
});

export default router