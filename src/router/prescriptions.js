import List from '@/views/generic/List'
import Index from '@/views/generic/Index'
import FormView from '@/views/generic/FormView'
import moment from 'moment/moment'

var formFields = [
  {name: 'date', label: 'Data utworzenia', type: 'date'},
  {name: 'external_id', label: 'Id e-recepty', readOnly: true}
]

var prescriptionsRoutes = {
  path: 'recepty',
  name: 'Recepty',
  component: Index,
  redirect: 'recepty/lista',
  children: [
    {
      path: 'lista',
      name: 'prescriptionsList',
      component: List,
      meta: {label: 'Lista recept'},
      props: {
        columns: ['patient', 'date', 'number', 'external_id', 'actions'],
        headings: {'patient': 'Pacjent',
          'date': 'Data',
          'number': 'Numer',
          'external_id': 'Id e-recepty',
          'status': 'Status',
          'actions': ''},
        resource: 'prescription',
        editable: false,
        showEditLink: false,
        responseFormatter: (data) => {
          data.results.forEach((r) => {
            r.date = moment(r.creation_date).format('YYYY-MM-DD HH:mm')
            r.number = r.number ? r.number : '-'
          })
          return data
        }
      }
    },
    {
      path: ':id',
      name: 'prescription',
      component: FormView,
      meta: {label: 'Recepta'},
      props: {backUrl: '/recepty/lista/', resource: 'prescription', readonly: true, formFields: formFields}
    },
    {
      path: ':id/edycja',
      name: 'editPrescription',
      component: FormView,
      meta: {label: 'Edycja'},
      props: {backUrl: '/recepty/lista/', resource: 'prescription', formFields: formFields}
    }]
}

export default prescriptionsRoutes
