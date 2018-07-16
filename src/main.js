// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import VueCookies from 'vue-cookies'
import Autocomplete from 'vuejs-auto-complete'
import FullCalendar from 'vue-full-calendar'
import Notifications from 'vue-notification'
import BackendForm from '@/components/BackendForm'
import moment from 'moment'
import {ServerTable} from 'vue-tables-2'
import axios from 'axios'
import App from './App'
import router from './router'
import store from './store'
import {setupCalendar, Calendar, DatePicker} from 'v-calendar'
import 'v-calendar/lib/v-calendar.min.css'

var backendUrl = 'http://0.0.0.0:8080/'
if (process.env.NODE_ENV === 'production') { backendUrl = 'http://gabinet/backend/' }

axios.defaults.baseURL = backendUrl

axios.interceptors.response.use(null, function (err) {
  if (err.status === 500) {
    this.$notify({
      group: 'nots',
      title: 'Wystąpił bład',
      text: '',
      type: 'danger'
    })
  }
  return Promise.reject(err)
})

if (localStorage.token) { axios.defaults.headers.common['Authorization'] = 'Token ' + localStorage.token }
// axios.defaults.headers.common['X-CSRFToken'] = VueCookies.get('csrftoken')
Vue.use(BootstrapVue, axios, FullCalendar, VueCookies, BackendForm)
Vue.use(Notifications)
Vue.use(ServerTable, {
  responseAdapter (resp) { var data = this.getResponseData(resp); return { data: data.results, count: data.count } },
  requestFunction: function (data) {
    data.offset = (data.page - 1) * data.limit
    if (data.query) { data.search = data.query; delete data.query }
    data.table = true
    return axios.get(this.url, {
      params: data
    }).catch(function (e) {
      this.dispatch('error', e)
    }.bind(this))
  },
  texts: {
    count: 'Pokazuje {from} do {to} z {count} rekordów|{count} recordów|Jeden rekord',
    first: 'Pierwszy',
    last: 'Ostatni',
    filter: 'Filtr:',
    filterPlaceholder: 'Szukaj...',
    limit: 'Rekordy: ',
    page: 'Strony:',
    noResults: 'Brak pasujących rekordów',
    filterBy: 'Filtruj {column}',
    loading: 'Wczytywanie...',
    defaultOption: 'Wybierz {column}',
    columns: 'Kolumny'
  }
}, false, 'bootstrap4', 'default')

Vue.prototype.$moment = moment
Vue.prototype.$formsRoot = backendUrl + 'static/forms/forms/'
Vue.prototype.$urlEncode = (data) => Object.keys(data).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(data[k])}`).join('&')
var hasPermissions = (permission) => (app.$store.state.user.user_permissions.filter((p) => p.name === permission).length > 0)
Vue.prototype.$hasPermissions = hasPermissions
Vue.directive('permission', function (el, binding, vnode) {
  if (vnode.context.$store.state.user.user_permissions.filter((p) => p.name === binding.value).length === 0) {
    el.style.display = 'none'
  }
})
window.axios = axios

Vue.filter('formatDate', function (value, format) {
  if (!format) { format = 'YYYY-MM-DD' }
  if (value) {
    return moment(String(value)).format(format)
  }
})

Vue.filter('truncate', function (text, length, clamp) {
  clamp = clamp || '...'
  length = length || 30
  if (text.length <= length) return text
  var tcText = text.slice(0, length - clamp.length)
  var last = tcText.length - 1
  while (last > 0 && tcText[last] !== ' ' && tcText[last] !== clamp[0]) last -= 1
  // Fix for case when text dont have any `space`
  last = last || length - clamp.length
  tcText = tcText.slice(0, last)
  return tcText + clamp
})

setupCalendar({firstDayOfWeek: 2,
  locale: 'pl-pl',
  dates: new Date(),
  formats: {
    title: 'MMMM YYYY',
    weekdays: 'W',
    navMonths: 'MMM',
    input: ['YYYY-MM-DD', 'YYYY/MM/DD', 'L'],
    dayPopover: 'L'
  }})

Vue.component('backend-form', BackendForm)
Vue.component('v-calendar', Calendar)
Vue.component('v-date-picker', DatePicker)
/* eslint-disable no-new */
var app = new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: {
    App,
    Autocomplete
  }
})
