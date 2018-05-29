<template>
    <ul class="nav">
        <template v-for="category in categories">
            <li :key="category.name" class="nav-item nav-dropdown">
                <a class="nav-link nav-dropdown-toggle" href="#" @click="openCategory(category)">{{ category.name }}</a>
            </li>
            <ul :key="category.name" v-show="category.open">
                <li :key="document.id" class="nav-item" v-for="document in category.documents">
                    <a class="nav-item" href="#" @click="showDocument(document)">{{ document.date }}</a>
                </li>
            </ul>
        </template>
        <b-modal ref="documentModal" id="documentModal" size="lg">
            <embed :src="document.url" />
            <div slot="modal-footer" class="w-100">
                <b-btn size="sm" class="float-right" variant="default" @click="show=false">Zamknij</b-btn>
                <b-btn size="sm" class="float-right mr-2" variant="primary" @click="printDocument">Drukuj</b-btn>
            </div>
        </b-modal>
    </ul>
</template>
<script>
import axios from 'axios'
export default {
  name: 'archive',
  data () {
    return {
      categories: [{}],
      document: {url: '', title: ''}
    }
  },
  mounted () {
    axios.get('rest/results/').then(response => { console.log(response.data) })
  },
  methods: {
    showDocument (document) {
    },
    openCategory (category) {
      category.open = true
    },
    printDocument () {

    },
    searchDocuments (query) {
      axios.get('rest/results/').then(response => { this.categories = response.data })
    }
  }
}
</script>
