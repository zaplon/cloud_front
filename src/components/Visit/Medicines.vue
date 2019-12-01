<template>
    <div>
        <b-modal ok-title="Zapisz" cancel-title="Anuluj" size="md" id="addMedicineModal" title="Nowy lek"
                 @ok="addMedicine" ref="addMedicineModal">
            <medicine ref="medicineForm"></medicine>
        </b-modal>
        <b-modal ref="signPrescriptionModal">
            <form class="form">
                <div class="row">
                    <div class="col-md-2">
                        <label for="user-cert">Certyfikat użytkownika</label>
                    </div>
                    <div class="col-md-10">
                        <input id="user-cert" type="file" class="form-control">
                    </div>
                </div>
            </form>
        </b-modal>
        <div class="row mb-2 form-row">
            <div class="col-auto">
                <select style="width: 160px;" class="form-control" v-model="lastPrescriptionSelected">
                    <option value="0">Ostatnie recepty</option>
                    <option v-for="prescription in patientPrescriptions" :key="prescription.id"
                            :value="prescription.id">
                        {{ prescription.date | formatDate }}
                    </option>
                </select>
            </div>
            <div class="col-auto">
                <button @click="loadPrescription" class="btn btn-primary"
                        :disabled="parseInt(lastPrescriptionSelected) == 0">Wczytaj</button>
            </div>
        </div>
        <div>
            <div class="form-row align-items-center">
                <div class="col-auto mt-1">
                    <input style="width:160px;" class="form-control" type="text" id="nfz-number" v-model="prescription.nfz"
                           placeholder="Oddział NFZ" maxlength="2">
                </div>
                <div class="col-auto mt-1">
                    <input style="width:200px;" class="form-control" type="text" id="permissions" v-model="prescription.permissions"
                           placeholder="Uprawnienia dodatkowe">
                </div>
                <div class="col-auto mt-1">
                    <v-date-picker mode='single' v-model='prescription.realisationDate'>
                        <input style="width:150px;" placeholder="Data realizacji" :value='props.inputValue' type="text" class="form-control" slot-scope="props">
                    </v-date-picker>
                </div>
                <div class="col-auto mt-1">
                    <div class="form-check">
                        <label class="form-check-label">
                            <input title="Zamieść numer recepty na wydruku" class="form-check-input"
                                   type="checkbox" v-model="prescription.number"
                                   :disabled="this.$store.state.user.doctor.available_prescriptions == 0">
                            Z numerem
                        </label>
                    </div>
                </div>
                <div class="col-auto mt-1">
                    <button :disabled="!this.patient.id || !this.prescription.realisationDate || !this.prescription.permissions || !this.prescription.nfz" class="btn btn-info" @click="printRecipe">Drukuj</button>
                </div>
                <div class="col-auto mt-1">
                    <button @click="saveExternal" :disabled="!this.patient.id || !this.prescription.realisationDate || !this.prescription.permissions || !this.prescription.nfz" class="btn btn-info">Wygeneruj e-receptę</button>
                </div>
            </div>
        </div>
        <div class="row mb-2 mt-1 form-row">
        </div>
        <div class="row mb-2 form-row">
            <div class="col-auto">
                <autocomplete style="width:370px;" id="medicineAutocomplete" input-class="form-control" @selected="selectMedicine"
                              :source="medicinesUrl" placeholder="Nazwa lub substancja czynna..."
                              :request-headers="authHeaders"
                              ref="medicinesAutocomplete"
                              results-property="results"
                              results-display="name">
                </autocomplete>
            </div>
            <div class="col-auto" v-permission="'add_medicine'">
                <button class="btn btn-success" @click="showAddMedicineModal"><i class="fa fa-plus"></i></button>
            </div>
        </div>
        <div class="row mb-4">
        </div>
        <medicine-row :ref="selection.id" v-on:remove-record="remove" :medicine="selection" klass="table-info"
                      v-for="selection in selections" :key="selection.id"></medicine-row>
        <PdfDocument ref="prescriptionModal">
            <div slot="actions" class="float-right mr-2">
                <b-btn v-if="prescription.number" size="sm" variant="success" @click="saveExternal">
                    Wygeneruj e-receptę
                </b-btn>
                <b-btn v-else size="sm" variant="success" disabled="disabled"
                title="Wysyłka recepty jest możliwa tylko przy wykorzystaniu numeru recepty">Wygeneruj e-receptę</b-btn>
            </div>
        </PdfDocument>
    </div>
</template>
<script>
import axios from 'axios'
import _ from 'lodash'
import MedicineRow from './MedicineRow'
import Medicine from '@/components/Forms/Medicine'
import PdfDocument from '@/components/PdfDocument'
import EventBus from '@/eventBus'
import Autocomplete from 'vuejs-auto-complete'

export default {
  name: 'medicines',
  components: {PdfDocument, Medicine, MedicineRow, Autocomplete},
  props: {
    patient: Object,
    instance: {
      type: Number,
      default: 0
    },
    data: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      medicinesUrl: axios.defaults.baseURL + 'rest/medicine_parents/?search=',
      selections: [],
      suggestions: [],
      excludes: [],
      inputValue: [],
      prescription: {
        nfz: this.$store.state.user.system_settings.nfz_department,
        realisationDate: new Date(),
        number: false,
        permissions: 'X',
        url: ''
      },
      patientPrescriptions: [],
      lastPrescriptionSelected: 0
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
    selectMedicine (obj) {
      this.selections.push(obj.selectedObject)
      console.log(this)
      this.$refs.medicinesAutocomplete.clear()
    },
    serializeMedicine (data) {
      data.name = data.medicine.parent.name
      data.size = data.medicine.id
      data.dose = data.medicine.parent.dose
      data.children = [{id: data.medicine.id, size: data.medicine.size}]
      data.child = {id: data.medicine.id}
      data.loadChildren = true
      data.form = data.medicine.parent.form
      data.id = data.medicine.parent.id
      return data
    },
    loadPrescription () {
      axios.get('rest/prescriptions/' + this.lastPrescriptionSelected + '/').then((response) => {
        let serializedMedicines = []
        response.data.medicines.forEach((medicine) => {
          serializedMedicines.push(this.serializeMedicine(medicine))
          var matchedIndex = this.suggestions.findIndex((sugg) => sugg.id === medicine.medicine.parent.id)
          if (matchedIndex) {
            this.suggestions.splice(matchedIndex, 1)
          }
        })
        this.selections = serializedMedicines
      })
    },
    getPatientPrescriptions () {
      axios.get('rest/prescriptions/', {params: {patient_id: this.patient.id, only_filled: 1}}).then((response) => {
        this.patientPrescriptions = response.data.results
      })
    },
    showAddMedicineModal () {
      this.$refs.addMedicineModal.show()
    },
    addMedicine (evt) {
      evt.preventDefault()
      this.$refs.medicineForm.save(() => { this.$refs.addMedicineModal.hide() })
    },
    serializePrescription () {
      let medicines = []
      this.selections.forEach((s) => {
        medicines.push({medicine_id: s.child.id,
          dosage: s.dosage,
          amount: s.amount,
          notes: s.notes,
          refundation: parseInt(s.refundation) ? parseInt(s.refundation) : null})
      })
      return {
        patient: this.patient.id,
        doctor: this.$store.state.user.doctor.id,
        medicines: medicines,
        nfz: this.prescription.nfz,
        realisation_date: this.$moment(this.prescription.realisationDate).format('YYYY-MM-DD'),
        permissions: this.prescription.permissions,
        external_id: this.external_id,
        external_code: this.external_code,
        date: this.prescription.realisationDate,
        number: this.prescription.number
      }
    },
    savePrescription () {
      return axios.post('rest/prescriptions/', this.serializePrescription())
    },
    validatePrescription () {
      var errors = false
      this.selections.forEach((s, index) => {
        if (!this.$refs[s.id][0].validate()) {
          this.errors = true
        }
      })
      console.log(errors)
      return !errors
    },
    printRecipe () {
      if (!this.validatePrescription()) {
        return
      }
      axios.post('rest/prescriptions/print/', this.serializePrescription()).then(response => {
        let prescriptions = response.data.files
        let prescriptionUrl = axios.defaults.baseURL.substr(0, axios.defaults.baseURL.length - 1) + prescriptions[0]
        this.$refs.prescriptionModal.showDocument(prescriptionUrl, 'Recepta', this.patient.id)
      })
      // let medicines = []
      // console.log(this.$refs)
      // this.validatePrescription()
      // this.selections.forEach((s) => { medicines.push(this.$refs[s.id][0].getData()) })
      // axios.post('visit/recipe/', {
      //   medicines: this.selections,
      //   system_settings: this.$store.state.user.system_settings,
      //   nfz: this.prescription.nfz,
      //   permissions: this.prescription.permissions,
      //   number: this.prescription.number,
      //   patient: this.patient.id,
      //   realisationDate: this.$moment(this.prescription.realisationDate).format('DD.MM.YYYY')
      // }).then(response => {
      //   let prescriptionUrl = axios.defaults.baseURL.substr(0, axios.defaults.baseURL.length - 1) + response.data.url
      //   this.$refs.prescriptionModal.showDocument(prescriptionUrl, 'Recepta', this.patient.id)
      // })
    },
    add (record) {
      this.selections.push(record)
      record.selected = true
      this.inputValue = []
      // this.suggestions.splice(this.suggestions.indexOf(record), 1)
    },
    remove (record) {
      record.selected = false
      this.selections.splice(this.selections.indexOf(record), 1)
    },
    getSuggestions () {
      axios.get('rest/medicine_parents/', {params: {search: this.inputValue}}).then(response => {
        this.suggestions = response.data.results
        console.log(this.suggestions)
      })
    },
    getData () {
      return { prescription: this.prescription, selections: this.selections }
    },
    loadData (data) {
      this.prescription = data.prescription
      if (this.prescription.realisationDate) {
        this.prescription.realisationDate = this.$moment(this.prescription.realisationDate).toDate()
      }
      this.selections = data.selections
    },
    loadData2 (data) {
      this.buildSelections(data.medicines)
      this.prescription.nfz = data.nfz
      this.prescription.permissions = data.permissions
      this.prescription.number = data.number
    },
    buildSelections (medicines) {
      medicines.forEach((s) => {
        let row = s.medicine.parent
        row.size = s.medicine.id
        row.dosage = s.dosage
        row.children = [{id: s.medicine.id, size: s.medicine.size}]
        row.child = {id: s.medicine.id}
        row.loadChildren = true
        this.add(row)
      })
    },
    saveExternal () {
      axios.post('rest/prescriptions/save_in_p1/', this.serializePrescription()).then(response => {
        // this.prescription.external_id = response.data.external_id
        // this.prescription.external_code = response.data.external_code
        this.$refs.prescriptionModal.cancel()
        this.$notify({
          group: 'nots',
          title: 'Recepta została przesłana',
          text: '',
          type: 'success'
        })
        axios.get('rest/prescriptions/' + response.data.id + '/print_one/').then(response => {
          let url = axios.defaults.baseURL.substr(0, axios.defaults.baseURL.length - 1) + response.data.file
          EventBus.$emit('show-document', url, 'Recepta')
        })
      }).catch(error => {
        console.log(error.response.data)
        this.$notify({
          group: 'nots',
          title: 'Wystąpił problem podczas przesyłania recepty',
          text: error.response ? error.response.data : '',
          type: 'error'
        })
      })
    }
  },
  computed: {
    authHeaders () {
      console.log('Token ' + localStorage.token)
      return {
        'Authorization': 'Token ' + localStorage.token
      }
    }
  },
  mounted () {
    if (this.data) { this.loadData(this.data) }
    this.getSuggestions()
    this.getPatientPrescriptions()
    // if (this.instance) {
    //   axios.get('rest/prescriptions/' + this.instance + '/').then(response => {
    //     this.loadData(response.data)
    //     this.getSuggestions()
    //   })
    // } else {
    //   this.getSuggestions()
    // }
  }
}
</script>
