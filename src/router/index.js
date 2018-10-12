import Vue from 'vue'
import Router from 'vue-router'
import paths from './paths'
import auth from '@/auth/'

Vue.use(Router)

const router = new Router({
  routes: paths
})

router.beforeEach((to, from, next) => {
  if (!to.meta.public && !auth.loggedIn()) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
})

export default router
