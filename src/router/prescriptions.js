import List from '@/views/generic/List'
import Index from '@/views/generic/Index'
import FormView from '@/views/generic/FormView'
import moment from 'moment/moment'
import axios from 'axios'
import EventBus from '@/eventBus'

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
        columns: ['patient', 'date', 'external_code', 'external_id', 'actions'],
        headings: {'patient': 'Pacjent',
          'date': 'Data',
          'external_code': 'Kod e-recepty',
          'external_id': 'Klucz e-recepty',
          'number': 'Numer',
          'status': 'Status',
          'actions': ''
        },
        extraActions: [{
          text: 'Wydrukuj',
          clb: (record) => {
            var promise = false
            if (record.external_id) {
              promise = axios.get('rest/prescriptions/' + record.id + '/print_one/')
            } else {
              promise = promise = axios.get('rest/prescriptions/' + record.id + '/print_one_internal/')
            }
            promise.then(response => {
              let url = axios.defaults.baseURL.substr(0, axios.defaults.baseURL.length - 1) + response.data.file
              EventBus.$emit('show-document', url, 'Recepta')
            })
          }
        },
        {
          text: 'Usuń',
          cls: 'btn-danger',
          clb: (record, table) => {
            if (record.external_id) {
              axios.post('rest/prescriptions/' + record.id + '/cancel/').then(response => {
                table.refresh()
              })
            } else {
              axios.delete('rest/prescriptions/' + record.id + '/').then(response => {
                table.refresh()
              })
            }
          }
        }],
        resource: 'prescription',
        editable: false,
        showEditLink: false,
        responseFormatter: (data) => {
          data.results.forEach((r) => {
            let date = new Date(r.date)
            r.date = moment(date).format('YYYY-MM-DD HH:mm')
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
