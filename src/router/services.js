import FormView from '@/views/generic/FormView'
import List from '@/views/generic/List'
import Index from '@/views/generic/Index'

var formFields = [
  {name: 'name', label: 'Nazwa'},
  {name: 'code', label: 'Kod'},
  {name: 'price', label: 'Cena'},
  {name: 'color', type: 'color', label: 'Kolor', default: '#5bc0de'},
  {name: 'doctors', label: 'Lekarze', type: 'multiselect', choicesUrl: 'rest/doctors/'}
]

var serviceRoutes = {
  path: 'uslugi',
  name: 'Usługi',
  component: Index,
  redirect: 'uslugi/lista',
  children: [
    {
      path: 'lista',
      name: 'servicesList',
      component: List,
      meta: {label: 'Lista usług', permission: 'view_service'},
      props: {
        columns: ['select', 'name', 'color', 'actions'],
        headings: {'name': 'Nazwa', 'color': 'Kolor', 'select': '', 'actions': ''},
        resource: 'service'
      }
    },
    {
      path: 'dodaj',
      name: 'newService',
      component: FormView,
      meta: {label: 'Nowa usługa', permission: 'add_service'},
      props: {backUrl: '/uslugi/', resource: 'service', formFields: formFields}
    },
    {
      path: ':id',
      name: 'service',
      component: FormView,
      meta: {label: 'Usługi', permission: 'view_service'},
      props: {backUrl: '/uslugi/', resource: 'service', readonly: true, formFields: formFields}
    },
    {
      path: ':id/edycja',
      name: 'editService',
      component: FormView,
      meta: {label: 'Edycja', permission: 'change_service'},
      props: {backUrl: '/uslugi/', resource: 'service', formFields: formFields}
    }]
}

export default serviceRoutes
