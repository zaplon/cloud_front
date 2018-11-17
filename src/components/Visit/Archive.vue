<template>
    <ul class="nav">
        <li class="nav-item"><span class="nav-link" id="archive-header">
           Archiwum <i @click="addDocument" id="add-document" class="fa fa-plus text-success"></i></span>
        </li>
        <li v-for="category in categories" :key="category.name">
            <a class="nav-link" href="#" @click.prevent="openCategory(category)">
                {{ category.name }} <span title="liczba dokumentów" class="badge badge-primary">{{ category.count }}</span>
            </a>
            <ul v-show="category.open" class="archive-category">
                <li :key="document.id" class="nav-item" v-for="document in category.documents">
                    <a class="nav-item" href="#" @click.prevent="showDocument(document)">{{ document.uploaded | formatDate }}</a>
                </li>
            </ul>
        </li>
        <b-modal body-class="text-dark" header-class="text-dark" cancel-title="Zamknij" size="md" id="newResultModal" title="Nowy dokument" @ok="modalOk" @cancel="modalCancel" ref="newResultModal">
            <form-result ref="newResultForm"></form-result>
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
    pesel: String
  },
  data () {
    return {
      categories: [{}],
      document: {file: '', title: ''}
    }
  },
  mounted () {
    this.loadCategories()
  },
  methods: {
    loadCategories () {
      axios.get('rest/results/', {params: {pesel: this.pesel, as_categories: 1}}).then(
        response => {
          this.categories = response.data
        })
    },
    addDocument () {
      this.$refs.newResultModal.show()
    },
    modalOk () {
      this.$refs.newResultForm.save().then((response) => {
        this.loadCategories()
      })
    },
    modalCancel () {
      this.$refs.newResultModal.hide()
    },
    showDocument (document) {
      this.document = document
      EventBus.$emit('show-document', document.file, document.name)
    },
    openCategory (category) {
      if (category.open) {
        category.open = false
        return
      }
      if (!category.documents) {
        axios.get('rest/results/', {pesel: this.pesel, category: category.name}).then((response) => {
          this.$set(category, 'documents', response.data.results)
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
</style>
