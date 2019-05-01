import FormView from '@/views/generic/FormView'
import List from '@/views/generic/List'
import Index from '@/views/generic/Index'

var formFields = [
  {name: 'name', label: 'Nazwa'},
  {name: 'code', label: 'Kod'},
  {name: 'price', label: 'Cena'},
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
      meta: {label: 'Lista usług'},
      props: {
        columns: ['select', 'name', 'actions'],
        headings: {'name': 'Nazwa', 'select': '', 'actions': ''},
        resource: 'service'
      }
    },
    {
      path: 'dodaj',
      name: 'newService',
      component: FormView,
      meta: {label: 'Nowa usługa'},
      props: {backUrl: '/uslugi/', resource: 'service', formFields: formFields}
    },
    {
      path: ':id',
      name: 'service',
      component: FormView,
      meta: {label: 'Usługi'},
      props: {backUrl: '/uslugi/', resource: 'service', readonly: true, formFields: formFields}
    },
    {
      path: ':id/edycja',
      name: 'editService',
      component: FormView,
      meta: {label: 'Edycja'},
      props: {backUrl: '/uslugi/', resource: 'service', formFields: formFields}
    }]
}

export default serviceRoutes
