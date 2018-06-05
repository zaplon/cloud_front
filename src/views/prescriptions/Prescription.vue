<template>
    <div class="card">
        <div class="card-header">Nowa recepta</div>
        <div class="card-body">
            <form>
                <div class="form-row mb-4">
                    <div class="col-2">
                        <label>Pacjent</label>
                    </div>
                    <div class="col-10">
                        <autocomplete id="prescriptionPatient" input-class="form-control" @selected="selectPatient"
                                      :source="patientsUrl"
                                      results-property="results" placeholder="Wyszukaj..." :initialDisplay="autocompletes.patient"
                                      results-display="label">
                        </autocomplete>
                    </div>
                </div>
            </form>
            <medicines :patient="patient" number="number"></medicines>
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
      number: '123'
    }
  }
}
</script>
