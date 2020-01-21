import Vue from 'vue'
import Router from 'vue-router'

// Containers
import Full from '@/containers/Full'
import Account from '@/containers/Account'
import Setup from '@/containers/Setup'
import Mobile from '@/containers/Mobile'

// Views
import {default as UsersList} from '@/views/users/List'
import AddEdit from '@/views/generic/AddEdit'
import List from '@/views/generic/List'
import Index from '@/views/generic/Index'
import Detail from '@/views/generic/Detail'

import User from '@/views/users/User'

import Dashboard from '@/views/Dashboard'
import Calendar from '@/views/Calendar'
import Icd10 from '@/views/Icd10'

import {default as PatientsIndex} from '@/views/patients/Index'
import Patients from '@/views/patients/Patients'
import Patient from '@/views/patients/Patient'
import PatientEdit from '@/views/patients/Edit'

import Stats from '@/views/Stats'
import Tabs from '@/views/Tabs'
import Archive from '@/views/Archive'
import Templates from '@/views/Templates'
import Forms from '@/views/Forms'
import Visits from '@/views/visit/Visits'
import Visit from '@/views/visit/Visit'
import SystemSettings from '@/views/SystemSettings'
import NFZSettings from '@/views/NFZSettings'

import {default as MedicinesIndex} from '@/views/medicines/Index'
import Medicines from '@/views/medicines/Medicines'
import Medicine from '@/views/medicines/Medicine'
import MedicineEdit from '@/views/medicines/MedicineEdit'

import Ezla from '@/views/ezla/Ezla'

import examinationRoutes from '@/router/examinations'
import agreementsRoutes from '@/router/agreements'
import servicesRoutes from '@/router/services'
import mobileRoutes from '@/router/mobile'
import prescriptionRoutes from '@/router/prescriptions'

// import {default as PrescriptionsIndex} from '@/views/prescriptions/Index'
// import Prescriptions from '@/views/prescriptions/Prescriptions'
// import Prescription from '@/views/prescriptions/Prescription'

import Step1 from '@/views/setup/Step1'
import Step2 from '@/views/setup/Step2'

import Login from '@/views/account/Login'
import Register from '@/views/account/Register'
import Reset from '@/views/account/Reset'
import ResetConfirm from '@/views/account/ResetConfirm'
import Validate from '@/views/account/Validate'
import MobileSet from '@/views/account/MobileSet'

import Booking from '@/views/Booking'

import NoPermissions from '@/views/NoPermissions'

import store from '@/store'
import {Account as AccountApi} from '@/api'
Vue.use(Router)

var auth = {
  loggedIn: () => localStorage.token
}

var dashboardRoutes = [
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
    meta: {label: 'Kalendarz', permission: 'change_term'}
  },
  {
    path: 'icd10',
    name: 'Icd10',
    component: Icd10
  },
  {
    path: 'ustawienia_systemowe',
    name: 'systemSettings',
    component: SystemSettings,
    meta: {label: 'Ustawienia systemowe', permission: 'view_systemsettings'},
    props: {readonly: true}
  },
  {
    path: 'edycja_ustawien_systemowych',
    name: 'systemSettingsEdit',
    component: SystemSettings,
    meta: {label: 'Edycja ustawień systemowych', permission: 'change_systemsettings'}
  },
  {
    path: 'ustawienia_nfz',
    name: 'NFZSettings',
    component: NFZSettings,
    meta: {label: 'Ustawienia NFZ', permission: 'view_nfzsettings'},
    props: {readonly: true}
  },
  {
    path: 'edycja_ustawien_nfz',
    name: 'NFZSettingsEdit',
    component: NFZSettings,
    meta: {label: 'Edycja ustawień NFZ', permission: 'change_nfzsettings'}
  },
  {
    path: 'gabinety',
    name: 'Gabinety',
    component: Index,
    redirect: 'gabinety/lista',
    children: [
      {
        path: 'lista',
        name: 'Listagabinetów',
        component: List,
        meta: {label: 'Lista gabinetów', permission: 'view_localization'},
        props: {
          columns: ['select', 'name', 'code', 'actions'],
          headings: {'name': 'Nazwa', 'code': 'Kod', 'select': '', 'actions': ''},
          resource: 'localization'
        }
      },
      {
        path: 'dodaj',
        name: 'NewLocation',
        component: AddEdit,
        meta: {label: 'Nowa gabinet', permission: 'add_localization'},
        props: {backUrl: '/gabinety', resource: 'localization', klass: 'LocalizationForm', module: 'timetable.forms'}
      },
      {
        path: ':id',
        name: 'Location',
        component: Detail,
        meta: {label: 'Gabinet', permission: 'view_localization'},
        props: {resource: 'localization', klass: 'LocalizationForm', module: 'timetable.forms', backUrl: '/gabinety'}
      },
      {
        path: ':id/edycja',
        name: 'Edycja gabinetów',
        component: AddEdit,
        meta: {label: 'Edycja', permission: 'change_localization'},
        props: {backUrl: '/gabinety', resource: 'localization', klass: 'LocalizationForm', module: 'timetable.forms'}
      }]
  },
  {
    path: 'uzytkownicy',
    name: 'Użytkownicy',
    component: Index,
    redirect: 'uzytkownicy/lista',
    meta: {permission: 'view_user'},
    children: [
      {
        path: 'lista',
        name: 'Lista',
        component: UsersList,
        meta: {label: 'Lista użytkowników', permission: 'view_user'},
        props: {
          columns: ['select', 'username', 'last_name', 'first_name', 'role_display', 'actions'],
          headings: {
            'username': 'nazwa użytkownika',
            'last_name': 'nazwisko',
            'first_name': 'imię',
            'role_display': 'rola',
            'select': '',
            'actions': ''
          },
          resource: 'user'
        }
      },
      {
        path: 'dodaj',
        name: 'NewUser',
        component: User,
        meta: {label: 'Nowy użytkownik', permission: 'add_user'},
        props: {backUrl: '/uzytkownicy', resource: 'user', klass: 'UserModelForm', module: 'user_profile.forms'}
      },
      {
        path: ':id',
        name: 'User',
        component: User,
        meta: {label: 'Użytkownik', permission: 'view_user'},
        props: {readonly: true}
      },
      {
        path: ':id/edycja',
        name: 'Edycja użytkownika',
        component: User,
        meta: {label: 'Edycja', permission: 'change_user'},
        props: {readonly: false}
      }]
  },
  {
    path: 'pacjenci',
    name: 'Pacjenci',
    component: PatientsIndex,
    redirect: 'pacjenci/lista',
    children: [
      {
        path: 'lista',
        name: 'ListaPacjentow',
        component: Patients,
        meta: {label: 'Lista pacjentów', permission: 'view_patient'}
      },
      {
        path: 'nowy',
        name: 'NewPatient',
        component: AddEdit,
        meta: {label: 'Nowy pacjent', permission: 'add_patient'},
        props: {
          backUrl: '/pacjenci',
          resource: 'patient',
          klass: 'PatientModelForm',
          module: 'user_profile.forms'
        }
      },
      {
        path: ':id',
        name: 'Pacjent',
        component: Patient,
        meta: {label: 'Pacjent', permission: 'view_patient'}
      },
      {
        path: ':id/edycja',
        name: 'Edycja pacjenta',
        component: PatientEdit,
        meta: {label: 'Edycja', permission: 'change_patient'}
      }]
  },
  {
    path: 'wizyty',
    name: 'visits',
    component: Visits,
    meta: {label: 'Wizyty', permission: 'view_visit'}
  },
  {
    path: 'archiwum',
    name: 'Archive',
    component: Archive,
    meta: {label: 'Archiwum', permission: 'view_result'},
    children: [
      {
        path: ':id',
        name: 'PatientArchive',
        component: Archive,
        meta: {label: 'Pacjent', permission: 'view_result'}
      }
    ]
  },
  // {
  //   path: 'recepty',
  //   name: 'Recepty',
  //   component: PrescriptionsIndex,
  //   redirect: 'recepty/lista',
  //   children: [
  //     {
  //       path: 'lista',
  //       name: 'Lista',
  //       component: Prescriptions
  //     },
  //     {
  //       path: 'nowa',
  //       name: 'Nowa recepta',
  //       component: Prescription,
  //       props: { new: true },
  //       meta: {label: 'Nowa recepta'}
  //     },
  //     {
  //       path: ':id',
  //       name: 'Edycja recepty',
  //       component: Prescription,
  //       meta: {label: 'Edycja recepty'}
  //     }
  //   ]
  // },
  {
    path: 'leki',
    name: 'Leki',
    component: MedicinesIndex,
    redirect: 'leki/lista',
    children: [
      {
        path: 'lista',
        name: 'medicinesList',
        meta: {label: 'Lista leków', permission: 'view_medicine'},
        component: Medicines
      },
      {
        path: ':id/edycja',
        name: 'editMedicine',
        meta: {label: 'Edycja leku', permission: 'change_medicine'},
        component: MedicineEdit
      },
      {
        path: 'dodaj',
        name: 'addMedicine',
        meta: {label: 'Nowy lek', permission: 'add_medicine'},
        component: MedicineEdit
      },
      {
        path: ':id',
        name: 'Lek',
        component: Medicine,
        meta: {permission: 'view_medicine'}
      }
    ]
  },
  {
    path: 'zakladki',
    name: 'Tabs',
    component: Tabs,
    meta: {label: 'Zakładki', permission: 'view_tab'}
  },
  {
    path: 'szablony',
    name: 'Templates',
    component: Templates,
    meta: {label: 'Szablony', permission: 'view_template'}
  },
  {
    path: 'formularze',
    name: 'Forms',
    component: Forms,
    meta: {label: 'Formularze'}
  },
  {
    path: 'EZLA',
    name: 'EZLA',
    component: Ezla,
    meta: {label: 'Ezla'}
  }
]

dashboardRoutes.push(examinationRoutes)
dashboardRoutes.push(agreementsRoutes)
dashboardRoutes.push(servicesRoutes)
dashboardRoutes.push(prescriptionRoutes)

var routes = [
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
    meta: { requiresAuth: true },
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
        props: true,
        component: Login
      },
      {
        path: 'rejestracja',
        name: 'Register',
        component: Register
      },
      {
        path: 'reset_potwierdz',
        name: 'ResetConfirm',
        component: ResetConfirm
      },
      {
        path: 'reset',
        name: 'Reset',
        component: Reset
      },
      {
        path: 'weryfikacja',
        name: 'Verify',
        component: Validate
      },
      {
        path: 'ustaw_telefon',
        name: 'MobileSet',
        component: MobileSet
      }
    ]
  },
  {
    path: '/',
    // redirect: 'calendar' in store.state.user.modules ? '/kalendarz' : '/statystyki',
    name: 'Home',
    component: Full,
    meta: { requiresAuth: true, label: '' },
    children: dashboardRoutes
  },
  {
    path: '/m/',
    name: 'Mobile',
    component: Mobile,
    meta: { requiresAuth: true, label: '' },
    children: mobileRoutes
  },
  {
    path: '/visit/:id',
    name: 'visit',
    component: Visit,
    meta: { requiresAuth: true, permission: 'change_visit' }
  }
]

var router = new Router({
  mode: 'hash',
  linkActiveClass: 'open active',
  scrollBehavior: () => ({ y: 0 }),
  routes: routes
})

var redirectToHome = (to, from, next) => {
  if (to.path === '/' && store.state.user.modules) {
    if (store.state.user.modules.indexOf('calendar') > -1) {
      next({
        path: '/kalendarz',
        query: { redirect: to.fullPath }
      })
    } else {
      next({
        path: '/statystyki',
        query: { redirect: to.fullPath }
      })
    }
    return true
  }
}

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (redirectToHome(to, from, next)) {
      return
    }
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (window.$cookies.get('secret')) {
      next({
        path: '/konto/weryfikacja/',
        query: { redirect: to.fullPath }
      })
    } else if (!auth.loggedIn()) {
      next({
        path: '/konto/logowanie/',
        query: { redirect: to.fullPath }
      })
    } else {
      if (!store.state.user.id) {
        AccountApi.getUserData().then(response => {
          redirectToHome(to, from, next)
          next()
        }).catch((err) => {
          if (err.response && err.response.status === 401) {
            next({
              path: '/konto/logowanie/',
              query: {redirect: to.fullPath}
            })
          }
        })
      } else {
        if (to.meta.permission && store.state.user.user_permissions.filter(p => p.codename === to.meta.permission).length === 0) {
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
