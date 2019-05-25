<template>
    <div>
        <div class="row mb-2" v-if="popular">
            <div class="col-12">
                <label class="text-muted mr-1">Najczęstsze</label>
                <button :disabled="p.selected" @click="add(p)" :key="p.id" v-for="p in popular"
                        class="btn mr-1 btn-sm btn-info" :title="p.desc">
                    {{p.code}} ({{p.use_count}})
                </button>
            </div>
        </div>
        <input class="form-control mb-4" type="text" v-model="inputValue" placeholder="kod lub opis rozpoznania" />
        <table class="table table-striped">
            <thead>
                <tr><th>Kod</th><th>Opis</th><th></th></tr>
            </thead>
            <tbody>
                <tr class="table-info" v-for="selection in selections" :key="selection.code">
                    <td>{{ selection.code }}</td>
                    <td>
                        <input v-if="selection.custom_text" class="form-control" type="text" v-model="selection.custom_text">
                        <input v-else v-on:change="selection.custom_text=selection.desc" class="form-control"
                               type="text" v-model="selection.desc">
                    </td>
                    <td><button @click="remove(selection)" class="btn btn-sm btn-danger">Usuń</button></td>
                </tr>
                <tr v-for="suggestion in suggestions" :key="suggestion.id" v-if="!suggestion.selected">
                    <td>{{ suggestion.code }}</td><td>{{ suggestion.desc }}</td>
                    <td><button @click="add(suggestion)" class="btn btn-sm btn-success">Dodaj</button></td>
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
      popular: [],
      inputValue: []
    }
  },
  created () {
    this.debouncedGetSuggestions = _.debounce(this.getSuggestions, 500)
  },
  watch: {
    inputValue (value) {
      this.debouncedGetSuggestions()
    },
    selections (value) {
      this.disablePopular()
    }
  },
  methods: {
    add (record) {
      this.selections.push(record)
      record.selected = true
      this.$emit('icd-changed', this.selections)
      this.excludes.push(record.id)
      console.log(this.excludes)
      this.inputValue = ''
      // this.suggestions.splice(this.suggestions.indexOf(record), 1)
    },
    remove (record) {
      this.selections.splice(this.selections.indexOf(record), 1)
      this.$emit('icd-changed', this.selections)
      let selectedSuggestion = this.suggestions.find(x => x.id === record.id)
      if (selectedSuggestion) { selectedSuggestion.selected = false }
    },
    disablePopular () {
      this.popular.forEach(record => {
        console.log(record)
        let selectedPopular = this.selections.find(x => x.id === record.id)
        if (selectedPopular) { record.selected = true } else { record.selected = false }
      })
    },
    getSuggestions () {
      axios.get('rest/icd/', {params: {limit: 10, search: this.inputValue, exclude: this.excludes.join(',')}}).then(response => {
        this.suggestions = response.data.results
      })
    },
    getPopular () {
      axios.get('rest/icd/popular/', {params: {limit: 5}}).then(response => {
        this.popular = response.data.results
        this.disablePopular()
      })
    },
    getData () { return this.selections }
  },
  mounted () {
    this.getSuggestions()
    this.getPopular()
  }
}
</script>
