import FormView from '@/views/generic/FormView'
import List from '@/views/generic/List'
import Index from '@/views/generic/Index'

var formFields = [
  {name: 'name', label: 'Nazwa'},
  {name: 'category', label: 'Kategoria', type: 'select', choicesUrl: 'rest/examinations_categories/'}
]

var examinationRoutes = {
  path: 'badania-dodatkowe',
  name: 'Badania dodatkowe',
  component: Index,
  redirect: 'badania-dodatkowe/lista',
  children: [
    {
      path: 'lista',
      name: 'examinations',
      component: List,
      meta: {label: 'Lista badań dotatkowych'},
      props: {
        columns: ['select', 'name', 'category_name', 'actions'],
        headings: {'name': 'Nazwa', 'category_name': 'Kategoria', 'select': '', 'actions': ''},
        resource: 'examination'
      }
    },
    {
      path: 'dodaj',
      name: 'newExamination',
      component: FormView,
      meta: {label: 'Nowe badanie dodatkowe'},
      props: {backUrl: '/badania-dodatkowe', resource: 'examination', formFields: formFields}
    },
    {
      path: ':id',
      name: 'examination',
      component: FormView,
      meta: {label: 'Badanie dodatkowe'},
      props: {backUrl: '/badania-dodatkowe', resource: 'examination', readonly: true, formFields: formFields}
    },
    {
      path: ':id/edycja',
      name: 'editExamination',
      component: FormView,
      meta: {label: 'Edycja'},
      props: {backUrl: '/badania-dodatkowe', resource: 'examination', formFields: formFields}
    }]
}

export default examinationRoutes
