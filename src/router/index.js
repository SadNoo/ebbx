import Vue from 'vue'
import Router from 'vue-router'
import IndexPage from '@/pages/IndexPage'
import AnimePage from '@/pages/AnimePage'
import NotFoundPage from '@/pages/NotFoundPage'

const ArticlePage = () => import('@/pages/ArticlePage')
const SearchPage = () => import('@/pages/SearchPage')
const WhatAnimePage = () => import('@/pages/WhatAnimePage')
const HistoryPage = () => import('@/pages/HistoryPage')
const AppsPage = () => import('@/pages/AppsPage')
const AboutPage = () => import('@/pages/AboutPage')
const TimelinePage = () => import('@/pages/TimelinePage')
const DirectoryPage = () => import('@/pages/DirectoryPage')
const LoginPage = () => import('@/pages/account/LoginPage')
const AccountPage = () => import('@/pages/account/AccountPage')

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'index',
      component: IndexPage,
      meta: { title: '新番連載' },
    },
    {
      path: '/account/login',
      name: 'login',
      component: LoginPage,
      meta: { title: '登入', requiresNoAuth: true },
    },
    {
      path: '/account',
      name: 'account',
      component: AccountPage,
      meta: { title: '帳號', requiresAuth: true },
    },
    {
      path: '/anime',
      redirect: '/browse/all',
    },
    {
      path: '/search',
      name: 'search',
      component: SearchPage,
      meta: { title: '搜尋' },
    },
    {
      path: '/search\\:sbi',
      name: 'what-anime',
      component: WhatAnimePage,
      meta: { title: '以圖搜尋' },
    },
    {
      path: '/watch-history',
      name: 'watch-history',
      component: HistoryPage,
      meta: { title: '播放紀錄', requiresAuth: true },
    },
    {
      path: '/apps',
      name: 'apps',
      component: AppsPage,
      meta: { title: 'Apps' },
    },
    {
      path: '/about',
      name: 'about',
      component: AboutPage,
      meta: { title: '關於' },
    },
    {
      path: '/timeline',
      name: 'timeline',
      component: TimelinePage,
      meta: { title: '動畫時間軸' },
    },
    {
      path: '/anime/:animeId(\\d+)x:seasonId(\\d+)(/.*)?',
      name: 'anime',
      component: AnimePage,
      meta: { title: '讀取中' },
    },
    {
      path: '/article/:title',
      name: 'article',
      component: ArticlePage,
      meta: { title: '專題介紹' },
    },
    {
      path: '/browse/:path(.*[^/])',
      name: 'directory',
      component: DirectoryPage,
      meta: { title: '動畫列表' },
    },
    {
      path: '*',
      name: 'not-found',
      component: NotFoundPage,
      meta: { title: '404' },
    },
  ],
})
