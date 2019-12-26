<template>
    <div>
        <b-tabs content-class="mt-3">
            <b-tab v-for="(prescription, index) in prescriptions" :key="prescription.id" :active="index == 0">
                <medicines :data="prescription" :patient="patient" :ref="'p-' + index"
                :visit-id="visitId" :patient-prescriptions="patientPrescriptions"/>
                <template slot="title">
                    <span>Recepta {{index + 1}}</span>
                    <i class="fa fa-minus-square text-danger ml-1" @click="remove(index, prescription.id)"></i>
                </template>
            </b-tab>

            <template slot="tabs-end">
                <b-nav-item @click.prevent="add" href="#">
                    <i class="fa fa-plus text-success"></i>
                </b-nav-item>
            </template>

            <template slot="empty">
                <div class="text-center text-muted">
                    <span>Dodaj recepty do wizyty za pomocą przycisku</span>
                    <i class="fa fa-plus"></i> <span>powyżej.</span>
                </div>
            </template>
        </b-tabs>
    </div>
</template>
<script>
import axios from 'axios'
import Medicines from '@/components/Visit/Medicines'
export default {
  name: 'prescriptions',
  components: {
    Medicines
  },
  props: {
    visitId: {
      type: Number,
      required: true
    },
    patient: {
      type: Object,
      required: true
    },
    data: {
      type: Object,
      required: false,
      default: () => {}
    }
  },
  data () {
    return {
      prescriptions: [{id: 0}],
      patientPrescriptions: []
    }
  },
  methods: {
    add () {
      this.prescriptions.push({})
    },
    remove (index, id) {
      if (id) {
        axios.delete('/rest/prescriptions/' + id + '/').then(response => {
          this.prescriptions.splice(index, 1)
        })
      } else {
        this.prescriptions.splice(index, 1)
      }
    },
    // getData () {
    //   var data = []
    //   for (let r in this.$refs) {
    //     if (r.startsWith('p-')) {
    //       data.push(this.$refs[r][0].getData())
    //     }
    //   }
    //   return data
    // },
    save () {
      for (let r in this.$refs) {
        if (r.startsWith('p-')) {
          this.$refs[r][0].savePrescription(true)
        }
      }
    },
    getPatientPrescriptions () {
      axios.get('rest/prescriptions/', {params: {patient_id: this.patient.id, only_filled: 1}}).then((response) => {
        if (response.data.results.length > 0) {
          this.patientPrescriptions = response.data.results
        }
      })
    }
  },
  mounted () {
    if (this.data) {
      console.log('data', this.data)
      if (Array.isArray(this.data)) {
        this.prescriptions = this.data
      } else {
        this.prescriptions = [this.data]
      }
    } else {
      axios.get('/rest/prescriptions/', {params: {visit_id: this.visitId, full: 1, with_tmp: 1}}).then(response => {
        if (response.data.results.length > 0) {
          this.prescriptions = response.data.results
        }
      })
    }
    this.getPatientPrescriptions()
  }
}
</script>
