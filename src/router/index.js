import Vue from 'vue'
import Router from 'vue-router'
import paths from './paths'
import auth from '@/auth/'

Vue.use(Router)

const router = new Router({
  routes: paths
})

router.beforeEach((to, from, next) => {
  let requiresAuth = !to.meta.public

  if (requiresAuth) {
    if (auth.loggedIn()) {
      next()
    } else {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    }
  } else {
    if (auth.loggedIn()) {
      next({
        path: '/'
      })
    } else {
      next()
    }
  }
})

export default router
