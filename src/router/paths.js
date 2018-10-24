export default [
  {
    path: '*',
    meta: {
      public: true
    },
    redirect: {
      path: '/404'
    }
  },
  {
    path: '/404',
    meta: {
      public: true
    },
    name: 'NotFound',
    component: () => import(
      '@/pages/errors/NotFound.vue'
    )
  },
  {
    path: '/403',
    meta: {
      public: true
    },
    name: 'AccessDenied',
    component: () => import(
      '@/pages/errors/Deny.vue'
    )
  },
  {
    path: '/500',
    meta: {
      public: true
    },
    name: 'ServerError',
    component: () => import(
      '@/pages/errors/ServerError.vue'
    )
  },
  {
    path: '/login',
    meta: {
      public: true,
    },
    name: 'Login',
    component: () => import(
      '@/pages/Login.vue'
    )
  },
  {
    path: '/',
    meta: { },
    name: 'Root',
    redirect: {
      name: 'Dashboard'
    }
  },
  {
    path: '/dashboard',
    meta: {
      breadcrumb: true
    },
    props: true,
    name: 'Dashboard',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/menus/Dashboard.vue'
    )
  },
  {
    path: '/duties',
    meta: { },
    name: 'Duties',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/menus/Duties.vue'
    )
  },
  {
    path: '/social',
    meta: { },
    name: 'Social',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/menus/Social.vue'
    )
  },
  {
    path: '/contacts',
    meta: { },
    name: 'Contacts',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/menus/Contacts.vue'
    )
  },
  {
    path: '/registration',
    meta: { public: false },
    name: 'Registration',
    component: () => import(
      /* webpackChunkName: "routes" */
      /* webpackMode: "lazy-once" */
      '@/pages/Registration.vue'
    )
  }
]