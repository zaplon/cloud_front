<template>
    <div class="align-items-center">
        <AppHeader/>
            <div class="app-body" id="visit-body">
                <div class="sidebar" id="visit-sidebar">
                    <archive :pesel="visit.term.patient.pesel"></archive>
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
                        <button class="btn btn-secondary text-success" @click="saveVisit()" type="button">Zapisz</button>
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
                                <div class="col-auto"><strong>{{ visit.term.patient.pesel }}</strong></div>
                            </div>
                            <div class="row">
                                <div class="col-2">Adres</div>
                                <div class="col-auto"><strong>{{ visit.term.patient.address }}</strong></div>
                            </div>
                        </div>
                    </div>

                    <b-card no-body>
                        <b-tabs pills card v-model="tabIndex">
                            <template v-for="(tab, index) in visit.tabs">
                                <b-tab :key="tab.name" :title="tab.title" :active="index == 0">
                                    <icd :data="visit.icd_codes" v-if="tab.type=='ICD10'" :ref="tab.id" />
                                    <notes v-else-if="tab.type=='NOTES'" :ref="tab.id" />
                                    <medicines :data="tab.data" :patient="visit.term.patient" v-else-if="tab.type=='MEDICINES'" :ref="tab.id" />
                                    <visit-tab :name="tab.name" :templates="templates.filter((t) => t.tab_title == tab.title)"
                                               :initial="tab.data" :ref="tab.id" v-else></visit-tab>
                                </b-tab>
                            </template>
                        </b-tabs>
                    </b-card>
                </div>
            </div>
        </div>
        <pdf-form ref="pdfForm"></pdf-form>
    </div>
</template>
<script>
import {Header as AppHeader} from '@/components/'
import axios from 'axios'
import PdfForm from '@/components/PdfForm'
import Icd from '@/components/Visit/Icd'
import VisitTab from '@/components/Visit/VisitTab'
import Archive from '@/components/Visit/Archive'
import Notes from '@/components/Visit/Notes'
import Medicines from '@/components/Visit/Medicines'
import forms from '@/_forms.js'
import EventBus from '@/eventBus'
export default {
  name: 'visit',
  data () {
    return {
      visit: {tabs: [], term: {patient: {}, service: {}, doctor: {}}},
      templates: [],
      formName: '',
      formTitle: '',
      tabIndex: 0,
      forms: {
        show: false,
        items: [],
        type: null
      }
    }
  },
  methods: {
    showDocument (file, title) {
      EventBus.$emit('show-document', title, file)
    },
    hideVisitPdf () { this.$refs.visitPDFModal.hide() },
    showForms (type) {
      if (type === this.forms.type) { this.forms.show = false } else { this.forms.show = true }
      if (this.forms.show) { this.forms.type = type } else { this.forms.type = null }
      this.forms.items = forms.forms[type]
    },
    showForm (form) { this.$refs.pdfForm.show(form.name, form.title, this.visit.term.patient) },
    printVisit () {
      this.saveVisit(true, true).then(
        axios.get('visit/pdf/' + this.$route.params.id + '/?as_link=1/').then(response => {
          let visitPdf = axios.defaults.baseURL.substr(0, axios.defaults.baseURL.length - 1) + response.data
          this.showDocument('Historia choroby', visitPdf)
        })
      )
    },
    print () {

    },
    cancelVisit () {
      this.$router.back()
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
    })
    axios.get('rest/templates/').then(response => { this.templates = response.data.results })
  },
  components: {
    PdfForm,
    Icd,
    AppHeader,
    VisitTab,
    Notes,
    Archive,
    Medicines
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
