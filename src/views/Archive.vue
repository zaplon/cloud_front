<template>
    <div class="card">
        <button v-b-modal.resultModal v-permission="'add_result'" class="btn bottom-right button-add font-lg"><i class="fa fa-plus"></i></button>
        <div class="card-header">
            Archiwum
        </div>
        <div class="card-body">
            <div>
                <button style="display: none;" type="button" v-permission="'delete_result'"
                        class="btn btn-danger mb-4" v-b-modal="'modal'">Usuń</button>
            </div>
            <div v-if="patientId" class="mb-4">
                {{ patient.name_with_pesel }}
            </div>
            <v-server-table ref="table" url="rest/results/" :columns="columns" :options="options">
                <a href="#" slot="name" @click.prevent="editResult(props.row)" slot-scope="props">{{ props.row.name }}</a>
                <div>
                    <button v-b-modal="'confirmDeleteModal'" class="btn btn-danger btn-sm">usuń</button>
                </div>
                <input type="checkbox" slot-scope="props" slot="select" @change="rowSelected(props.row)" v-model="props.row.selected" />
                <button v-permission="''" class="btn btn-sm btn-danger" slot-scope="props" slot="actions" @click="showDeleteModal(props.row)">usuń</button>
                <span slot="uploaded" slot-scope="props">{{props.row.uploaded | formatDate('Y-MM-DD HH:mm')}}</span>
                <button class="btn btn-link" slot="file" @click="showDocument(props.row)" slot-scope="props"><i class="fa fa-file-pdf-o"></i></button>
            </v-server-table>
        </div>
        <b-modal :static="true" size="lg" id="resultModal" title="Archiwum" @ok="modalOk" ref="resultModal" @hidden="$refs.resultForm.reset()">
            <form-result ref="resultForm"></form-result>
            <div slot="modal-footer" class="w-100">
                <b-btn size="sm" class="float-right" variant="default" @click="modalClose">Zamknij</b-btn>
                <b-btn size="sm" class="float-right mr-2" variant="primary" @click="modalOk">Zapisz</b-btn>
            </div>
        </b-modal>
        <b-modal @ok="deleteResults" cancel-title="Zamknij" ref="modal" id="modal" size="md" title="Usuwanie dokumentów">
            <span>Czy jesteś pewien, że chcesz usunąć zaznaczone rekordy?</span>
        </b-modal>
        <b-modal @ok="deleteResult" cancel-title="Zamknij" ref="deleteModal" id="delete-modal" size="md" title="Usuwanie dokumentu">
            <span>Czy jesteś pewien, że chcesz usunąć ten rekord?</span>
        </b-modal>
    </div>
</template>
<script>
import FormResult from '../components/Forms/Result'
import EventBus from '@/eventBus'
import axios from 'axios'

export default {
  name: 'archive',
  components: {FormResult},
  methods: {
    showDocument (document) {
      EventBus.$emit('show-document', document.file, document.name)
    },
    modalOk () {
      this.$refs.resultForm.save().then(response => {
        this.$refs.resultModal.hide()
        this.$refs.table.refresh()
      })
    },
    modalClose () {
      this.$refs.resultModal.hide()
    },
    deleteResults () {
      this.selectedResults().forEach((r) => {
        axios.delete('rest/results/' + r.id + '/').then((response) => {
        })
      })
    },
    showDeleteModal (r) {
      this.selectedResult = r
      this.$refs.deleteModal.show()
    },
    editResult (result) {
      this.$refs.resultForm.form = result
      this.$refs.resultForm.setPatientLabel(result.patient)
      this.$refs.resultForm.setSpecializationLabel(result.specialization)
      this.$refs.resultModal.show()
    },
    deleteResult (r) {
      axios.delete('rest/results/' + this.selectedResult.id + '/').then((response) => {
        this.$refs.table.refresh()
      })
    },
    selectedResults () {
      return this.$refs.table.data.filter((r) => r.selected)
    },
    rowSelected (row) {
      if (this.selectedResults().length > 0) { this.deleteEnabled = true } else { this.deleteEnabled = false }
    },
    fetchData () {
      this.patient = null
      if (this.patientId) {
        axios.get('rest/patients/' + this.patientId + '/').then(response => { this.patient = response.data })
      }
    }
  },
  data () {
    return {
      patientLabel: '',
      patient: {},
      specializationLabel: '',
      patientId: this.$route.params.id ? parseInt(this.$route.params.id) : 0,
      resultId: null,
      columns: this.$hasPermissions('delete_result') ? ['name', 'patient', 'pesel', 'file', 'uploaded', 'actions']
        : ['name', 'patient', 'pesel', 'file', 'uploaded'],
      options: {
        // headings: {'select': '', 'patient': 'Pacjent', 'pesel': 'Pesel', 'nazwa': 'Nazwa', 'file': 'Plik'}
        headings: {'patient': 'Pacjent', 'pesel': 'Pesel', 'name': 'Nazwa', 'file': 'Plik', 'uploaded': 'Data utworzenia', 'actions': ''},
        params: {patient: this.$route.params.id},
        sortable: ['patient', 'pesel', 'name', 'uploaded']
      }
    }
  },
  watch: {
    // call again the method if the route changes
    '$route': 'fetchData'
  },
  created () {
    this.fetchData()
  }
}
</script>
