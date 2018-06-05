<template>
    <div class="card">
        <div class="card-header">
            Archiwum
        </div>
        <div class="card-body">
            <div class="mb-4">
                <button type="button" class="btn btn-success" v-b-modal="'resultModal'">Dodaj</button>
                <button type="button" class="btn btn-danger" disabled>Usuń</button>
            </div>
            <v-server-table url="rest/results/" :columns="columns" :options="options">
                <button class="btn btn-link" slot="file" @click="showDocument(props.row)" slot-scope="props"><i class="fa fa-file-pdf-o"></i></button>
            </v-server-table>
        </div>
        <b-modal size="lg" id="resultModal" title="Archiwum" @ok="modalOk" ref="modal">
            <form-result ref="resultForm"></form-result>
            <div slot="modal-footer" class="w-100">
                <b-btn size="sm" class="float-right" variant="default" @click="modalClose">Zamknij</b-btn>
                <b-btn size="sm" class="float-right mr-2" variant="success" @click="modalOk">Zapisz</b-btn>
            </div>
        </b-modal>
    </div>
</template>
<script>
import FormResult from '../components/Forms/Result'
import EventBus from '@/eventBus'

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
      this.$refs.modal.hide()
    }
  },
  data () {
    return {
      resultId: null,
      columns: ['patient', 'pesel', 'name', 'file'],
      options: {
        headings: {'patient': 'Pacjent', 'pesel': 'Pesel', 'nazwa': 'Nazwa', 'file': 'Plik'}
      }
    }
  }
}
</script>
