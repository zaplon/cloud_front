<template>
    <div class="card">
        <div class="card-header">
            Pacjenci
        </div>
        <div class="card-body">
            <div>
                <button type="button" v-permission="can_add_patient" class="mb-4 btn btn-success" v-b-modal="'patientModal'">Dodaj</button>
                <button type="button" v-permission="can_delete_patient" class="mb-4 btn btn-danger" disabled>Usuń</button>
            </div>
            <v-server-table url="rest/patients/" :columns="columns" :options="options">
                <input type="checkbox" class="form-control" slot="select" slot-scope="props" v-permission="'can_edit_patients'">
            </v-server-table>
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
      columns: this.$hasPermissions('can_edit_patients') ? ['select', 'first_name', 'last_name', 'pesel']
        : ['first_name', 'last_name', 'pesel'],
      options: {
        headings: {'first_name': 'Imię', 'last_name': 'Nazwisko', 'pesel': 'Pesel', 'select': ''}
      }
    }
  }
}
</script>
