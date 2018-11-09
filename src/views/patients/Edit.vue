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
            <backend-form :autoload="false" ref="patientForm" klass="PatientModelForm" module="user_profile.forms"></backend-form>
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
export default {
  name: 'patientEdit',
  data () {
    return {
      patientId: this.$route.params.id ? parseInt(this.$route.params.id) : 0,
      patient: {},
      label: this.patientId
    }
  },
  methods: {
    cancel () {
      this.$router.push('/pacjenci/' + this.patientId)
    },
    savePatient () {
      this.$refs.patientForm.save()
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
    })
    this.$refs.patientForm.loadHtml(this.patientId)
  }
}
</script>
