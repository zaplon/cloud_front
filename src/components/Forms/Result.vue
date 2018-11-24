<template>
    <form @submit.prevent="save">
        <div class="form-group row">
            <label class="col-md-2" for="name">Nazwa</label>
            <div class="col-md-10">
                <input type="text" required v-model="form.name" :class="[{ 'is-invalid ': errors.name }, 'form-control']" id="name">
            </div>
            <div :key="error" v-for="error in errors.name" class="col-md-10 offset-md-2 invalid-feedback">{{ error }}</div>
        </div>
        <div class="form-group row">
            <label class="col-md-2" for="file">Plik</label>
            <div class="col-md-10">
                <input type="file" required @change="processFile($event)"
                       :class="[{ 'is-invalid ': errors.file }, 'form-control']" id="file">
            </div>
            <div :key="error" v-for="error in errors.file" class="col-md-10 offset-md-2 invalid-feedback">{{ error}}</div>
        </div>
        <div class="form-group row">
            <label class="col-md-2" for="desc">Opis</label>
            <div class="col-md-10">
                <textarea v-model="form.description" rows="5" class="form-control" id="desc"></textarea>
            </div>
            <div :key="error" v-for="error in errors.description" class="col-md-10 offset-md-2 invalid-feedback">{{ error }}</div>
        </div>
        <div class="form-group row">
            <label class="col-md-2">Pacjent</label>
            <div class="col-md-10">
                <autocomplete id="patient" required
                              :input-class="{ 'is-invalid form-control': errors.patient, 'form-control': !errors.patient }"
                              @selected="selectPatient" :source="patientsUrl"
                              :request-headers="authHeaders"
                              results-property="results" placeholder="Wyszukaj..." :initialDisplay="autocompletes.patient"
                              results-display="label">
                </autocomplete>
            </div>
            <div :key="error" v-for="error in errors.patient" class="col-md-10 offset-md-2 invalid-feedback">{{ error }}</div>
        </div>
        <div class="form-group row">
            <label class="col-md-2">Kategoria</label>
            <div class="col-md-10">
                <autocomplete id="specialization" input-class="form-control" @selected="selectSpecialization"
                              :source="specializationsUrl"
                              :request-headers="authHeaders"
                              results-property="results" placeholder="Wyszukaj..." :initialDisplay="autocompletes.specialization"
                              results-display="name">
                </autocomplete>
            </div>
        </div>
    </form>
</template>
<script>
import axios from 'axios'
import Autocomplete from 'vuejs-auto-complete'
export default {
  name: 'form-result',
  props: {
    pk: Number
  },
  computed: {
    autocompletes () {
      return {
        patient: this.patient,
        specialization: this.specialization
      }
    },
    authHeaders () {
      return {
        'Authorization': 'Token ' + localStorage.token
      }
    }
  },
  data () {
    return {
      patientsUrl: axios.defaults.baseURL + 'rest/patients/?term=',
      specializationsUrl: axios.defaults.baseURL + 'rest/specializations/?term=',
      url: axios.defaults.baseURL + 'rest/results/',
      form: {name: '', file: '', doctor: '', patient: '', description: ''},
      errors: {},
      patient: '',
      specialization: ''
    }
  },
  methods: {
    processFile (event) {
      this.form.file = event.target.files[0]
    },
    displayErrors (data) {
      this.errors = data
    },
    save () {
      let formData = new FormData()
      var config = { headers: {
        'Content-Type': 'multipart/form-data'
      } }
      for (let field in this.form) { formData.append(field, this.form[field]) }
      var promise = {}
      if (this.pk) {
        promise = axios.patch(this.url + this.pk + '/', formData, config).then(response => {
          if (!response.data.id) {
            this.displayErrors(response.data)
          }
        })
      } else {
        promise = axios.post(this.url, formData, config).then(response => {
          if (!response.data.id) {
            this.displayErrors(response.data)
          }
        })
      }
      promise.catch(error => { this.displayErrors(error.response.data) })
      return promise
    },
    selectPatient (obj) {
      this.form.patient = obj.selectedObject.id
    },
    selectSpecialization (obj) {
      this.form.specialization = obj.selectedObject.id
    }
  },
  components: {
    Autocomplete
  }
}
</script>
