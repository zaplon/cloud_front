<template>
    <div class="card">
        <div class="card-header">
            Archiwum
        </div>
        <div class="card-body">
            <div>
                <button v-permission="'can_edit_result'" type="button" class="mb-4 btn btn-success" v-b-modal="'resultModal'">Dodaj</button>
                <button :disabled="!deleteEnabled" type="button" v-permission="'can_delete_result'"
                        class="btn btn-danger mb-4" v-b-modal="'modal'">Usuń</button>
            </div>
            <v-server-table ref="table" url="rest/results/" :columns="columns" :options="options">
                <input type="checkbox" slot-scope="props" slot="select" @change="rowSelected(props.row)" v-model="props.row.selected" />
                <button class="btn btn-link" slot="file" @click="showDocument(props.row)" slot-scope="props"><i class="fa fa-file-pdf-o"></i></button>
            </v-server-table>
        </div>
        <b-modal size="lg" id="resultModal" title="Archiwum" @ok="modalOk" ref="resultModal">
            <form-result ref="resultForm"></form-result>
            <div slot="modal-footer" class="w-100">
                <b-btn size="sm" class="float-right" variant="default" @click="modalClose">Zamknij</b-btn>
                <b-btn size="sm" class="float-right mr-2" variant="success" @click="modalOk">Zapisz</b-btn>
            </div>
        </b-modal>
        <b-modal @ok="deleteResults" cancel-title="Zamknij" ref="modal" id="modal" size="md" title="Usuwanie dokumentów">
            <span>Czy jesteś pewien, że chcesz usunąć zaznaczone rekordy?</span>
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
      this.$refs.resultForm.save().then(response => this.$refs.modal.hide())
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
    selectedResults () {
      return this.$refs.table.data.filter((r) => r.selected)
    },
    rowSelected (row) {
      console.log(row.selected)
      if (this.selectedResults().length > 0) { this.deleteEnabled = true } else { this.deleteEnabled = false }
    }
  },
  data () {
    return {
      resultId: null,
      deleteEnabled: false,
      columns: this.$hasPermissions('can_edit_result') ? ['select', 'patient', 'pesel', 'name', 'file']
        : ['patient', 'pesel', 'name', 'file'],
      options: {
        headings: {'select': '', 'patient': 'Pacjent', 'pesel': 'Pesel', 'nazwa': 'Nazwa', 'file': 'Plik'}
      }
    }
  }
}
</script>
