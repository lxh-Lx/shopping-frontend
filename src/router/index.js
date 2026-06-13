import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

// 一级路由 - 懒加载
const Login = () => import('@/views/login')
const Layout = () => import('@/views/layout')
const Search = () => import('@/views/search')
const SearchList = () => import('@/views/search/list')
const ProDetail = () => import('@/views/prodetail')
const Pay = () => import('@/views/pay')
const MyOrder = () => import('@/views/myorder')
const AddressList = () => import('@/views/address/list')
const AddressAdd = () => import('@/views/address/add')

// 二级路由 - 懒加载
const Home = () => import('@/views/layout/home')
const Category = () => import('@/views/layout/category')
const Cart = () => import('@/views/layout/cart')
const User = () => import('@/views/layout/user')

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/login', component: Login },
    {
      path: '/',
      component: Layout,
      redirect: '/home',
      children: [
        { path: '/home', component: Home },
        { path: '/category', component: Category },
        { path: '/cart', component: Cart },
        { path: '/user', component: User }
      ]
    },
    { path: '/pay', component: Pay },
    { path: '/order', component: MyOrder },
    { path: '/search', component: Search },
    { path: '/searchlist', component: SearchList },
    { path: '/prodetail/:id', component: ProDetail },
    { path: '/address/list', component: AddressList },
    { path: '/address/add', component: AddressAdd }
  ]
})

const authUrls = ['/pay', '/order', '/address/list', '/address/add']
router.beforeEach((to, from, next) => {
  if (!authUrls.includes(to.path)) {
    next()
    return
  }
  const token = store.getters.token
  if (token) {
    next()
  } else {
    next('/login')
  }
})

export default router
