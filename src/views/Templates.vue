<template>
    <div class="card">
        <b-modal ok-title="Tak" cancel-title="Anuluj" size="md" id="confirmModal" title="Potwierdzenie operacji" @ok="deleteTemplate" ref="confirmModal">
            Czy na pewno chcesz usunąć ten rekord?
        </b-modal>
        <div class="card-header">
            Szablony
        </div>
        <div class="card-body">
            <v-server-table ref="table" url="rest/templates/" :columns="columns" :options="options">
                <a href="#" slot="name" @click.prevent="editTemplate(props.row)" slot-scope="props">{{ props.row.name }}</a>
                <div slot="actions" slot-scope="props">
                    <button @click="showConfirmModal(props.row)" class="btn btn-danger btn-sm">Usuń</button>
                </div>
            </v-server-table>
        </div>
        <b-modal size="md" id="templateModal" :title="template.title" @ok="modalOk" @cancel="modalCancel" ref="templateModal">
            <backend-form ref="templateForm" klass="TemplateForm" module="visit.forms" :pk="template.id" />
            <div slot="modal-footer" class="w-100">
                <b-btn size="sm" class="float-right" variant="primary" @click="modalCancel">Anuluj</b-btn>
                <b-btn size="sm" class="float-right mr-2" variant="default" @click="modalOk">Zapisz</b-btn>
            </div>
        </b-modal>
        <button class="btn bottom-right button-add font-lg" @click="addTemplate"><i class="fa fa-plus"></i></button>
    </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'templates',
  methods: {
    showConfirmModal (template) {
      this.selectedTemplate = template
      this.$refs.confirmModal.show()
    },
    modalCancel () {
      this.$refs.templateModal.hide()
    },
    modalOk () {
      this.$refs.templateForm.handleSubmit(() => {
        this.$refs.table.refresh()
        this.$refs.templateModal.hide()
      })
    },
    addTemplate () {
      this.template.title = 'Nowy szablon'
      if (this.template.id) {
        this.template.id = null
        this.$refs.templateForm.loadHtml().then(response => { this.$refs.templatebModal.show() })
      } else { this.$refs.templateModal.show() }
    },
    editTemplate (template) {
      this.template.title = 'Edycja szablonu'
      this.template.id = template.id
      this.$refs.templateForm.loadHtml(template.id).then(response => { this.$refs.templateModal.show() })
      this.$refs.templateModal.show()
    },
    deleteTemplate () {
      axios.delete('rest/templates/' + this.selectedTemplate.id + '/').then(response => { this.$refs.table.refresh() })
    }
  },
  data () {
    return {
      template: {title: '', id: null},
      columns: ['name', 'text', 'tab_name', 'actions'],
      options: {
        headings: {'name': 'Nazwa', 'text': 'Treść', 'tab_name': 'Zakładka', 'actions': ''},
        sortable: ['name', 'text', 'tab_name']
      }
    }
  }
}
</script>
