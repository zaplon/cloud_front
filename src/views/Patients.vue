<template>
    <div class="card">
        <div class="card-header">
            <h1>Pacjenci</h1>
        </div>
        <div class="card-body">
            <div class="btn-group mb-4" role="group" aria-label="Options">
                <button type="button" class="btn btn-success" v-b-modal="'patientModal'">Dodaj</button>
                <button type="button" class="btn btn-danger" disabled>Usuń</button>
            </div>
            <v-server-table url="rest/patients/" :columns="columns" :options="options"></v-server-table>
        </div>
        <b-modal size="lg" id="patientModal" title="Pacjent" @ok="modalOk" ref="modal">
            <backend-form ref="patientForm" klass="PatientModelForm" module="user_profile.forms" :id="patientId"></backend-form>
        </b-modal>
    </div>
</template>
<script>
export default {
  name: 'patients',
  methods: {
    modalOk () {
      this.$refs.patientForm.handleSubmit(() => this.$refs.modal.hide())
    }
  },
  data () {
    return {
      patientId: null,
      columns: ['first_name', 'last_name', 'pesel'],
      options: {
        headings: {'first_name': 'Imię', 'last_name': 'Nazwisko', 'pesel': 'Pesel'}
      }
    }
  }
}
</script>
