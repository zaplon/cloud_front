<template>
    <div class="card">
        <div class="card-header">Nowa recepta</div>
        <div class="card-body">
            <form>
                <div class="form-row mb-4 align-items-center">
                    <div class="col-12">
                        <label class="mr-1">Pacjent</label>
                        <autocomplete id="prescriptionPatient" input-class="form-control" @selected="selectPatient"
                                      :source="patientsUrl" style="width: calc(100% - 53px); display: inline-block;" ref="patientAutocomplete"
                                      results-property="results" placeholder="Wyszukaj..." :initialDisplay="autocompletes.patient"
                                      results-display="label">
                        </autocomplete>
                    </div>
                </div>
            </form>
            <medicines ref="medicines" :patient="patient"></medicines>
        </div>
    </div>
</template>
<script>
import Medicines from '@/components/Visit/Medicines'
import axios from 'axios'
import Autocomplete from 'vuejs-auto-complete'
export default {
  name: 'prescription',
  components: {Medicines, Autocomplete},
  methods: {
    selectPatient (obj) {
      this.patient = obj.selectedObject
    }
  },
  computed: {
    autocompletes () {
      return {
        patient: null
      }
    }
  },
  data () {
    return {
      patientsUrl: axios.defaults.baseURL + 'rest/patients/?term=',
      patient: {},
      instance: this.$route.params.id ? parseInt(this.$route.params.id) : 0
    }
  },
  mounted () {
    if (!this.$route.params.id) { return }
    axios.get('rest/prescriptions/' + this.instance + '/').then(response => {
      console.log(response.data)
      this.patient = response.data.patient
      this.$refs.patientAutocomplete.display = this.patient.name_with_pesel
      this.$refs.medicines.loadData(response.data)
    })
  }
}
</script>
