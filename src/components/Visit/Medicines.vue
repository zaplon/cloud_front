<template>
    <div>
        <b-modal ok-title="Zapisz" cancel-title="Anuluj" size="md" id="addMedicineModal" title="Nowy lek"
                 @ok="addMedicine" ref="addMedicineModal">
            <medicine ref="medicineForm"></medicine>
        </b-modal>
        <form @submit.prevent="printRecipe" class="mb-2">
            <div class="form-row align-items-center">
                <div class="col-auto">
                    <input class="form-control" type="number" id="nfz-number" v-model="prescription.nfz"
                           placeholder="Oddział NFZ">
                </div>
                <div class="col-auto">
                    <input class="form-control" type="text" id="permissions" v-model="prescription.permissions"
                           placeholder="Uprawnienia dodatkowe">
                </div>
                <div class="col-auto">
                    <v-date-picker mode='single' v-model='prescription.realisationDate'>
                        <input placeholder="Data realizacji" :value='props.inputValue' type="text" class="form-control" slot-scope="props">
                    </v-date-picker>
                </div>
                <div class="col-auto">
                    <div class="form-check">
                        <label class="form-check-label">
                            <input title="Zamieść numer recepty na wydruku" class="form-check-input"
                                   type="checkbox" v-model="prescription.number"
                                   :disabled="this.$store.state.user.doctor.available_prescriptions == 0">
                            Z numerem
                        </label>
                    </div>
                </div>
                <div class="col-auto">
                    <button :disabled="!this.patient.id || !this.prescription.realisationDate || !this.prescription.permissions || !this.prescription.nfz" class="btn btn-info">Drukuj</button>
                </div>
            </div>
        </form>
        <div class="row mb-4">
            <div class="col-6">
                <input class="form-control" type="text" v-model="inputValue" placeholder="nazwa lub substancja czynna"/>
            </div>
            <div class="col-auto" v-permission="'add_medicine'">
                <button class="btn btn-success" @click="showAddMedicineModal"><i class="fa fa-plus"></i></button>
            </div>
        </div>

        <table class="table table-striped table-sm">
            <thead>
            <tr>
                <th>Nazwa</th>
                <th>Opakowanie</th>
                <th>Refundacja</th>
                <th>Postać</th>
                <th>Dawka</th>
                <th>Ilość</th>
                <th>Dawkowanie</th>
                <th>Uwagi</th>
                <th>Osobna recepta</th>
                <th></th>
            </tr>
            </thead>
            <tbody>
            <medicine-row :ref="selection.id" v-on:remove-record="remove" :medicine="selection" klass="table-info"
                          v-for="selection in selections" :key="selection.id"></medicine-row>
            <medicine-row v-on:add-record="add" :medicine="suggestion" v-for="suggestion in suggestions" to-add
                          :key="suggestion.id" v-if="!suggestion.selected"></medicine-row>
            <tr v-if="suggestions.length == 0">
                <td colspan="8" class="text-center"><span class="text-muted">Brak wyników</span></td>
            </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
import axios from 'axios'
import _ from 'lodash'
import EventBus from '@/eventBus'
import MedicineRow from './MedicineRow'
import Medicine from '@/components/Forms/Medicine'

export default {
  name: 'medicines',
  components: {Medicine, MedicineRow},
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
      selections: [],
      suggestions: [],
      excludes: [],
      inputValue: [],
      prescription: {
        nfz: '',
        realisationDate: new Date(),
        number: '7',
        permissions: 'X',
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
    showAddMedicineModal () {
      this.$refs.addMedicineModal.show()
    },
    addMedicine (evt) {
      evt.preventDefault()
      this.$refs.medicineForm.save(() => { this.$refs.addMedicineModal.hide() })
    },
    save2 () {
      let medicines = []
      this.selections.forEach((s) => {
        medicines.push({medicine: s.child.id,
          dosage: s.dosage,
          refundation: parseInt(s.refundation) ? parseInt(s.refundation) : null})
      })
      axios.post('rest/prescriptions/', { patient: this.patient.id,
        doctor: this.$store.state.user.doctor.id,
        medicines: medicines,
        nfz: this.prescription.nfz,
        permissions: this.prescription.permissions,
        date: this.prescription.realisationDate})
    },
    validatePrescription () {
      this.selections.forEach((s, index) => {
        console.log(s)
        if (!s.dosage) { this.$refs[s.id][0].errors['dosage'] = 1 } else { delete this.$refs[s.id][0].errors['dosage'] }
      })
    },
    printRecipe () {
      let medicines = []
      console.log(this.$refs)
      this.validatePrescription()
      this.selections.forEach((s) => { medicines.push(this.$refs[s.id][0].getData()) })
      axios.post('visit/recipe/', {
        medicines: this.selections,
        system_settings: this.$store.state.user.system_settings,
        nfz: this.prescription.nfz,
        permissions: this.prescription.permissions,
        number: this.prescription.number,
        patient: this.patient.id,
        realisationDate: this.$moment(this.prescription.realisationDate).format('DD.MM.YYYY')
      }).then(response => {
        let prescriptionUrl = axios.defaults.baseURL.substr(0, axios.defaults.baseURL.length - 1) + response.data.url
        EventBus.$emit('show-document', prescriptionUrl, 'Recepta')
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
        console.log(this.suggestions)
      })
    },
    getData () {
      return { prescription: this.prescription, selections: this.selections }
    },
    loadData (data) {
      this.prescription = data.prescription
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
    }
  },
  mounted () {
    if (this.data) { this.loadData(this.data) }
    this.getSuggestions()
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
