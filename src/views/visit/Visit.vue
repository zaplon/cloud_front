<template>
    <div class="align-items-center">
        <AppHeader/>
            <b-modal :static="true" size="md" id="editPatientModal" title="Edycja danych pacjenta"
                     ref="editPatientModal">
                <generic-form :fields="patientFormFields" ref="patientForm"></generic-form>
                <div slot="modal-footer" class="w-100">
                    <b-btn size="sm" class="float-right" variant="default" @click="$refs.editPatientModal.hide()">
                        Zamknij
                    </b-btn>
                    <b-btn size="sm" class="float-right mr-2" variant="success" @click="savePatient">Zapisz</b-btn>
                </div>
            </b-modal>
            <b-modal :static="true" size="md" id="editPatientSmallModal" title="Edycja danych pacjenta"
                     ref="editPatientSmallModal">
                <p>Uzupełnij dane pacjenta wymagane na potrzeby e-recepty. Następnie prześlij receptę ponownie.</p>
                <generic-form :fields="patientSmallFormFields" ref="patientSmallForm"></generic-form>
                <div slot="modal-footer" class="w-100">
                    <b-btn size="sm" class="float-right" variant="default" @click="$refs.editPatientSmallModal.hide()">
                        Zamknij
                    </b-btn>
                    <b-btn size="sm" class="float-right mr-2" variant="success" @click="savePatientSmall">Zapisz</b-btn>
                </div>
            </b-modal>
            <div class="app-body" id="visit-body">
                <div class="sidebar" id="visit-sidebar">
                    <archive :patient="visit.term.patient"></archive>
                </div>
                <div class="main">
                <nav class="navbar navbar-light bg-light justify-content-between visit-nav" id="visit-nav">
                    <form class="form-inline">
                        <button class="btn btn-light mr-2" @click="printVisit" type="button">
                            <i class="fa fa-print"></i>&nbsp;Wizyta
                        </button>
                        <button type="button" @click="showForms('karty')"
                                :class="{btn: true, 'btn-light': true, 'mr-2': true, 'active': (forms.type=='karty')}"
                        ><i class="fa fa-print"></i>&nbsp;Karty badań</button>
                        <button type="button" @click="showForms('skierowania')"
                                :class="{btn: true, 'btn-light': true, 'mr-2': true, 'active': (forms.type=='skierowania')}"
                        ><i class="fa fa-print"></i>&nbsp;Skierowania</button>
                        <button type="button" @click="showForms('orzeczenia')"
                                :class="{btn: true, 'btn-light': true, 'mr-2': true, 'active': (forms.type=='orzeczenia')}"
                        ><i class="fa fa-print"></i>&nbsp;Orzeczenia</button>
                        <button
                                :class="{btn: true, 'btn-light': true, 'mr-2': true, 'active': (forms.type=='zaswiadczenia')}"
                                type="button" @click="showForms('zaswiadczenia')"><i class="fa fa-print"></i>&nbsp;Zaświadczenia</button>
                    </form>
                    <form class="form-inline">
                        <button class="btn btn-secondary text-danger mr-2" type="button" @click="cancelVisit">Cofnij</button>
                        <button class="btn btn-secondary mr-2" type="button" @click="saveVisit(true)">Zapisz tymczasowo</button>
                        <button class="btn btn-success" @click="showSaveVisitModal" type="button">Zapisz</button>
                    </form>
                </nav>
                <nav class="navbar navbar-dark bg-secondary visit-nav" id="forms-nav" v-show="forms.show">
                    <div>
                        <button :key="form.name" v-for="form in forms.items" @click="showForm(form)" class="btn btn-light btn-sm">{{ form.title }}</button>
                    </div>
                </nav>
                <div id="visit-nav-margin"></div>
                <div class="container-fluid">

                    <div class="card" v-if="visit.term">
                        <div class="card-header">
                            <span>{{ visit.term.patient.first_name }} {{ visit.term.patient.last_name }}</span>
                            <button class="btn btn-link">
                                <i class="pointer fa fa-pencil" @click="editPatient"></i>
                            </button>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="row">
                                        <div class="col-4"><label class="col-form-label">Pesel</label></div>
                                        <div class="col-auto">
                                            <template v-if="!editingPesel">
                                                <div class="form-group row">
                                                    <div class="col-auto pr-0">
                                                        <label class="col-form-label">
                                                            <strong>{{ visit.term.patient.pesel }}</strong>
                                                        </label>
                                                    </div>
                                                    <div class="col-auto pl-0" v-permission="'change_patient'">
                                                        <button class="btn btn-link">
                                                            <i @click="editingPesel=true" class="pointer fa fa-pencil"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </template>
                                            <template v-if="editingPesel">
                                                <div class="form-group row">
                                                    <div class="col-auto pr-0">
                                                        <input type="text" class="form-inline form-control"
                                                               v-model="visit.term.patient.pesel">
                                                    </div>
                                                    <div class="col-auto pl-0">
                                                        <div class="btn-group">
                                                            <button class="btn btn-link">
                                                                <i @click="savePesel(visit.term.patient.pesel)"
                                                                   class="pointer fa fa-check"></i>
                                                            </button>
                                                            <button class="btn btn-link pl-0">
                                                                <i @click="editingPesel=false"
                                                                   class="pointer fa fa-times"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </template>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row mt-2" v-show="visit.term.patient.info">
                                <div class="col-auto"><span class="text-muted">{{ visit.term.patient.info }}</span></div>
                            </div>
                        </div>
                    </div>

                    <b-card no-body>
                        <b-tabs pills justified card v-model="tabIndex">
                            <template v-for="(tab, index) in visit.tabs">
                                <b-tab :key="tab.name" :title="tab.title" :active="index == 0">
                                    <icd v-on:icd-changed="getICD" :data="visit.icdtovisit_set" v-if="tab.type=='ICD10'" :ref="tab.id" />
                                    <notes v-else-if="tab.type=='NOTES'" :ref="tab.id" />
                                    <prescriptions :data="tab.data" :patient="visit.term.patient"
                                                   :visit-id="visit.id"
                                                   v-on:editPatient="editPatientSmall"
                                                   v-else-if="tab.type=='MEDICINES'" :ref="tab.id" />
                                    <oculist :data="tab.data" :patient="visit.term.patient" v-else-if="tab.type=='OCULIST'" :ref="tab.id"></oculist>
                                    <referrals :data="tab.data" :patient="visit.term.patient" v-else-if="tab.type=='EXAMINATIONS'" :ref="tab.id"></referrals>
                                    <visit-tab :name="tab.title" :templates="templates.filter((t) => t.tab_title == tab.title)"
                                               :initial="tab.data" :patient="visit.term.patient"
                                               :ref="tab.id" v-else>
                                    </visit-tab>
                                </b-tab>
                            </template>
                        </b-tabs>
                    </b-card>
                </div>
            </div>
            <b-modal size="lg" id="saveVisitModal" title="Zapis wizyty" @ok="saveVisit" ref="saveVisitModal">
                <embed style="width:100%; height:70vh;" :src="visitPdfSrc"/>
                <div slot="modal-footer" class="w-100">
                    <b-btn size="sm" class="float-right" variant="default" @click="$refs.saveVisitModal.hide()">Zamknij</b-btn>
                    <b-btn size="sm" class="float-right mr-2" variant="success" @click="saveVisit(false)">Zapisz</b-btn>
                </div>
            </b-modal>
        </div>
        <AppFooter style="padding: 14.5px;"/>
        <pdf-form ref="pdfForm" :patientId="visit.term.patient.id" ></pdf-form>
    </div>
</template>
<script>
import {Header as AppHeader, Footer as AppFooter} from '@/components/'
import axios from 'axios'
import PdfForm from '@/components/PdfForm'
import Icd from '@/components/Visit/Icd'
import VisitTab from '@/components/Visit/VisitTab'
import Archive from '@/components/Visit/Archive'
import Notes from '@/components/Visit/Notes'
import Medicines from '@/components/Visit/Medicines'
import Oculist from '@/components/Visit/Oculist'
import Referrals from '@/components/Visit/Referrals'
import forms from '@/_forms.js'
import EventBus from '@/eventBus'
import GenericForm from '@/components/Forms/GenericForm'
import Prescriptions from '@/components/Visit/Prescriptions'
export default {
  name: 'visit',
  data () {
    return {
      visit: {tabs: [], term: {patient: {}, service: {}, doctor: {}}},
      visitPdfSrc: '',
      editingPesel: false,
      editingLastName: false,
      editingAddress: false,
      templates: [],
      formName: '',
      formTitle: '',
      tabIndex: 0,
      icds: [],
      patientSmallFormFields: [
        {name: 'first_name', label: 'Imię'},
        {name: 'last_name', label: 'Nazwisko'},
        {name: 'gender',
          label: 'Płeć',
          type: 'select',
          choices: [{id: 'M', name: 'Mężczyzna'}, {id: 'F', name: 'Kobieta'}]
        },
        {name: 'pesel', label: 'Numer PESEL'}
      ],
      patientFormFields: [
        {name: 'first_name', label: 'Imię'},
        {name: 'last_name', label: 'Nazwisko'},
        {name: 'gender',
          label: 'Płeć',
          type: 'select',
          choices: [{id: 'M', name: 'Mężczyzna'}, {id: 'F', name: 'Kobieta'}]
        },
        {name: 'pesel', label: 'Numer PESEL'},
        {name: 'email', label: 'Adres e-mail'},
        {name: 'mobile', label: 'Numer telefonu'},
        {name: 'street', label: 'Ulica'},
        {name: 'street_number', label: 'Numer ulicy'},
        {name: 'postal_code', label: 'Kod pocztowy', type: 'postal_code'},
        {name: 'city', label: 'Miejscowość'}
      ],
      forms: {
        show: false,
        items: [],
        type: null
      }
    }
  },
  timers: {
    saveVisitTmp: { time: 60000, autostart: true, repeat: true }
  },
  methods: {
    savePesel (pesel) {
      axios.patch('rest/patients/' + this.visit.term.patient.id + '/',
        {'pesel': pesel}).then(response => {
        this.editingPesel = false
      })
    },
    editPatient () {
      console.log(this)
      this.$refs.editPatientModal.show()
      this.$refs.patientForm.setData(this.visit.term.patient)
    },
    savePatient () {
      let data = this.$refs.patientForm.getData()
      axios.patch('rest/patients/' + this.visit.term.patient.id + '/', data).then(response => {
        this.$refs.editPatientModal.hide()
        this.visit.term.patient = response.data
      }).catch(error => {
        this.$refs.patientForm.errors = error.response.data
      })
    },
    editPatientSmall () {
      this.$refs.editPatientSmallModal.show()
      this.$refs.patientSmallForm.setData(this.visit.term.patient)
    },
    savePatientSmall () {
      let data = this.$refs.patientSmallForm.getData()
      axios.patch('rest/patients/' + this.visit.term.patient.id + '/', data).then(response => {
        this.$refs.editPatientSmallModal.hide()
        this.visit.term.patient = response.data
      }).catch(error => {
        this.$refs.patientSmallForm.errors = error.response.data
      })
    },
    getICD (icds) {
      console.log(icds)
      this.icds = icds
    },
    showDocument (file, title) {
      EventBus.$emit('show-document', title, file)
    },
    hideVisitPdf () { this.$refs.visitPDFModal.hide() },
    showForms (type) {
      if (type === this.forms.type) { this.forms.show = false } else { this.forms.show = true }
      if (this.forms.show) { this.forms.type = type } else { this.forms.type = null }
      this.forms.items = forms.forms[type]
    },
    showForm (form) {
      let data = this.visit.term.patient
      data['doctor_name'] = this.$store.state.user.doctor.name
      data['doctor_pwz'] = this.$store.state.user.doctor.pwz
      data['icd_text'] = []
      data['icd'] = []
      this.icds.forEach((icd) => {
        data['icd_text'].push(icd.desc)
        data['icd'].push(icd.code)
      })
      data['icd_text'] = data['icd_text'].join(', ')
      data['icd'] = data['icd'].join(', ')
      this.$refs.pdfForm.show(form.name, form.title, data)
    },
    printVisit (saveVisit) {
      this.saveVisit(true, true).then(
        axios.get('visit/pdf/' + this.$route.params.id + '/?as_link=1/').then(response => {
          let visitPdf = axios.defaults.baseURL.substr(0, axios.defaults.baseURL.length - 1) + response.data
          if (saveVisit) {
            this.visitPdfSrc = visitPdf
            this.$refs.saveVisitModal.show()
          } else {
            this.showDocument('Historia choroby', visitPdf)
          }
        })
      )
    },
    cancelVisit () {
      this.$router.push('/')
    },
    showSaveVisitModal () {
      this.printVisit(true)
    },
    saveVisit (tmp, hideNotification) {
      var data = []
      var me = this
      this.visit.tabs.forEach((tab, i) => {
        var component = me.$refs[tab.id][0]
        if (component.save) { component.save(tmp) }
        if (component.getData) {
          var tabData = component.getData()
          if (tabData) {
            tab.data = tabData
            data.push(tab)
          }
        }
      })
      return axios.patch('rest/visits/' + this.$route.params.id + '/', {tmp: tmp, data: data}).then(response => {
        if (tmp) {
          if (!hideNotification) {
            this.$notify({
              group: 'nots',
              title: 'Wersja robocza została zapisana',
              text: '',
              type: 'success'
            })
          }
          return
        }
        if ('errors' in response.data) {
          var errors = response.data.errors
          var errorsTxt = ''
          for (var error in errors) {
            errorsTxt += errors[error] + '\n'
          }
          this.$notify({
            group: 'nots',
            title: 'Błąd zapisu',
            text: errorsTxt,
            type: 'error'
          })
          return
        }
        axios.get('visit/pdf/' + this.$route.params.id + '/?to_archive=1&visit_id=' + response.data.id)
        this.$router.push('/')
        this.$notify({
          group: 'nots',
          title: 'Wizyta została zapisana',
          text: ''
        })
      })
    },
    saveVisitTmp () {
      this.saveVisit(true)
    }
  },
  mounted () {
    axios.get('rest/visits/' + this.$route.params.id + '/').then(response => {
      this.visit = response.data
      if (this.visit.icdtovisit_set) {
        this.icds = this.visit.icdtovisit_set
      }
    })
    axios.get('rest/templates/').then(response => { this.templates = response.data.results })
  },
  components: {
    Prescriptions,
    PdfForm,
    Icd,
    AppHeader,
    AppFooter,
    VisitTab,
    Notes,
    Archive,
    Medicines,
    Oculist,
    Referrals,
    GenericForm
  }
}
</script>
<style>
    header.setup-header {
        flex-direction: row!important;
    }
    #visit-body {
    }
    #visit-nav-margin {
        margin-bottom: 1.5rem;
    }
    #forms-nav {
    }
</style>
