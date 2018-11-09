<template>
    <div class="card">
        <div class="card-header">{{ label }}
            <div class="card-toolbar">
                <router-link to="edycja"><i class="fa fa-pencil" title="edytuj" aria-hidden="true"></i></router-link>
                <router-link to="/archiwum"><i class="fa fa-archive" title="archiwum" aria-hidden="true"></i></router-link>
            </div>
        </div>
        <div class="card-body">
            <backend-form :autoload="false" :readonly="false" ref="patientForm" klass="PatientModelForm" module="user_profile.forms"></backend-form>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'patient',
  data () {
    return {
      patientId: this.$route.params.id ? parseInt(this.$route.params.id) : 0,
      patient: {},
      label: this.patientId
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
