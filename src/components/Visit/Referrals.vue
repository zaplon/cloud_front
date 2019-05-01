<template>
    <div>
        <b-modal ok-title="Zapisz" cancel-title="Anuluj" size="md" id="newExaminationModal" title="Dodaj badanie" @ok="createExamination" ref="newExaminationModal">
            <generic-form :fields="formFields" ref="form"></generic-form>
        </b-modal>
        <form>
            <div class="row">
                <div class="col">
                    <input class="form-control mb-4" type="text" v-model="inputValue" placeholder="kod lub nazwa badania" />
                </div>
                <div class="col-auto">
                    <button @click="print" type="button" class="btn btn-primary">Drukuj skierowanie</button>
                </div>
                <div class="col">
                    <button @click="showModal" class="btn btn-success">
                        <i class="fa fa-plus"></i>
                    </button>
                </div>
            </div>
        </form>
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Nazwa</th>
                    <th>Kategoria</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr class="table-info" :key="examination.id" v-for="examination in selectedExaminations">
                    <td>{{ examination.name }}</td>
                    <td>{{ examination.category_name }}</td>
                    <td>
                        <button class="btn btn-sm btn-danger" @click="removeExamination(examination)">Usuń</button>
                    </td>
                </tr>
                <tr :key="examination.id" v-for="examination in examinations" v-if="!examination.selected">
                    <td>{{ examination.name }}</td>
                    <td>{{ examination.category_name }}</td>
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
import GenericForm from '@/components/Forms/GenericForm'
export default {
  name: 'examinations',
  components: {GenericForm},
  props: {
    data: {type: Array, default: () => []},
    patient: {type: Object, default: () => {}}
  },
  data () {
    return {
      excludes: [],
      examinations: [],
      selectedExaminations: [],
      inputValue: '',
      formFields: [
        {name: 'name', label: 'Nazwa'},
        {name: 'category', label: 'Kategoria', type: 'select', choicesUrl: 'rest/examinations_categories/'}
      ]
    }
  },
  methods: {
    showModal () {
      this.$refs.newExaminationModal.show()
    },
    createExamination (evt) {
      var data = this.$refs.form.getData()
      evt.preventDefault()
      axios.post('rest/examinations/', data).then(response => {
        this.$refs.form.reset()
        this.addExamination(response.data)
        this.$refs.newExaminationModal.hide()
      }).catch(error => {
        this.$refs.form.errors = error.response.data
      })
    },
    getData () {
      return this.selectedExaminations
    },
    print () {
      axios.post('pdf/', {patient: this.patient, name: 'Skierowanie', examinations: this.selectedExaminations, template_name: 'examinations'}).then(response => {
        let url = axios.defaults.baseURL.substr(0, axios.defaults.baseURL.length - 1) + response.data
        // this.$refs.pdfForm.show(form.name, form.title, data)
        EventBus.$emit('show-document', url, 'Skierowanie')
      })
    },
    addExamination (examination) {
      this.selectedExaminations.push(examination)
      this.excludes.push(examination.id)
      this.inputValue = ''
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
