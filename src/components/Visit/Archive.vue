<template>
    <ul class="nav">
        <li class="nav-item"><span class="nav-link" id="archive-header">
           Archiwum <button @click="addDocument" id="add-document" class="ml-4 btn btn-success btn-sm">Dodaj</button></span>
        </li>
        <li v-for="category in categories" :key="category.name" class="font-sm nav-item">
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
      categories: [{}],
      document: {file: '', title: ''}
    }
  },
  watch: {
    patient () {
      this.loadCategories()
    }
  },
  methods: {
    loadCategories () {
      axios.get('rest/results/', {params: {pesel: this.patient.pesel, as_categories: 1}}).then(
        response => {
          this.categories = response.data
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
    #add-document {
        cursor: pointer
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
