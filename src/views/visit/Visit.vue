<template>
    <div class="align-items-center">
        <AppHeader/>
            <div class="app-body" id="visit-body">
                <div class="sidebar" id="visit-sidebar">
                    <ul class="nav">
                        <li class="nav-item"><a class="nav-link"><i class="nav-icon fa fa-archive"></i> Archiwum</a></li>
                    </ul>
                    <archive></archive>
                </div>
                <div class="main">
                <nav class="navbar navbar-light bg-light justify-content-between" id="visit-nav">
                    <form class="form-inline">
                        <button class="btn btn-light mr-2" @click="printVisit" type="button">
                            <i class="fa fa-print"></i>&nbsp;Wizyta
                        </button>
                        <button type="button" @click="showForms('orzeczenia')"
                                :class="{btn: true, 'btn-light': true, 'mr-2': true, 'active': (forms.type=='orzeczenia')}"
                        ><i class="fa fa-print"></i>&nbsp;Orzeczenia</button>
                        <button
                                :class="{btn: true, 'btn-light': true, 'mr-2': true, 'active': (forms.type=='zaswiadczenia')}"
                                type="button" @click="showForms('zaswiadczenia')"><i class="fa fa-print"></i>&nbsp;Zaświadczenia</button>
                    </form>
                    <form class="form-inline">
                        <button class="btn btn-danger mr-2" type="button" @click="cancelVisit">Cofnij</button>
                        <button class="btn btn-default mr-2" type="button" @click="saveVisit(true)">Zapisz tymczasowo</button>
                        <button class="btn btn-success" @click="saveVisit()" type="button">Zapisz</button>
                    </form>
                </nav>
                <nav class="navbar navbar-dark bg-secondary" id="forms-nav" v-show="forms.show">
                    <ul class="navbar-nav mr-auto">
                        <li class="nav-item" :key="form.name" v-for="form in forms.items">
                            <button @click="showForm(form)" class="btn btn-light btn-sm">{{ form.title }}</button>
                        </li>
                    </ul>
                </nav>
                <div id="visit-nav-margin"></div>
                <div class="container">
                    <b-card no-body>
                        <b-tabs pills card>
                            <template v-for="tab in visit.tabs">
                                <b-tab :key="tab.name" :title="tab.title" active>
                                    <icd v-if="tab.type=='TabTypes.ICD10'" :ref="tab.id" />
                                    <notes v-else-if="tab.type=='TabTypes.NOTES'" :ref="tab.id" />
                                    <visit-tab :initial="tab.data" :ref="tab.id" v-else></visit-tab>
                                </b-tab>
                            </template>
                        </b-tabs>
                    </b-card>
                </div>
            </div>
        </div>
        <pdf-form ref="pdfForm"></pdf-form>
        <b-modal size="lg" id="visitPDFModal" title="Historia choroby" ref="visitPDFModal">
            <embed :src="visitPdf" id="form-frame">
            <div slot="modal-footer" class="w-100">
                <button @click="hideVisitPdf" class="pull-right btn btn-sm btn-default">Zamknij</button>
                <button @click="print" class="pull-right mr-2 btn btn-sm btn-info">Drukuj</button>
            </div>
        </b-modal>
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
export default {
  name: 'visit',
  data () {
    return {
      visit: {tabs: []},
      formName: '',
      formTitle: '',
      visitPdf: '',
      forms: {
        show: false,
        items: [],
        type: null,
        orzeczenia: [{name: 'ABA', title: 'ABA'}],
        zaswiadczenia: []
      }
    }
  },
  methods: {
    hideVisitPdf () {
      this.$refs.visitPDFModal.hide()
    },
    showForms (type) {
      if (type === this.forms.type) { this.forms.show = false } else { this.forms.show = true }
      if (this.forms.show) { this.forms.type = type } else { this.forms.type = null }
      this.forms.items = this.forms[type]
    },
    showForm (form) {
      this.$refs.pdfForm.show(form.title, form.name)
    },
    printVisit () {
      this.saveVisit(true, true).then(
        axios.get('visit/pdf/' + this.$route.params.id + '/?as_link=1/').then(response => {
          this.visitPdf = axios.defaults.baseURL.substr(0, axios.defaults.baseURL.length - 1) + response.data
          this.$refs.visitPDFModal.show()
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
        if (!('success' in response) && !response.success) {
          this.$notify({
            group: 'nots',
            title: 'Błąd zapisu',
            text: 'error',
            type: 'danger'
          })
          return
        }
        this.$router.back()
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
  },
  components: {
    PdfForm,
    Icd,
    AppHeader,
    VisitTab,
    Notes,
    Archive
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
