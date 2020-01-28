<template>
    <div class="card">
        <b-modal ok-title="Tak" cancel-title="Anuluj" size="md" id="confirmModal" title="Potwierdzenie operacji" @ok="deletePatient" ref="confirmModal">
            Czy na pewno chcesz usunąć tego pacjenta?
        </b-modal>
        <div class="card-header">{{ label }}
            <div class="card-toolbar">

            </div>
        </div>
        <div class="card-body">
            <generic-form ref="patientForm" :fields="patientFormFields"></generic-form>
        </div>
        <div class="card-footer">
            <button class="btn btn-danger pull-left" @click="showConfirmDeleteModal">Usuń</button>
            <div class="pull-right">
                <button @click="savePatient" class="btn btn-primary mr-1">Zapisz</button>
                <button class="btn btn-default" @click="cancel">Anuluj</button>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
import fields from '@/components/Forms/_forms_fields.js'
import GenericForm from '@/components/Forms/GenericForm'
export default {
  name: 'patientEdit',
  components: {GenericForm},
  data () {
    return {
      patientId: this.$route.params.id ? parseInt(this.$route.params.id) : 0,
      patient: {},
      label: this.patientId,
      patientFormFields: fields.patientBig
    }
  },
  methods: {
    cancel () {
      this.$router.push('/pacjenci/' + this.patientId + '/')
    },
    savePatient () {
      var data = this.$refs.patientForm.getData()
      var promise = null
      if (this.patientId) {
        promise = axios.patch('/rest/patients/' + this.patientId + '/', data)
      } else {
        promise = axios.post('/rest/patients/', data)
      }
      promise.then(response => {
        this.$router.push('/pacjenci/')
      }).catch(error => {
        this.$refs.patientForm.errors = error.response.data
      })
    },
    showConfirmDeleteModal () {
      this.$refs.confirmModal.show()
    },
    deletePatient () {
      axios.delete('rest/patients/' + this.patientId + '/').then(response => {
        this.$router.push('/pacjenci/')
      })
    }
  },
  mounted () {
    if (!this.$route.params.id) {
      return
    }
    axios.get('rest/patients/' + this.patientId + '/').then(response => {
      this.patient = response.data
      this.label = response.data.name_with_pesel
      this.$refs.patientForm.setData(this.patient)
    })
  }
}
</script>
