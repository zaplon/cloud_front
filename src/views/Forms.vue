<template>
    <div class="card">
        <div class="card-header">
            Formularze
        </div>
        <div class="card-body">
            <form>
                <div class="row mb-4" style="align-items: center">
                    <div class="col">
                        <label>Pacjent</label>
                    </div>
                    <div class="col-auto" style="width: calc(100% - 74px); display: flex;">
                        <autocomplete id="patient" input-class="form-control" @selected="selectPatient"
                                      :source="patientsUrl" results-property="results" placeholder="Wyszukaj..."
                                      :request-headers="authHeaders"
                                      results-display="label" @clear="clearPatient">
                        </autocomplete>
                    </div>
                </div>
            </form>
            <div v-for="(category, key) in forms" :key="key">
                <h4 class="mt-2">{{ key }}</h4>
                <button @click="showForm(item)" class="btn btn-info mr-2 mt-2" v-for="item in category" :key="item.name">{{ item.title }}</button>
            </div>
        </div>
        <pdf-form ref="pdfForm"></pdf-form>
    </div>
</template>
<script>
import forms from '@/_forms.js'
import PdfForm from '@/components/PdfForm'
import axios from 'axios'
import Autocomplete from 'vuejs-auto-complete'
export default {
  name: 'forms',
  data () {
    return {
      patient: '',
      patientsUrl: axios.defaults.baseURL + 'rest/patients/?term=',
      forms: forms.forms
    }
  },
  computed: {
    authHeaders () {
      return {
        'Authorization': 'Token ' + localStorage.token
      }
    }
  },
  methods: {
    selectPatient (obj) {
      this.patient = obj.selectedObject
    },
    clearPatient () {
      this.patient = ''
    },
    showForm (form) {
      if (this.patient) {
        axios.get('/rest/patients/' + this.patient.id + '/').then(response => {
          this.$refs.pdfForm.show(form.name, form.title, response.data, form.modalClass)
        })
      } else {
        this.$refs.pdfForm.show(form.name, form.title, {}, form.modalClass)
      }
    }
  },
  components: {PdfForm, Autocomplete}
}
</script>
