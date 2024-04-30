import {
    createRouter,
    createWebHistory
} from 'vue-router'
import Index from '@/views/Index.vue'

const routes = [{
    path: '/',
    name: 'index',
    component: Index,
    meta: {
        title: '首页'
    }
}, {
    path: '/edit',
    name: 'edit',
    component: () => import('@/views/edit/index.vue'),
    meta: {
        title: '配置'
    }
}, {
    path: '/preview',
    name: 'preview',
    component: () => import('@/views/preview/index.vue'),
    meta: {
        title: '预览'
    }
}, {
    path: '/element',
    name: 'element',
    component: () => import('@/views/element/index.vue'),
    meta: {
        title: '元件'
    }
}, {
    path: '/demo',
    name: 'demo',
    component: () => import('@/views/demo/index.vue'),
    meta: {
        title: '工具demo'
    }
}]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    /* 路由发生变化修改页面title */
    if (to.meta.title) {
        document.title = to.meta.title
    }
    next()
})
export default router
