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
            <v-server-table url="rest/results/" :columns="columns" :options="options"></v-server-table>
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
export default {
  name: 'archive',
  components: {FormResult},
  methods: {
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
      columns: ['patient_name', 'pesel', 'name'],
      options: {
        headings: {'patient_name': 'Pacjent', 'pesel': 'Pesel', 'nazwa': 'Nazwa'}
      }
    }
  }
}
</script>
