<template>
    <div>
        <b-modal :static="true" ok-title="Prześlij" title="Prześlij pliki" ref="uploadModal" @ok="uploadImages" @cancel="modalCancel"
                 size="md" cancel-title="Zamknij">
            <div class="row">
                <div class="col-md-3">Pacjent</div>
                <div class="col-md-9">
                    <autocomplete id="patient" input-class="form-control" @selected="selectPatient"
                                  :source="patientsUrl" ref="patientAutocomplete"
                                  :request-headers="authHeaders" :initialDisplay="initialPatient"
                                  results-property="results" placeholder="Wyszukaj..." results-display="label">
                    </autocomplete>
                    <small id="emailHelp" class="form-text text-muted">Domyślnie ostatni obsłużony dzisiaj pacjent</small>
                </div>
                <div class="col-md-9 offset-md-3 text-danger" v-show="errors.patient">
                    Proszę wybrać pacjenta
                </div>
            </div>
            <div class="row mt-2">
                <div class="col-md-3">Kategoria</div>
                <div class="col-md-9">
                    <autocomplete id="category" input-class="form-control" @selected="selectCategory"
                                  :source="categoriesUrl" ref="categoryAutocomplete"
                                  :request-headers="authHeaders"
                                  results-property="results" placeholder="Wyszukaj..." results-display="label">
                    </autocomplete>
                </div>
            </div>
            <div class="row mt-2">
                <div class="col-md-12 col-sm-12">
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input" v-model="mergeImages">
                        <label>Połącz zdjęcia w jeden dokument</label>
                    </div>
                </div>
            </div>
        </b-modal>
        <form enctype="multipart/form-data">
            <div class="row">
                <div class="mt-2 col-md-4 col-sm-12" v-for="(input, index) in inputs" :key="input.name">
                    <div v-if="input.url">
                        <img class="image" :src="input.url">
                        <button type="button" class="delete-image btn btn-danger" @click="deleteImage(index)">Usuń</button>
                    </div>
                    <input v-else :name="input.name" @change="processFile($event, input)" class="form-control" type="file"
                           accept="image/*" capture>
                </div>
            </div>
            <div class="fixed-bottom">
                <div class="row">
                    <button :disabled="files.length==0" type="button" @click="showUploadPopup" id="send-mobile-images"
                            class="btn btn-primary btn-lg">
                        Dalej
                    </button>
                </div>
            </div>
        </form>
    </div>
</template>
<script>
import axios from 'axios'
import Autocomplete from 'vuejs-auto-complete'
export default {
  name: 'images',
  components: {Autocomplete},
  mounted () {
    if (this.$store.state.user.doctor.default_archive_category) {
      let category = this.$store.state.user.doctor.default_archive_category
      category.label = category.name
      this.$refs.categoryAutocomplete.select(category)
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
    modalCancel () {
      this.$refs.uploadModal.hide()
    },
    selectPatient (obj) {
      this.patient = obj.selectedObject
    },
    selectCategory (obj) {
      this.category = obj.selectedObject
    },
    showUploadPopup () {
      axios.get('rest/patients/last_served/').then(response => {
        let patient = response.data
        patient.label = patient.name_with_pesel
        this.$refs.patientAutocomplete.select(patient)
      })
      this.$refs.uploadModal.show()
    },
    processFile (event, input) {
      let file = event.target.files[0]
      this.files.push(file)
      input.url = URL.createObjectURL(file)
      this.inputs.push({name: 'file' + this.inputs.length, url: null})
    },
    uploadImages (event) {
      console.log(this.patient)
      if (!this.$refs.patientAutocomplete.value) {
        this.errors.patient = true
        event.preventDefault()
        return
      }
      let formData = new FormData()
      for (let i = 0; i < this.files.length; i++) {
        formData.append('files[]', this.files[i])
      }
      formData.append('patient_id', this.patient.id)
      if (this.$refs.categoryAutocomplete.value) {
        formData.append('category_id', this.category.id)
      }
      formData.append('merge', this.mergeImages)
      axios.post('rest/results/add_images/', formData).then(response => {
        this.files = []
        this.inputs = [{name: 'file1', url: null}]
        this.$notify({
          group: 'full-width',
          title: 'Zdjęcia przesłano na serwer',
          text: '',
          type: 'success'
        })
      }).catch(error => {
        console.log(error)
        this.$notify({
          group: 'full-width',
          title: 'Wystąpił bład',
          text: '',
          type: 'danger'
        })
      })
    },
    deleteImage (index) {
      this.inputs.splice(index, 1)
      this.files.splice(index, 1)
    }
  },
  data () {
    return {
      mergeImages: true,
      errors: {patient: false},
      initialPatient: '',
      patientsUrl: axios.defaults.baseURL + 'rest/patients/?term=',
      categoriesUrl: axios.defaults.baseURL + 'rest/specializations/?term=',
      inputs: [{name: 'file1', url: null}],
      files: [],
      patient: {},
      category: {}
    }
  }
}
</script>
<style>
#send-mobile-images {
    width: 100%;
}
.delete-image {
    width: 100%;
}
.image {
    max-width: 100%;
}
</style>
