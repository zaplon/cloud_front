import Vue from 'vue'
import Router from 'vue-router'

// Containers
import Full from '@/containers/Full'
import Account from '@/containers/Account'
import Setup from '@/containers/Setup'

// Views
import Dashboard from '@/views/Dashboard'
import Calendar from '@/views/Calendar'
import Icd10 from '@/views/Icd10'
import Medicines from '@/views/Medicines'
import Patients from '@/views/Patients'
import Stats from '@/views/Stats'
import Visit from '@/views/visit/Visit'

import Step1 from '@/views/setup/Step1'
import Step2 from '@/views/setup/Step2'

import Login from '@/views/account/Login'
import Register from '@/views/account/Register'
import Reset from '@/views/account/Reset'

import store from '@/store'
import {Account as AccountApi} from '@/api'
Vue.use(Router)

var auth = {
  loggedIn: () => localStorage.token
}

var router = new Router({
  mode: 'hash',
  linkActiveClass: 'open active',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: '/setup',
      name: 'Setup',
      redirect: 'setup/1',
      component: Setup,
      children: [
        {
          path: '1',
          name: 'Step1',
          component: Step1
        },
        {
          path: '2',
          name: 'Step2',
          component: Step2
        }
      ]
    },
    {
      path: '/account',
      redirect: 'account/login',
      name: 'Account',
      component: Account,
      children: [
        {
          path: 'login',
          name: 'Login',
          component: Login
        },
        {
          path: 'register',
          name: 'Register',
          component: Register
        },
        {
          path: 'reset',
          name: 'Reset',
          component: Reset
        }
      ]
    },
    {
      path: '/',
      redirect: '/dashboard',
      name: 'Home',
      component: Full,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: Dashboard
        },
        {
          path: 'stats',
          name: 'Stats',
          component: Stats

        },
        {
          path: 'calendar',
          name: 'Calendar',
          component: Calendar
        },
        {
          path: 'icd10',
          name: 'Icd10',
          component: Icd10
        },
        {
          path: 'patients',
          name: 'Patients',
          component: Patients
        },
        {
          path: 'medicines',
          name: 'Medicines',
          component: Medicines
        }
      ]
    },
    {
      path: '/visit/:id/',
      name: 'Visit',
      component: Visit,
      meta: { requiresAuth: true }
    }
  ]
})
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!auth.loggedIn()) {
      next({
        path: '/account/login',
        query: { redirect: to.fullPath }
      })
    } else {
      console.log(store.state)
      if (!store.state.user.id) {
        AccountApi.getUserData().then(response => { console.log('loaded'); next() })
      } else { next() }
    }
  } else {
    next() // make sure to always call next()!
  }
})

export default router
