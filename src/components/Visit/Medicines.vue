<template>
    <div>
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
                    <button :disabled="!this.patient.id || !this.prescription.realisationDate" class="btn btn-info">Drukuj</button>
                </div>
            </div>
        </form>
        <input class="form-control mb-4" type="text" v-model="inputValue" placeholder="nazwa lub substancja czynna"/>
        <table class="table table-striped">
            <thead>
            <tr>
                <th>Nazwa</th>
                <th>Skład</th>
                <th>Opakowanie</th>
                <th>Refundacja</th>
                <th>Postać</th>
                <th>Dawka</th>
                <th>Dawkowanie</th>
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

export default {
  name: 'medicines',
  components: {MedicineRow},
  props: {
    patient: Object,
    instance: {
      type: Number,
      default: 0
    },
    data: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      selections: this.data,
      suggestions: [],
      excludes: [],
      inputValue: [],
      prescription: {
        nfz: '',
        realisationDate: new Date(),
        number: false,
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
    save () {
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
    printRecipe () {
      this.save()
      let medicines = []
      console.log(this.$refs)
      this.selections.forEach((s) => { medicines.push(this.$refs[s.id][0].getData()) })
      axios.post('visit/recipe/', {
        medicines: this.selections,
        nfz: this.prescription.nfz,
        permissions: this.prescription.permissions,
        number: this.number,
        patient: this.patient.id,
        realisationDate: this.$moment(this.prescription.realisationDate).format('DD.MM.YY')
      }).then(response => {
        let prescriptionUrl = axios.defaults.baseURL.substr(0, axios.defaults.baseURL.length - 1) + response.data.url
        EventBus.$emit('show-document', prescriptionUrl, 'Recepta')
      })
    },
    add (record) {
      this.selections.push(record)
      record.selected = true
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
      return this.selections
    }
  },
  mounted () {
    this.getSuggestions()
    if (this.instance) {
      axios.get('rest/prescriptions/' + this.instance + '/').then(response => {
        this.selections = response.data.medicines
      })
    }
  }
}
</script>
