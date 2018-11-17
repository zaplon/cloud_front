<template>
    <div class="card">
        <b-modal ok-title="Tak" cancel-title="Anuluj" size="md" id="confirmModal" title="Potwierdzenie operacji" @ok="deletePatient" ref="confirmModal">
            Czy na pewno chcesz usunąć ten rekord?
        </b-modal>
        <button :v-permission="add_permission" class="btn bottom-right button-add font-lg" @click="addNewRecord">
            <i class="fa fa-plus"></i>
        </button>
        <div class="card-header">
            {{ label }}
        </div>
        <div class="card-body">
            <div style="display: none;">
                <button type="button" :v-permission="'delete_permission'" class="mb-4 btn btn-danger" disabled>Usuń</button>
            </div>
            <v-server-table url="rest/patients/" :columns="columns" :options="options" ref="table">
                <input type="checkbox" class="form-control" slot="select" slot-scope="props" v-permission="'edit_patient'">
                <div slot="actions" slot-scope="props">
                    <button @click="showConfirmModal(props.row)" class="btn btn-danger btn-sm" v-permission="'delete_patient'">usuń</button>
                </div>
                <router-link :to="/pacjenci/ + props.row.id + '/'" slot="first_name" slot-scope="props">{{ props.row.first_name }}</router-link>
            </v-server-table>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'patients',
  methods: {
    modalOk () {
      this.$refs.patientForm.handleSubmit(() => {
        this.$refs.modal.hide()
        this.$refs.table.reload()
      })
    },
    showConfirmModal (patient) {
      this.selectedPatient = patient
      this.$refs.confirmModal.show()
    },
    deletePatient () {
      axios.delete('rest/patients/' + this.selectedPatient.id + '/').then((response) => this.$refs.table.refresh())
    },
    editPatient (patient) {
      this.$refs.patientForm.loadHtml(patient.id).then(() => this.$refs.modal.show())
    },
    addNewPatient () {
      this.$router.push({name: 'NewPatient'})
    }
  },
  data () {
    return {
      patientId: null,
      columns: this.$hasPermissions('delete_patient') ? ['first_name', 'last_name', 'pesel', 'actions']
        : ['first_name', 'last_name', 'pesel'],
      options: {
        headings: {'first_name': 'Imię', 'last_name': 'Nazwisko', 'pesel': 'Pesel', 'select': '', 'actions': ''}
      }
    }
  }
}
</script>
