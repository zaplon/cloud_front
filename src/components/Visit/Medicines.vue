<template>
    <div>
        <form @submit.prevent="printRecipe" class="mb-2">
            <div class="form-row">
                <div class="col-auto">
                    <input class="form-control" type="number" id="nfz-number" v-model="prescription.nfz" placeholder="Oddział NFZ">
                </div>
                <div class="col-auto">
                    <input class="form-control" type="date" id="realisation-date" v-model="prescription.realisationDate"
                    placeholder="Data realizacji">
                </div>
                <div class="col-auto">
                    <button :disabled="this.selections.length==0" class="btn btn-info">Drukuj</button>
                </div>
            </div>
        </form>
        <input class="form-control mb-4" type="text" v-model="inputValue" placeholder="nazwa lub substancja czynna" />
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Nazwa</th><th>Skład</th><th>Opakowanie</th><th>Refundacja</th><th>Postać</th><th>Dawka</th><th></th>
                </tr>
            </thead>
            <tbody>
                <tr class="table-info" v-for="selection in selections" :key="selection.id">
                    <td>{{ selection.name }}</td><td>{{ selection.composition }}</td>
                    <td>
                        <select class="form-control" v-model="selection.size" @click="getChildren(selection)">
                            <option v-for="option in selection.children" v-bind:value="option.value" :key="option.id">
                                {{ option.size }} <span v-if="option.refundation" class="badge badge-primary">nfz</span>
                            </option>
                        </select>
                    </td>
                    <td>{{ selection.form }}</td><td>{{ selection.dose }}</td>
                    <td><button @click="remove(selection)" class="btn btn-danger">Usuń</button></td>
                </tr>
                <tr v-for="suggestion in suggestions" :key="suggestion.id">
                    <td>{{ suggestion.name }}</td><td>{{ suggestion.composition }}</td>
                    <td>
                        <select class="form-control" v-model="suggestion.size" @click="getChildren(suggestion)" @change="sizeSelected">
                            <option v-if="!suggestion.children">Wybierz...</option>
                            <option v-for="option in suggestion.children" v-bind:value="option.id" :key="option.id">
                                {{ option.size }} <span v-if="option.refundation" class="badge badge-primary">nfz</span>
                            </option>
                        </select>
                    </td>
                    <td>
                        <select class="form-control" v-model="suggestion.refundation">
                            <option v-if="!suggestion.refundation">0%</option>
                            <option v-for="option in suggestion.refundations" v-bind:value="option.id" :key="option.id"></option>
                        </select>
                    </td>
                    <td>{{ suggestion.form }}</td><td>{{ suggestion.dose }}</td>
                    <td><button @click="add(suggestion)" class="btn btn-success">Dodaj</button></td>
                </tr>
                <tr v-if="suggestions.length == 0">
                    <td colspan="7" class="text-center"><span class="text-muted">Brak wyników</span></td>
                </tr>
            </tbody>
        </table>
        <b-modal size="lg" id="prescriptionModal" title="Recepta" ref="prescriptionModal">
            <embed :src="prescription.url" id="form-frame">
            <div slot="modal-footer" class="w-100">
                <button @click="hidePrescription" class="pull-right btn btn-sm btn-default">Zamknij</button>
            </div>
        </b-modal>
    </div>
</template>
<script>
import axios from 'axios'
import _ from 'lodash'
export default {
  name: 'medicines',
  props: {
    patient: Object,
    number: String
  },
  data () {
    return {
      selections: [],
      suggestions: [],
      excludes: [],
      inputValue: [],
      prescription: {
        nfz: '',
        realisationDate: new Date(),
        permissions: '',
        url: ''
      }
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
    hidePrescription () {
      this.$refs.prescriptionModal.hide()
    },
    getChildren (suggestion) {
      if (!suggestion.children) {
        axios.get('rest/medicines/', {params: {parent: suggestion.id}}).then(response => {
          this.$set(suggestion, 'children', response.data.results)
        })
      }
    },
    sizeSelected (event, data) {
      console.log(event, data)
    },
    printRecipe () {
      axios.post('visit/recipe/', {medicines: this.suggestions,
        nfz: this.prescription.nfz,
        permissions: this.prescription.permissions,
        number: this.number,
        patient: this.patient,
        realisationDate: this.prescription.realisationDate}).then(response => {
        this.prescription.url = axios.defaults.baseURL + response
        this.$refs.prescriptionModal.show()
      })
    },
    add (record) {
      this.selections.push(record)
      this.suggestions.splice(this.suggestions.indexOf(record), 1)
    },
    remove (record) {
      this.selections.splice(this.selections.indexOf(record), 1)
    },
    getSuggestions () {
      axios.get('rest/medicine_parents/', {params: {search: this.inputValue}}).then(response => {
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
