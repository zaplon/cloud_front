<template>
    <div>
        <form>
            <div class="row">
                <div class="col">
                    <input class="form-control mb-4" type="text" v-model="inputValue" placeholder="kod lub nazwa badania" />
                </div>
                <div class="col">
                    <button @click="print" type="button" class="btn btn-primary">Drukuj skierowanie</button>
                </div>
            </div>
        </form>
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Kod</th>
                    <th>Nazwa</th>
                    <th>Kategoria</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr class="table-info" :key="examination.id" v-for="examination in selectedExaminations">
                    <td>{{ examination.code }}</td>
                    <td>{{ examination.name }}</td>
                    <td>{{ examination.category }}</td>
                    <td>
                        <button class="btn btn-sm btn-danger" @click="removeExamination(examination)">Usuń</button>
                    </td>
                </tr>
                <tr :key="examination.id" v-for="examination in examinations" v-if="!examination.selected">
                    <td>{{ examination.code }}</td>
                    <td>{{ examination.name }}</td>
                    <td>{{ examination.category }}</td>
                    <td>
                        <button class="btn btn-sm btn-success" @click="addExamination(examination)">Dodaj</button>
                    </td>
                </tr>
                <tr v-if="examinations.length == 0">
                    <td colspan="4" class="text-center"><span class="text-muted">Brak wyników</span></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
import axios from 'axios'
import _ from 'lodash'
import EventBus from '@/eventBus'
export default {
  name: 'examinations',
  props: {
    data: {type: Array, default: () => []},
    patient: {type: Object, default: () => {}}
  },
  data () {
    return {
      excludes: [],
      examinations: [],
      selectedExaminations: [],
      inputValue: ''
    }
  },
  methods: {
    getData () {
      return this.selectedExaminations
    },
    print () {
      axios.post('pdf/', {patient: this.patient, name: 'Skierowanie', examinations: this.selectedExaminations, template_name: 'examinations'}).then(response => {
        let url = axios.defaults.baseURL.substr(0, axios.defaults.baseURL.length - 1) + response.data
        EventBus.$emit('show-document', url, 'Skierowanie')
      })
    },
    addExamination (examination) {
      this.selectedExaminations.push(examination)
      this.excludes.push(examination.id)
      examination.selected = true
    },
    removeExamination (record) {
      this.selectedExaminations.splice(this.selectedExaminations.indexOf(record), 1)
      this.examinations[this.examinations.indexOf(record)].selected = false
    },
    getSuggestions () {
      axios.get('rest/examinations/', {params: {limit: 10, search: this.inputValue, exclude: this.excludes.join(',')}}).then(response => {
        this.examinations = response.data.results
      })
    }
  },
  watch: {
    inputValue (value) {
      this.debouncedGetSuggestions()
    }
  },
  created () {
    this.debouncedGetSuggestions = _.debounce(this.getSuggestions, 500)
  },
  mounted () {
    if (this.data) this.selectedExaminations = this.data
    this.getSuggestions()
  }
}
</script>
