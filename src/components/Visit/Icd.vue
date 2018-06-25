<template>
    <div>
        <input class="form-control mb-4" type="text" v-model="inputValue" placeholder="kod lub opis rozpoznania" />
        <table class="table table-striped">
            <thead>
                <tr><th>Kod</th><th>Opis</th><th></th></tr>
            </thead>
            <tbody>
                <tr class="table-info" v-for="selection in selections" :key="selection.desc">
                    <td>{{ selection.code }}</td><td>{{ selection.desc }}</td>
                    <td><button @click="remove(selection)" class="btn btn-danger">Usuń</button></td>
                </tr>
                <tr v-for="suggestion in suggestions" :key="suggestion.id" v-if="!suggestion.selected">
                    <td>{{ suggestion.code }}</td><td>{{ suggestion.desc }}</td>
                    <td><button @click="add(suggestion)" class="btn btn-success">Dodaj</button></td>
                </tr>
                <tr v-if="suggestions.length == 0">
                    <td colspan="3" class="text-center"><span class="text-muted">Brak wyników</span></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
import axios from 'axios'
import _ from 'lodash'
export default {
  name: 'icd',
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      selections: this.data,
      suggestions: [],
      excludes: [],
      inputValue: []
    }
  },
  created () {
    this.debouncedGetSuggestions = _.debounce(this.getSuggestions, 500)
  },
  watch: {
    inputValue (value) {
      this.debouncedGetSuggestions()
    }
  },
  methods: {
    add (record) {
      this.selections.push(record)
      record.selected = true
      // this.suggestions.splice(this.suggestions.indexOf(record), 1)
    },
    remove (record) {
      this.selections.splice(this.selections.indexOf(record), 1)
      this.suggestions[this.suggestions.indexOf(record)].selected = false
    },
    getSuggestions () {
      axios.get('rest/icd/', {params: {limit: 10, search: this.inputValue, exclude: JSON.stringify(this.excludes)}}).then(response => {
        this.suggestions = response.data.results
        console.log(this.suggestions)
      })
    },
    getData () { return this.selections }
  },
  mounted () {
    this.getSuggestions()
  }
}
</script>
