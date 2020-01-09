<template>
    <div>
        <b-modal :static="true" ok-title="Zapisz" cancel-title="Anuluj" size="md" id="addMedicineModal" title="Nowy lek"
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
        <b-modal ok-title="Ok" size="md" title="Recepta została zaakceptowana"
                 ref="medicineAddedToQueueModal" ok-only>
            <p>Recepta została przesłana, jednak ze względu na obciążenie serwera e-recept, jej zapis został
            zakolejkowany. Pacjent wkrótce znajdzie elektroniczną receptę na swoim internetowym koncie pacjenta.</p>
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
                    <span>Oddział NFZ</span><br/>
                    <input style="width:160px;" class="form-control" type="text" id="nfz-number" v-model="prescription.nfz"
                           placeholder="Oddział NFZ" maxlength="2">
                </div>
                <div class="col-auto mt-1">
                    <span>Uprawnienia dodatkowe</span><br/>
                    <input style="width:200px;" class="form-control" type="text" id="permissions" v-model="prescription.permissions"
                           placeholder="Uprawnienia dodatkowe">
                </div>
                <div class="col-auto mt-1">
                    <span>Data realizacji od</span><br/>
                    <v-date-picker mode='single' v-model='prescription.realisationDate'>
                        <input style="width:150px;" placeholder="Data realizacji" :value='props.inputValue' type="text" class="form-control" slot-scope="props">
                    </v-date-picker>
                </div>
                <div class="col-auto mt-1">
                    <br/>
                    <div class="form-check">
                        <label class="form-check-label">
                            <input title="Zamieść numer recepty na wydruku" class="form-check-input"
                                   type="checkbox" v-model="useNumber"
                                   :disabled="this.$store.state.user.doctor.available_prescriptions == 0">
                            Z numerem
                        </label>
                    </div>
                </div>
                <div class="col-auto mt-1">
                    <br/>
                    <button :disabled="!this.patient.id || !this.prescription.realisationDate || !this.prescription.permissions || !this.prescription.nfz" class="btn btn-info" @click="printRecipe">Drukuj</button>
                </div>
                <div class="col-auto mt-1">
                    <br/>
                    <button @click="saveExternal" :disabled="this.sending || !this.patient.id || !this.prescription.realisationDate || !this.prescription.permissions || !this.prescription.nfz" class="btn btn-info">
                        <span v-if="!sending">Wyślij e-receptę</span>
                        <span v-else>Wysyłam...</span>
                    </button>
                </div>
            </div>
        </div>
        <div class="row mb-2 mt-1 form-row">
        </div>
        <div class="row mb-2 form-row" v-if="medicinesCount < 5">
            <div class="col-auto">
                <autocomplete style="width:370px;" id="medicineAutocomplete" input-class="form-control" @selected="selectMedicine"
                              :source="medicinesUrl" placeholder="Nazwa lub substancja czynna..."
                              :request-headers="authHeaders"
                              ref="medicinesAutocomplete"
                              results-property="results"
                              :results-display="formattedDisplay">
                </autocomplete>
            </div>
            <div class="col-auto" v-permission="'add_medicine'">
                <button class="btn btn-success" @click="showAddMedicineModal"><i class="fa fa-plus"></i></button>
            </div>
        </div>
        <div class="row mb-2" v-if="prescription.external_code">
            <div class="col-md-12">
                <span class="mr-1">Kod e-recepty:</span><strong>{{ prescriptionShortCode }}</strong>
            </div>
        </div>
        <div class="row mb-2" v-if="medicinesCount >= 5">
            <div class="col-md-12">
                <span class="text-muted">Na recepcie znajduje się maksymalna ilość 5 leków. Proszę dodać kolejną receptę.</span>
            </div>
        </div>
        <div class="row mb-4">
        </div>
        <medicine-row :ref="selection.id" v-on:remove-record="remove" :medicine="selection" klass="table-info"
                      v-for="selection in selections" :key="selection.id"></medicine-row>
        <PdfDocument ref="prescriptionModal">
            <div slot="actions" class="float-right mr-2">
                <b-btn size="sm" variant="success" @click="saveExternal">
                    Wyślij e-receptę
                </b-btn>
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
    visitId: {
      type: Number,
      required: true
    },
    instance: {
      type: Number,
      default: 0
    },
    patientPrescriptions: {
      type: Array,
      default: () => []
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
      useNumber: false,
      sending: false,
      prescription: {
        id: null,
        nfz: this.$store.state.user.system_settings.nfz_department,
        realisationDate: new Date(),
        permissions: 'X',
        url: '',
        external_id: null,
        external_code: null,
        tmp: true
      },
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
      this.$refs.medicinesAutocomplete.clear()
    },
    deserializeMedicine (data) {
      data.name = data.medicine.parent.name
      data.size = data.medicine.id
      data.dose = data.medicine.parent.dose
      this.$set(data, 'children', [{id: data.medicine.id, size: data.medicine.size}])
      data.child = {id: data.medicine.id, availability_cat: data.medicine.availability_cat}
      data.loadChildren = true
      data.loadRefundations = true
      data.form = data.medicine.parent.form
      data.id = data.medicine.parent.id
      data.number = data.number
      data.external_id = data.external_id
      if (data.refundation) {
        if (data.refundation !== '100%') {
          this.$set(data, 'refundations', [{id: 0, to_pay: data.refundation}])
        }
      }
      return data
    },
    loadPrescription () {
      axios.get('rest/prescriptions/' + this.lastPrescriptionSelected + '/').then((response) => {
        this.deserializePrescription(response.data)
      })
    },
    showAddMedicineModal () {
      this.$refs.addMedicineModal.show()
    },
    addMedicine (evt) {
      evt.preventDefault()
      this.$refs.medicineForm.save(() => { this.$refs.addMedicineModal.hide() })
    },
    deserializePrescription (data) {
      let deserializedMedicines = []
      data.medicines.forEach((medicine) => {
        deserializedMedicines.push(this.deserializeMedicine(medicine))
        var matchedIndex = this.suggestions.findIndex((sugg) => sugg.id === medicine.medicine.parent.id)
        if (matchedIndex) {
          this.suggestions.splice(matchedIndex, 1)
        }
      })
      this.selections = deserializedMedicines
    },
    serializePrescription () {
      let medicines = []
      this.selections.forEach((s) => {
        medicines.push({medicine_id: s.child.id,
          dosage: s.dosage,
          amount: s.amount,
          number: s.number,
          external_id: s.external_id,
          notes: s.notes,
          refundation: s.refundation ? s.refundation : null})
      })
      return {
        id: this.prescription.id,
        patient: this.patient.id,
        doctor: this.$store.state.user.doctor.id,
        medicines: medicines,
        nfz: this.prescription.nfz,
        realisation_date: this.$moment(this.prescription.realisationDate).format('YYYY-MM-DD'),
        permissions: this.prescription.permissions,
        external_id: this.external_id,
        external_code: this.external_code,
        date: this.prescription.realisationDate,
        visit: this.visitId,
        number: isNaN(this.prescription.number) ? null : this.prescription.number
      }
    },
    savePrescription (tmp) {
      var data = this.serializePrescription()
      if (tmp && this.prescription.tmp) {
        data.tmp = true
      } else {
        data.tmp = false
      }
      if (this.prescription.id) {
        return axios.put('rest/prescriptions/' + this.prescription.id + '/', data)
      } else {
        return axios.post('rest/prescriptions/', data).then(response => {
          this.prescription.id = response.data.id
        })
      }
    },
    validatePrescription () {
      var errors = false
      this.selections.forEach((s, index) => {
        if (!this.$refs[s.id][0].validate()) {
          this.errors = true
        }
      })
      return !errors
    },
    printRecipe () {
      if (!this.validatePrescription()) {
        return
      }
      var data = this.serializePrescription()
      data.use_number = this.useNumber
      var promise = axios.post('rest/prescriptions/print_internal/', data)
      promise.then(response => {
        let prescriptionUrl = axios.defaults.baseURL.substr(0, axios.defaults.baseURL.length - 1) + response.data.file
        this.$refs.prescriptionModal.showDocument(prescriptionUrl, 'Recepta', this.patient.id)
      })
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
      })
    },
    getData () {
      return { prescription: this.prescription, selections: this.selections }
    },
    loadData (data) {
      if (data.prescription) {
        this.prescription = data.prescription
      } else {
        this.prescription = data
        this.prescription.realisationDate = new Date()
        if (data.realisation_date) {
          this.prescription.realisationDate = this.$moment(data.realisation_date).toDate()
        }
      }
      if (this.prescription.realisationDate) {
        this.prescription.realisationDate = this.$moment(this.prescription.realisationDate).toDate()
      }
      if (data.selections) {
        this.selections = data.selections
      } else if (data.medicines) {
        this.deserializePrescription(data)
      }
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
    patientDataForPrescriptionFilled () {
      var p = this.patient
      return p.pesel && p.gender && p.first_name && p.last_name
    },
    saveExternal () {
      if (!this.patientDataForPrescriptionFilled()) {
        this.$emit('editPatient')
        return
      }
      if (!this.validatePrescription()) {
        return
      }
      var data = this.serializePrescription()
      data.tmp = false
      data.id = null
      this.sending = true
      axios.post('rest/prescriptions/save_in_p1/', data).then(response => {
        this.sending = false
        if (response.data.idZadania) {
          this.$refs.medicineAddedToQueueModal.show()
          return
        }
        if (!this.prescription.external_code) {
          this.loadData(response.data)
        } else {
          this.$emit('addPrescription', response.data)
        }
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
        this.sending = false
        console.log(error.response.data)
        this.$notify({
          group: 'nots',
          title: 'Wystąpił problem podczas przesyłania recepty',
          text: error.response ? error.response.data : '',
          type: 'error'
        })
      })
    },
    formattedDisplay (result) {
      if (result.dose && result.form) {
        return result.name + ' [' + result.form + ', ' + result.dose + ']'
      } else if (result.dose) {
        return result.name + '[' + result.dose + ']'
      } else if (result.form) {
        return result.name + '[' + result.form + ']'
      } else {
        return result.name
      }
    }
  },
  computed: {
    authHeaders () {
      return {
        'Authorization': 'Token ' + localStorage.token
      }
    },
    medicinesCount: function () {
      return this.selections.length
    },
    prescriptionShortCode () {
      return this.prescription.external_code.substring(0, 4)
    }
  },
  mounted () {
    if (this.data && (this.data.nfz || this.data.prescription)) {
      this.loadData(this.data)
    }
    this.getSuggestions()
  }
}
</script>
