<template>
    <div class="card">
        <div class="card-header">{{ label }}
            <div class="card-toolbar">
                <router-link to="edycja"><i class="fa fa-pencil" title="edytuj" aria-hidden="true"></i></router-link>
                <router-link :to="archiveLink"><i class="fa fa-archive" title="archiwum" aria-hidden="true"></i></router-link>
            </div>
        </div>
        <div class="card-body">
            <backend-form :autoload="false" :readonly="true" ref="patientForm" klass="PatientModelForm" module="user_profile.forms"></backend-form>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'patient',
  data () {
    return {
      patientId: 0,
      patient: {},
      label: this.patientId,
      archiveLink: ''
    }
  },
  watch: {
    '$route.params.id' () {
      this.loadData()
    }
  },
  methods: {
    loadData () {
      if (!this.$route.params.id) {
        return
      }
      this.patientId = parseInt(this.$route.params.id)
      this.archiveLink = '/archiwum/' + this.patientId
      axios.get('rest/patients/' + this.patientId + '/').then(response => {
        this.patient = response.data
        this.label = response.data.name_with_pesel
      })
      this.$refs.patientForm.loadHtml(this.patientId)
    }
  },
  mounted () {
    this.loadData()
  }
}
</script>
