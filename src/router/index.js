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
import Patients from '@/views/Patients'
import Stats from '@/views/Stats'
import Tabs from '@/views/Tabs'
import Archive from '@/views/Archive'
import Templates from '@/views/Templates'
import Forms from '@/views/Forms'
import Visit from '@/views/visit/Visit'

import {default as MedicinesIndex} from '@/views/medicines/Index'
import Medicines from '@/views/medicines/Medicines'
import Medicine from '@/views/medicines/Medicine'

import {default as PrescriptionsIndex} from '@/views/prescriptions/Index'
import Prescriptions from '@/views/prescriptions/Prescriptions'
import Prescription from '@/views/prescriptions/Prescription'

import Step1 from '@/views/setup/Step1'
import Step2 from '@/views/setup/Step2'

import Login from '@/views/account/Login'
import Register from '@/views/account/Register'
import Reset from '@/views/account/Reset'

import Booking from '@/views/Booking'

import NoPermissions from '@/views/NoPermissions'

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
      path: '/rezerwacja',
      name: 'Rezerwacja',
      component: Booking
    },
    {
      path: '/brak-uprawnien',
      name: 'BrakUprawnien',
      component: NoPermissions
    },
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
      path: '/konto',
      redirect: 'konto/logowanie',
      name: 'Account',
      component: Account,
      children: [
        {
          path: 'logowanie',
          name: 'Login',
          component: Login
        },
        {
          path: 'rejestracja',
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
      meta: { requiresAuth: true, label: 'Pulpit' },
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: Dashboard
        },
        {
          path: 'statystyki',
          name: 'Stats',
          component: Stats,
          meta: {label: 'Statystyki'}

        },
        {
          path: 'kalendarz',
          name: 'Calendar',
          component: Calendar,
          meta: {label: 'Kalendarz'}
        },
        {
          path: 'icd10',
          name: 'Icd10',
          component: Icd10
        },
        {
          path: 'pacjenci',
          name: 'Patients',
          component: Patients,
          meta: {label: 'Pacjenci'}
        },
        {
          path: 'archiwum',
          name: 'Archive',
          component: Archive,
          meta: {label: 'Archiwum'}
        },
        {
          path: 'recepty',
          name: 'Recepty',
          component: PrescriptionsIndex,
          redirect: 'recepty/lista',
          children: [
            {
              path: 'lista',
              name: 'Lista',
              component: Prescriptions
            },
            {
              path: 'nowa',
              name: 'Nowa recepta',
              component: Prescription,
              props: { new: true },
              meta: {label: 'Nowa recepta'}
            },
            {
              path: ':id',
              name: 'Edycja recepty',
              component: Prescription,
              meta: {label: 'Edycja recepty'}
            }
          ]
        },
        {
          path: 'leki',
          name: 'Leki',
          component: MedicinesIndex,
          redirect: 'leki/lista',
          children: [
            {
              path: 'lista',
              name: 'Lista',
              meta: {label: 'Lista leków'},
              component: Medicines
            },
            {
              path: ':id',
              name: 'Lek',
              component: Medicine
            }
          ]
        },
        {
          path: 'zakladki',
          name: 'Tabs',
          component: Tabs,
          meta: {label: 'Zakładki'}
        },
        {
          path: 'szablony',
          name: 'Templates',
          component: Templates,
          meta: {label: 'Szablony'}
        },
        {
          path: 'formularze',
          name: 'Forms',
          component: Forms,
          meta: {label: 'Formularze'}
        }
      ]
    },
    {
      path: '/visit/:id',
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
        path: '/konto/logowanie/',
        query: { redirect: to.fullPath }
      })
    } else {
      if (!store.state.user.id) {
        AccountApi.getUserData().then(response => { next() })
      } else {
        if (to.meta.permission && !(to.meta.permission in store.state.user.user_permissions)) {
          next({
            path: '/brak-uprawnien/',
            query: { redirect: to.fullPath }
          })
        }
        next()
      }
    }
  } else {
    next() // make sure to always call next()!
  }
})

export default router
