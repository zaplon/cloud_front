<template>
    <div class="card">
        <div class="card-header">
            Pacjenci
        </div>
        <div class="card-body">
            <div class="mb-4">
                <button type="button" class="btn btn-success" v-b-modal="'patientModal'">Dodaj</button>
                <button type="button" class="btn btn-danger" disabled>Usuń</button>
            </div>
            <v-server-table url="rest/patients/" :columns="columns" :options="options"></v-server-table>
        </div>
        <b-modal size="lg" id="patientModal" title="Pacjent" @ok="modalOk" ref="modal">
            <backend-form ref="patientForm" klass="PatientModelForm" module="user_profile.forms" :pk="patientId"></backend-form>
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
