export default {
  items: [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'icon-speedometer'
    },
    {
      id: 'stats',
      name: 'Statystyki',
      url: '/statystyki',
      icon: 'fa fa-line-chart'
    },
    {
      id: 'calendar',
      name: 'Kalendarz',
      url: '/kalendarz',
      icon: 'icon-calendar'
    },
    {
      id: 'icd10',
      name: 'ICD 10',
      url: '/icd10',
      icon: 'fa fa-book'
    },
    {
      id: 'patients',
      name: 'Pacjenci',
      url: '/pacjenci',
      icon: 'fa fa-users'
    },
    {
      id: 'visits',
      name: 'Wizyty',
      url: '/wizyty',
      icon: 'fa fa-thermometer-half'
    },
    {
      id: 'archive',
      name: 'Archiwum',
      url: '/archiwum',
      icon: 'fa fa-archive'
    },
    {
      id: 'medicines',
      name: 'Leki',
      url: '/leki',
      icon: 'fa fa-medkit'
    },
    {
      id: 'prescriptions',
      name: 'Recepty',
      url: '/recepty',
      icon: 'fa fa-file-text'
    },
    {
      id: 'templates',
      name: 'Szablony',
      url: '/szablony',
      icon: 'fa fa-pencil-square-o'
    },
    {
      id: 'forms',
      name: 'Formularze',
      url: '/formularze',
      icon: 'fa fa-wpforms'
    },
    {
      id: 'tabs',
      name: 'Zakładki',
      url: '/zakladki',
      icon: 'fa fa-list-alt'
    },
    {
      id: 'services',
      name: 'Usługi',
      url: '/uslugi',
      icon: 'fa fa-rocket'
    },
    {
      id: 'localizations',
      name: 'Lokalizacje',
      url: '/lokalizacje',
      icon: 'fa fa-building-o'
    },
    {
      id: 'users',
      name: 'Użytkownicy',
      url: '/uzytkownicy',
      icon: 'fa fa-user-md'
    },
    {
      id: 'examinations',
      name: 'Badania',
      url: '/badania-dodatkowe',
      icon: 'fa fa-stethoscope'
    },
    {
      id: 'agreements',
      name: 'Komunikaty',
      url: '/komunikaty',
      icon: 'fa fa-volume-down'
    },
    {
      id: 'settings',
      name: 'Ustawienia',
      icon: 'fa fa-gear',
      children: [
        {
          id: 'generalSettings',
          name: 'Systemowe',
          url: '/ustawienia_systemowe'
        },
        {
          id: 'NFZSettings',
          name: 'NFZ',
          url: '/ustawienia_nfz'
        }
      ]
    },
    {
      id: 'links',
      name: 'Linki',
      icon: 'fa fa-link',
      children: [
        {
          id: 'ewus',
          name: 'ewus',
          url: 'https://ewus.nfz.gov.pl/ap-ewus/'
        },
        {
          id: 'zwolenienia',
          name: 'e-zwolnienia',
          url: 'https://www.zus.pl/portal/logowanie.npi'
        }
      ]
    }
  ]
}
