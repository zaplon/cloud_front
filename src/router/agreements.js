import FormView from '@/views/generic/FormView'
import List from '@/views/generic/List'
import Index from '@/views/generic/Index'
import moment from 'moment/moment'

var formFields = [
  {name: 'title', label: 'Tytuł'},
  {name: 'text', label: 'Tekst', type: 'editor'},
  {name: 'targeted_users',
    label: 'Użytkownicy',
    type: 'multiselect',
    choicesUrl: 'rest/users/',
    choiceDisplay: (record) => { return record.first_name + ' ' + record.last_name }},
  {name: 'creation_date', readonly: true, label: 'Data utworzenia'},
  {name: 'update_date', readonly: true, label: 'Data aktualizacji'}
]

var responseFormatter = (r) => {
  r.creation_date = moment(r.creation_date).format('YYYY-MM-DD HH:mm')
  r.update_date = moment(r.update_date).format('YYYY-MM-DD HH:mm')
  return r
}

var agreementRoutes = {
  path: 'komunikaty',
  name: 'Komunikaty',
  component: Index,
  redirect: 'komunikaty/lista',
  children: [
    {
      path: 'lista',
      name: 'agreements',
      component: List,
      meta: {label: 'Lista komunikatów'},
      props: {
        columns: ['select', 'title', 'receivers_count', 'creation_date', 'update_date', 'actions'],
        headings: {'title': 'Tytuł',
          'receivers_count': 'Liczba odbiorców',
          'creation_date': 'Data utworzenia',
          'update_date': 'Data aktualizacji',
          'select': '',
          'actions': ''},
        resource: 'agreement',
        responseFormatter: (data) => {
          data.results.forEach((r) => {
            r.creation_date = moment(r.creation_date).format('YYYY-MM-DD HH:mm')
            r.update_date = moment(r.update_date).format('YYYY-MM-DD HH:mm')
          })
          return data
        },
        extraActions: [
          {url: (row) => row.id + '/dziennik', text: 'dziennik', cls: 'btn btn-sm btn-info'}
        ]
      }
    },
    {
      path: 'dodaj',
      name: 'newAgreement',
      component: FormView,
      meta: {label: 'Nowy komunikat'},
      props: {backUrl: '/komunikaty', resource: 'agreement', formFields: formFields}
    },
    {
      path: ':id',
      name: 'agreement',
      component: FormView,
      meta: {label: 'Komunikat'},
      props: {backUrl: '/komunikaty',
        resource: 'agreement',
        readonly: true,
        formFields: formFields,
        responseFormatter: responseFormatter}
    },
    {
      path: ':id/edycja',
      name: 'editAgreement',
      component: FormView,
      meta: {label: 'Edycja'},
      props: {backUrl: '/komunikaty', resource: 'agreement', formFields: formFields, responseFormatter: responseFormatter}
    },
    {
      path: ':id/dziennik',
      name: 'agreementLog',
      component: List,
      meta: {label: 'Dziennik'},
      props: {
        columns: ['user', 'datetime'],
        editable: false,
        headings: {user: 'Użytkownik', datetime: 'Data akceptacji'},
        resource: 'agreement_to_user',
        showEditLink: false,
        responseFormatter: (data) => {
          data.results.forEach((r) => { r.datetime = moment(r.datetime).format('YYYY-MM-DD HH:mm') })
          return data
        },
        endpoint: (vue) => 'rest/agreements_to_users/?agreement=' + vue.$route.params.id
      }
    }
  ]
}

export default agreementRoutes
