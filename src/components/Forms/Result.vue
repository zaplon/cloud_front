<template>
    <form @submit.prevent="save">
        <div class="form-group row">
            <label class="col-md-2" for="name">Nazwa</label>
            <div class="col-md-10">
                <input type="text" required v-model="form.name" :class="[{ 'is-invalid ': errors.name.length > 0 }, 'form-control']" id="name">
                <div :key="error" v-for="error in errors.name" class="invalid-feedback">{{ error }}</div>
            </div>
        </div>
        <div class="form-group row">
            <label class="col-md-2" for="file">Plik</label>
            <div class="col-md-10">
                <input type="file" required @change="processFile($event)"
                       :class="[{ 'is-invalid ': errors.file.length > 0 }, 'form-control']" id="file">
                <div :key="error" v-for="error in errors.file" class="invalid-feedback">{{ error}}</div>
            </div>
        </div>
        <div class="form-group row">
            <label class="col-md-2" for="desc">Opis</label>
            <div class="col-md-10">
                <textarea v-model="form.description" rows="5" class="form-control" id="desc"></textarea>
            </div>
            <div :key="error" v-for="error in errors.description" class="invalid-feedback">{{ error }}</div>
        </div>
        <div class="form-group row">
            <label class="col-md-2">Pacjent</label>
            <div class="col-md-10">
                <input type="text" class="form-control" readonly="readonly" v-model="patientLabel" v-if="fixedPatient">
                <autocomplete v-else id="patient" required ref="patientAutocomplete"
                              :input-class="{ 'is-invalid form-control': errors.patient.length > 0,
                              'form-control': !errors.patient.length == 0 }"
                              @selected="selectPatient" :source="patientsUrl"
                              :request-headers="authHeaders"
                              results-property="results" placeholder="Wyszukaj..." :initialDisplay="autocompletes.patient"
                              results-display="label">
                </autocomplete>
                <div :key="error" v-for="error in errors.patient" class="invalid-feedback">{{ error }}</div>
            </div>
        </div>
        <div class="form-group row">
            <label class="col-md-2">Kategoria</label>
            <div class="col-md-10">
                <autocomplete id="specialization" @selected="selectSpecialization"
                              :source="specializationsUrl" ref="specializationAutocomplete"
                              :request-headers="authHeaders"
                              :input-class="{ 'is-invalid form-control': errors.specialization.length > 0,
                              'form-control': !errors.specialization.length == 0 }"
                              results-property="results" placeholder="Wyszukaj..." :initialDisplay="autocompletes.specialization"
                              results-display="name">
                </autocomplete>
                <div :key="error" v-for="error in errors.specialization" class="invalid-feedback">{{ error }}</div>
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
    pk: Number,
    fixedPatient: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  computed: {
    autocompletes () {
      return {
        patient: null,
        specialization: null
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
      patientLabel: '',
      form: {name: '', file: '', doctor: '', patient: '', description: ''},
      errors: {name: [], file: [], doctor: [], patient: [], specialization: []}
    }
  },
  methods: {
    reset () {
      let patient = ''
      if (this.fixedPatient) {
        patient = this.form.patient
      } else {
        this.setPatientLabel(patient)
      }
      this.form = {name: '', file: '', doctor: '', patient: patient, description: ''}
      this.errors = {name: [], file: [], doctor: [], patient: [], specialization: []}
      this.setSpecializationLabel()
    },
    setPatientLabel (label) {
      if (this.fixedPatient) { this.patientLabel = label } else { this.$refs.patientAutocomplete.display = label }
    },
    setSpecializationLabel (label) {
      this.$refs.specializationAutocomplete.display = label
    },
    processFile (event) {
      this.form.file = event.target.files[0]
    },
    displayErrors (data) {
      this.errors = data
    },
    verify () {
      var errorsFound = false
      if (!this.form.specialization) {
        errorsFound = true
        this.errors['specialization'] = ['Proszę wybrać kategorię']
      }
      if (!this.form.patient) {
        errorsFound = true
        this.errors['patient'] = ['Proszę wybrać pacjenta']
      }
      if (!this.form.name) {
        errorsFound = true
        this.errors['name'] = ['Proszę podać nazwę pliku']
      }
      if (!this.form.file) {
        errorsFound = true
        this.errors['file'] = ['Proszę wybrać plik']
      } else {
        var fileSize = this.form.file.size / 1024 / 1024
        if (fileSize > 10) {
          this.errors['file'] = ['Proszę wybrać plik o rozmiarze mniejszym niż 10MB']
        }
      }
      console.log(this.errors)
      return !errorsFound
    },
    save () {
      if (!this.verify()) {
        return
      }
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
