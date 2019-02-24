<template>
    <div class="align-items-center">
        <AppHeader/>
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
                        <button class="btn btn-secondary text-success" @click="showSaveVisitModal" type="button">Zapisz</button>
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
                            {{ visit.term.patient.first_name }} {{ visit.term.patient.last_name }}
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-2">Pesel</div>
                                <div class="col-auto">
                                    <strong>{{ visit.term.patient.pesel }}</strong>
                                    <!--<i v-show="!editingPesel" @click="editPesel" class="fa fa-pencil-square-o"></i>-->
                                    <!--<i v-show="editingPesel" @click="savePesel" class="fa fa-save"></i>-->
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-2">Adres</div>
                                <div class="col-auto">
                                    <strong>{{ visit.term.patient.address }}</strong>
                                    <!--<i v-show="!editingAddress" @click="editAddress" class="fa fa-pencil-square-o"></i>-->
                                    <!--<i v-show="editingAddress" @click="saveAddress" class="fa fa-save"></i>-->
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
                                    <icd v-on:icd-changed="getICD" :data="visit.icd_codes" v-if="tab.type=='ICD10'" :ref="tab.id" />
                                    <notes v-else-if="tab.type=='NOTES'" :ref="tab.id" />
                                    <medicines :data="tab.data" :patient="visit.term.patient" v-else-if="tab.type=='MEDICINES'" :ref="tab.id" />
                                    <oculist :data="tab.data" :patient="visit.term.patient" v-else-if="tab.type=='OCULIST'" :ref="tab.id"></oculist>
                                    <referrals :data="tab.data" :patient="visit.term.patient" v-else-if="tab.type=='EXAMINATIONS'" :ref="tab.id"></referrals>
                                    <visit-tab :name="tab.name" :templates="templates.filter((t) => t.tab_title == tab.title)"
                                               :initial="tab.data" :ref="tab.id" v-else></visit-tab>
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
export default {
  name: 'visit',
  data () {
    return {
      visit: {tabs: [], term: {patient: {}, service: {}, doctor: {}}},
      visitPdfSrc: '',
      editingPesel: false,
      editingLastName: false,
      templates: [],
      formName: '',
      formTitle: '',
      tabIndex: 0,
      icds: [],
      forms: {
        show: false,
        items: [],
        type: null
      }
    }
  },
  methods: {
    saveAddress () {

    },
    savePesel () {

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
        if (component.save) { component.save() }
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
    }
  },
  mounted () {
    axios.get('rest/visits/' + this.$route.params.id + '/').then(response => {
      this.visit = response.data
      if (this.visit.icd_codes) {
        this.icds = this.visit.icd_codes
      }
    })
    axios.get('rest/templates/').then(response => { this.templates = response.data.results })
  },
  components: {
    PdfForm,
    Icd,
    AppHeader,
    AppFooter,
    VisitTab,
    Notes,
    Archive,
    Medicines,
    Oculist,
    Referrals
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
