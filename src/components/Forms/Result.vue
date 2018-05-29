<template>
    <form @submit.prevent="save">
        <div class="form-group">
            <label for="name">Nazwa</label>
            <input type="text" required v-model="form.name" :class="[{ 'is-invalid ': errors.name }, 'form-control']" id="name">
            <div :key="error" v-for="error in errors.name" class="invalid-feedback">{{ error }}</div>
        </div>
        <div class="form-group">
            <label for="file">Plik</label>
            <input type="file" required @change="processFile($event)"
                   :class="[{ 'is-invalid ': errors.file }, 'form-control']" id="file">
            <div :key="error" v-for="error in errors.file" class="invalid-feedback">{{ error}}</div>
        </div>
        <div class="form-group">
            <label for="desc">Opis</label>
            <textarea v-model="form.description" rows="10" class="form-control" id="desc"></textarea>
            <div :key="error" v-for="error in errors.description" class="invalid-feedback">{{ error }}</div>
        </div>
        <div class="form-group">
            <label>Pacjent</label>
            <autocomplete id="patient" required
                          :input-class="{ 'is-invalid form-control': errors.patient, 'form-control': !errors.patient }"
                          @selected="selectPatient" :source="patientsUrl"
                          results-property="results" placeholder="Wyszukaj..." :initialDisplay="autocompletes.patient"
                          results-display="label">
            </autocomplete>
            <div :key="error" v-for="error in errors.patient" class="invalid-feedback">{{ error }}</div>
        </div>
        <div class="form-group">
            <label>Lekarz</label>
            <autocomplete id="doctor" input-class="form-control" @selected="selectDoctor"
                          :source="doctorsUrl"
                          results-property="results" placeholder="Wyszukaj..." :initialDisplay="autocompletes.doctor"
                          results-display="name">
            </autocomplete>
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
        patient: null,
        doctor: null
      }
    }
  },
  data () {
    return {
      patientsUrl: axios.defaults.baseURL + 'rest/patients/?term=',
      doctorsUrl: axios.defaults.baseURL + 'rest/doctors/?term=',
      url: axios.defaults.baseURL + 'rest/results/',
      form: {name: '', file: '', doctor: '', patient: '', description: ''},
      errors: {}
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
      console.log(formData)
      var promise = {}
      if (this.pk) {
        promise = axios.patch(this.url + this.pk + '/', formData, config).then(response => {
          if (!response.data.success) {
            this.displayErrors(response.data)
          }
        })
      } else {
        promise = axios.post(this.url, formData, config).then(response => {
          if (!response.data.success) {
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
    selectDoctor (obj) {
      this.form.doctor = obj.selectedObject.id
    }
  },
  components: {
    Autocomplete
  }
}
</script>
