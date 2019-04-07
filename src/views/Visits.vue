<visit>
    <div class="card">
        <b-modal ok-title="Tak" cancel-title="Anuluj" size="md" id="confirmModal" title="Potwierdzenie operacji" @ok="deleteVisit" ref="confirmModal">
            Czy na pewno chcesz usunąć tą wizytę?
        </b-modal>
        <div class="card-header">
            Szablony
        </div>
        <div class="card-body">
            <v-server-table ref="table" url="rest/visits/" :columns="columns" :options="options">
                <a href="#" slot="name" @click.prevent="editVisit(props.row)" slot-scope="props">{{ props.row.name }}</a>
                <div slot="actions" slot-scope="props">
                    <button @click="deleteVisit(props.row)" class="btn btn-danger btn-sm">Usuń</button>
                </div>
            </v-server-table>
        </div>
        <b-modal size="md" id="visitModal" :title="visit.title" @ok="modalOk" @cancel="modalCancel" ref="visitModal">
            <backend-form ref="visitForm" klass="VisitForm" module="visit.forms" :pk="visit.id" />
            <div slot="modal-footer" class="w-100">
                <b-btn size="sm" class="float-right" variant="primary" @click="modalCancel">Anuluj</b-btn>
                <b-btn size="sm" class="float-right mr-2" variant="default" @click="modalOk">Zapisz</b-btn>
            </div>
        </b-modal>
        <button class="btn bottom-right button-add font-lg" @click="addVisit"><i class="fa fa-plus"></i></button>
    </div>
</visit>
<script>
import axios from 'axios'
export default {
  name: 'visits',
  methods: {
    showConfirmModal (visit) {
      this.selectedVisit = visit
      this.$refs.confirmModal.show()
    },
    modalCancel () {
      this.$refs.visitModal.hide()
    },
    modalOk () {
      this.$refs.visitForm.handleSubmit(() => {
        this.$refs.table.refresh()
        this.$refs.visitModal.hide()
      })
    },
    addVisit () {
      this.visit.title = 'Nowy szablon'
      if (this.visit.id) {
        this.visit.id = null
        this.$refs.visitForm.loadHtml().then(response => { this.$refs.visitbModal.show() })
      } else { this.$refs.visitModal.show() }
    },
    editVisit (visit) {
      this.visit.title = 'Edycja szablonu'
      this.visit.id = visit.id
      this.$refs.visitForm.loadHtml(visit.id).then(response => { this.$refs.visitModal.show() })
      this.$refs.visitModal.show()
    },
    deleteVisit () {
      axios.delete('rest/visits/' + this.selectedVisit.id + '/').then(response => { this.$refs.table.refresh() })
    }
  },
  data () {
    return {
      visit: {title: '', id: null},
      columns: ['patient', 'datetime', 'status', 'actions'],
      options: {
        orderBy: {column: 'datetime'},
        headings: {'name': 'Nazwa', 'datetime': 'Data', 'text': 'Treść', 'tab_name': 'Zakładka', 'actions': ''}
      }
    }
  }
}
</script>
