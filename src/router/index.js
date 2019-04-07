import Vue from 'vue'
import Router from 'vue-router'

// Containers
import Full from '@/containers/Full'
import Account from '@/containers/Account'
import Setup from '@/containers/Setup'

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

import {default as MedicinesIndex} from '@/views/medicines/Index'
import Medicines from '@/views/medicines/Medicines'
import Medicine from '@/views/medicines/Medicine'
import MedicineEdit from '@/views/medicines/MedicineEdit'

import Ezla from '@/views/ezla/Ezla'

import examinationRoutes from '@/router/examinations'
import agreementsRoutes from '@/router/agreements'

// import {default as PrescriptionsIndex} from '@/views/prescriptions/Index'
// import Prescriptions from '@/views/prescriptions/Prescriptions'
// import Prescription from '@/views/prescriptions/Prescription'

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
    meta: {label: 'Kalendarz'}
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
    meta: {label: 'Ustawienia systemowe'},
    props: {readonly: true}
  },
  {
    path: 'edycja_ustawien_systemowych',
    name: 'systemSettingsEdit',
    component: SystemSettings,
    meta: {label: 'Edycja ustawień systemowych'}
  },
  {
    path: 'uslugi',
    name: 'Usługi',
    component: Index,
    redirect: 'uslugi/lista',
    children: [
      {
        path: 'lista',
        name: 'ListaUslug',
        component: List,
        meta: {label: 'Lista usług'},
        props: {
          columns: ['select', 'name', 'actions'],
          headings: {'name': 'Nazwa', 'select': '', 'actions': ''},
          resource: 'service'
        }
      },
      {
        path: 'dodaj',
        name: 'NewService',
        component: AddEdit,
        meta: {label: 'Nowa usługa'},
        props: { backUrl: '/uslugi', resource: 'service', klass: 'ServiceForm', module: 'timetable.forms' }
      },
      {
        path: ':id',
        name: 'Service',
        component: Detail,
        meta: {label: 'Usługa'},
        props: { resource: 'service', klass: 'ServiceForm', module: 'timetable.forms' }
      },
      {
        path: ':id/edycja',
        name: 'Edycja usługi',
        component: AddEdit,
        meta: {label: 'Edycja'},
        props: {backUrl: '/uslugi', resource: 'service', klass: 'ServiceForm', module: 'timetable.forms'}
      }]
  },
  {
    path: 'lokalizacje',
    name: 'Lokalizacje',
    component: Index,
    redirect: 'lokalizacje/lista',
    children: [
      {
        path: 'lista',
        name: 'ListaLokalizacji',
        component: List,
        meta: {label: 'Lista lokalizacji'},
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
        meta: {label: 'Nowa lokalizacja'},
        props: {backUrl: '/lokalizacje', resource: 'localization', klass: 'LocalizationForm', module: 'timetable.forms'}
      },
      {
        path: ':id',
        name: 'Location',
        component: Detail,
        meta: {label: 'Lokalizacja'},
        props: {resource: 'localization', klass: 'LocalizationForm', module: 'timetable.forms', backUrl: '/lokalizacje'}
      },
      {
        path: ':id/edycja',
        name: 'Edycja lokalizacji',
        component: AddEdit,
        meta: {label: 'Edycja'},
        props: {backUrl: '/lokalizacje', resource: 'localization', klass: 'LocalizationForm', module: 'timetable.forms'}
      }]
  },
  {
    path: 'uzytkownicy',
    name: 'Użytkownicy',
    component: Index,
    redirect: 'uzytkownicy/lista',
    children: [
      {
        path: 'lista',
        name: 'Lista',
        component: UsersList,
        meta: {label: 'Lista użytkowników'},
        props: {
          columns: ['select', 'last_name', 'first_name', 'type', 'actions'],
          headings: {
            'last_name': 'nazwisko',
            'first_name': 'imię',
            'type': 'rola',
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
        meta: {label: 'Nowy użytkownik'},
        props: {backUrl: '/uzytkownicy', resource: 'user', klass: 'UserModelForm', module: 'user_profile.forms'}
      },
      {
        path: ':id',
        name: 'User',
        component: User,
        meta: {label: 'Użytkownik'},
        props: {readonly: true}
      },
      {
        path: ':id/edycja',
        name: 'Edycja użytkownika',
        component: User,
        meta: {label: 'Edycja'},
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
        component: Patients
      },
      {
        path: 'nowy',
        name: 'NewPatient',
        component: AddEdit,
        meta: {label: 'Nowy pacjent'},
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
        meta: {label: 'Pacjent'}
      },
      {
        path: ':id/edycja',
        name: 'Edycja pacjenta',
        component: PatientEdit,
        meta: {label: 'Edycja'}
      }]
  },
  {
    path: 'wizyty',
    name: 'visits',
    component: Visits,
    meta: {label: 'Wizyty'}
  },
  {
    path: 'archiwum',
    name: 'Archive',
    component: Archive,
    meta: {label: 'Archiwum'},
    children: [
      {
        path: ':id',
        name: 'PatientArchive',
        component: Archive,
        meta: {label: 'Pacjent'}
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
        meta: {label: 'Lista leków'},
        component: Medicines
      },
      {
        path: ':id/edycja',
        name: 'editMedicine',
        meta: {label: 'Edycja leku'},
        component: MedicineEdit
      },
      {
        path: 'dodaj',
        name: 'addMedicine',
        meta: {label: 'Nowy lek'},
        component: MedicineEdit
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
        path: 'reset',
        name: 'Reset',
        component: Reset
      }
    ]
  },
  {
    path: '/',
    redirect: '/kalendarz',
    name: 'Home',
    component: Full,
    meta: { requiresAuth: true, label: '' },
    children: dashboardRoutes
  },
  {
    path: '/visit/:id',
    name: 'visit',
    component: Visit,
    meta: { requiresAuth: true }
  }
]

var router = new Router({
  mode: 'hash',
  linkActiveClass: 'open active',
  scrollBehavior: () => ({ y: 0 }),
  routes: routes
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
