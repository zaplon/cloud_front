<template>
    <ul class="nav">
        <li class="nav-item"><span class="nav-link" id="archive-header">
           Archiwum <button @click="addDocument" id="add-document" class="ml-4 btn btn-success btn-sm">Dodaj</button></span>
        </li>
        <li>
            <form class="form">
                <div class="form-row ml-1">
                    <div class="col-auto">
                        <select class="form-control form-control-sm" v-model="downloadPeriod">
                            <option value="all">wszystko</option>
                            <option value="1 month">ostatni miesiąc</option>
                            <option value="3 months">ostatnie 3 miesiące</option>
                        </select>
                        <input type="date" style="display: none; width:150px;" v-model="downloadFrom"
                               class="form-control form-control-sm ml-1">
                    </div>
                </div>
                <div class="form-row mt-1 ml-1">
                    <button :disabled="!downloadFrom" v-if="!generatingPdf" class="btn ml-1 btn-primary btn-sm" type="button" @click="generatePdf">
                        Generuj PDF
                    </button>
                    <button class="btn ml-1 btn-primary btn-sm" type="button" disabled="disabled" v-else>Pracuję...</button>
                </div>
            </form>
        </li>
        <li class="mt-2 ml-2 mb-2">
            <div class="btn-group">
                <button @click="changeMode(false)"
                        v-bind:class="[{ active: !showAsList }, 'btn btn-sm btn-primary']">Drzewo</button>
                <button @click="changeMode(true)"
                        v-bind:class="[{ active: showAsList }, 'btn btn-sm btn-primary']">Lista</button>
            </div>
        </li>
        <li v-if="showAsList" class="font-sm nav-item ml-2" :key="document.id" v-for="document in documents.results">
            <a class="nav-item" href="#" @click.prevent="showDocument(document)">
                {{ document.name }} {{ document.uploaded | formatDate }}
            </a>
        </li>
        <li v-if="showAsList" class="nav-item category-nav ml-2">
            <a v-if="documents.previous" href="#" @click.prevent="changeDocumentsPage(documents.previous)">
                <i class="mr-1 fa fa-angle-double-left" aria-hidden="true"></i>cofnij
            </a>
            <a v-if="documents.next" href="#" @click.prevent="changeDocumentsPage(documents.next)">
                dalej<i class="ml-1 fa fa-angle-double-right" aria-hidden="true"></i>
            </a>
        </li>
        <li v-if="!showAsList" v-for="category in categories" :key="category.name" class="font-sm nav-item">
            <a class="nav-link" href="#" @click.prevent="openCategory(category)">
                {{ category.name }} <span>
                <i class="fa fa-minus text-secondary" v-if="category.open"></i>
                <i class="fa fa-plus text-secondary" v-else></i>
            </span> <span style="display: none;" title="liczba dokumentów" class="badge badge-primary archive-badge">{{ category.count }}</span>
            </a>
            <ul v-show="category.open" class="archive-category">
                <li :key="document.id" class="nav-item" v-for="document in category.documents">
                    <a class="nav-item" href="#" @click.prevent="showDocument(document)">
                        {{ document.name }} {{ document.uploaded | formatDate }}</a>
                </li>
                <li class="nav-item category-nav">
                    <a v-if="category.previous" href="#" @click.prevent="navigate(category.previous, category)">
                        <i class="mr-1 fa fa-angle-double-left" aria-hidden="true"></i>cofnij
                    </a>
                    <a v-if="category.next" href="#" @click.prevent="navigate(category.next, category)">
                        dalej<i class="ml-1 fa fa-angle-double-right" aria-hidden="true"></i>
                    </a>
                </li>
            </ul>
        </li>
        <b-modal body-class="text-dark" header-class="text-dark" cancel-title="Zamknij" size="md"
                 @hidden="$refs.newResultForm.reset()" id="newResultModal" title="Nowy dokument" @ok="modalOk"
                 @cancel="modalCancel" ref="newResultModal">
            <form-result fixed-patient ref="newResultForm"></form-result>
        </b-modal>
    </ul>
</template>
<script>
import axios from 'axios'
import FormResult from '../Forms/Result'
import EventBus from '@/eventBus'
export default {
  name: 'archive',
  components: {FormResult},
  props: {
    patient: Object
  },
  data () {
    return {
      generatingPdf: false,
      showAsList: false,
      categories: [{}],
      documents: {results: [], previous: '', next: ''},
      downloadFrom: new Date().toISOString().slice(0, 10),
      downloadPeriod: 'all',
      document: {file: '', title: ''}
    }
  },
  watch: {
    patient () {
      this.loadCategories()
      this.loadDocuments()
    }
  },
  methods: {
    changeMode (showAsList) {
      this.showAsList = showAsList
    },
    generatePdf () {
      // let startDate = this.$moment(this.downloadFrom).format('YYYY-mm-dd')
      axios.get('rest/results/generate_pdf/', {params: {period: this.downloadPeriod, patient_id: this.patient.id}}).then(
        response => {
          this.generatingPdf = true
          var interval = window.setInterval(() => { this.getGeneratedPdf(interval, this.downloadPeriod) }, 2000)
          var me = this
          window.setTimeout(function () {
            window.clearInterval(interval)
            me.generatingPdf = false
            me.$notify({
              group: 'nots',
              title: 'Wystąpił bład podczas generowania pliku PDF',
              text: '',
              type: 'danger'
            })
          }, 1000 * 30)
        }
      )
    },
    getGeneratedPdf (interval, period) {
      axios.get('rest/results/get_results_pdf/', {params: {period: period, patient_id: this.patient.id}}).then(response => {
        if (response.data === '-') {
          this.$notify({
            group: 'nots',
            title: 'Brak dokumentów pdf za podany okres',
            text: '',
            type: 'info'
          })
          return
        }
        this.showDocument({file: axios.defaults.baseURL + response.data,
          name: 'Archiwum pacjenta ' + this.patient.first_name + ' ' + this.patient.last_name})
        window.clearInterval(interval)
        this.generatingPdf = false
      })
    },
    loadCategories () {
      axios.get('rest/results/', {params: {pesel: this.patient.pesel, as_categories: 1}}).then(
        response => {
          this.categories = response.data
        })
    },
    loadDocuments () {
      axios.get('rest/results/?limit=15', {params: {pesel: this.patient.pesel}}).then(
        response => {
          this.documents = response.data
        })
    },
    navigate (link, category) {
      if (location.protocol === 'https:') { link = link.replace('http://', 'https://') }
      axios.get(link).then(
        response => {
          this.$set(category, 'documents', response.data.results)
          this.$set(category, 'next', response.data.next)
          this.$set(category, 'previous', response.data.previous)
        })
    },
    changeDocumentsPage (link) {
      if (location.protocol === 'https:') { link = link.replace('http://', 'https://') }
      axios.get(link).then(
        response => {
          this.documents.results = response.data.results
          this.documents.previous = response.data.previous
          this.documents.next = response.data.next
        })
    },
    addDocument () {
      this.$refs.newResultForm.setPatientLabel(this.patient.name_with_pesel)
      this.$refs.newResultForm.form.patient = this.patient.id
      this.$refs.newResultForm.reset()
      this.$refs.newResultModal.show()
    },
    modalOk (evt) {
      evt.preventDefault()
      if (this.$refs.newResultForm.verify()) {
        this.$refs.newResultForm.save().then(response => {
          this.$refs.newResultModal.hide()
          this.loadCategories()
        })
      }
    },
    modalCancel () {
      this.$refs.newResultModal.hide()
    },
    showDocument (document) {
      this.document = document
      let parts = document.file.split('.')
      let ext = parts[parts.length - 1]
      if (['doc', 'jpg', 'png', 'pdf', 'svg', 'bmp', 'docx', 'jpeg', 'txt', 'gif', 'webp'].indexOf(ext) > -1) {
        EventBus.$emit('show-document', document.file, document.name)
      } else {
        if (process.env.NODE_ENV === 'production') {
          window.open(document.file.replace('http', 'https'))
        } else {
          window.open(document.file)
        }
      }
    },
    openCategory (category) {
      if (category.open) {
        category.open = false
        return
      }
      if (!category.documents) {
        axios.get('rest/results/', {params: {pesel: this.patient.pesel, category: category.name}}).then((response) => {
          this.$set(category, 'documents', response.data.results)
          if (response.data.next) {
            this.$set(category, 'next', response.data.next)
          }
          this.$set(category, 'open', true)
        })
      } else {
        this.$set(category, 'open', true)
      }
    },
    searchDocuments (query) {
      axios.get('rest/results/').then(response => { this.categories = response.data })
    }
  }
}
</script>
<style>
    ul.nav {
        flex-direction: row;
        overflow-y: auto;
    }
    #add-document {
        cursor: pointer;
    }
    .archive-category {
        list-style: none;
    }
    #archive-header:hover {
        background-color: transparent!important;
    }
    .archive-badge {
        border-radius: 5px;
    }
    .archive-category .hidden {
        height: 0!important;
    }
</style>
