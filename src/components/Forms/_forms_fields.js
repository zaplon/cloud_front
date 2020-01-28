var patientFields = [
  {name: 'first_name', label: 'Imię', required: true},
  {name: 'last_name', label: 'Nazwisko', required: true},
  {name: 'gender',
    required: true,
    label: 'Płeć',
    type: 'select',
    choices: [{id: 'M', name: 'Mężczyzna'}, {id: 'F', name: 'Kobieta'}]
  },
  {name: 'pesel', label: 'Numer PESEL'},
  {name: 'birth_date',
    label: 'Data urodzenia',
    type: 'date',
    helpText: 'Zostanie odczytana z numeru pesel, jeżeli pozostawiona pusta'},
  {name: 'email', label: 'Adres e-mail'},
  {name: 'mobile', label: 'Numer telefonu'},
  {name: 'street', label: 'Ulica'},
  {name: 'street_number', label: 'Numer domu'},
  {name: 'apartment_number', label: 'Numer mieszkania'},
  {name: 'postal_code', label: 'Kod pocztowy', type: 'postal_code'},
  {name: 'city', label: 'Miejscowość'}
]

export default {
  patient: patientFields,
  patientBig: patientFields.concat([
    {
      name: 'info',
      label: 'Ważne informacje',
      type: 'textarea',
      helpText: 'Informacje pomocnicze o alergiach, przebytych zabiegach, etc...'
    }
  ])
}
