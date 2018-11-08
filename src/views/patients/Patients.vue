<template>
    <div class="card">
        <div class="card-header">
            Pacjenci
        </div>
        <div class="card-body">
            <div>
                <button type="button" v-permission="'can_add_patient'" class="mb-4 btn btn-success" v-b-modal="'patientModal'">Dodaj</button>
                <button type="button" v-permission="'can_delete_patient'" class="mb-4 btn btn-danger" disabled>Usuń</button>
            </div>
            <v-server-table url="rest/patients/" :columns="columns" :options="options" ref="table">
                <input type="checkbox" class="form-control" slot="select" slot-scope="props" v-permission="'can_edit_patients'">
                <router-link :to="/pacjenci/ + props.row.id + '/'" slot="first_name" slot-scope="props">{{ props.row.first_name }}</router-link>
            </v-server-table>
        </div>
    </div>
</template>
<script>
export default {
  name: 'patients',
  methods: {
    modalOk () {
      this.$refs.patientForm.handleSubmit(() => {
        this.$refs.modal.hide()
        this.$refs.table.reload()
      })
    },
    editPatient (patient) {
      this.$refs.patientForm.loadHtml(patient.id).then(() => this.$refs.modal.show())
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
