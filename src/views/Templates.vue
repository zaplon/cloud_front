<template>
    <div class="card">
        <div class="card-header">
            Szablony
        </div>
        <div class="card-body">
            <div class="btn-group mb-4">
                <button class="btn btn-success" @click="addTemplate">Dodaj</button>
            </div>
            <v-server-table ref="table" url="rest/templates/" :columns="columns" :options="options">
                <a href="#" slot="name" @click.prevent="editTemplate(props.row)" slot-scope="props">{{ props.row.name }}</a>
            </v-server-table>
        </div>
        <b-modal size="sm" id="templateModal" :title="template.title" @ok="modalOk" @cancel="modalCancel" ref="templateModal">
            <backend-form ref="templateForm" klass="TemplateForm" module="visit.forms" />
            <div slot="modal-footer" class="w-100">
                <b-btn size="sm" class="float-right" variant="primary" @click="modalCancel">Anuluj</b-btn>
                <b-btn size="sm" class="float-right mr-2" variant="default" @click="modalOk">Zapisz</b-btn>
            </div>
        </b-modal>
    </div>
</template>
<script>
export default {
  name: 'templates',
  methods: {
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
      this.$refs.templateForm.loadHtml(template.id).then(response => { this.$refs.templateModal.show() })
      this.$refs.templateModal.show()
    }
  },
  data () {
    return {
      template: {title: '', id: null},
      columns: ['name', 'text', 'tab_name'],
      options: {
        headings: {'name': 'Nazwa', 'text': 'Treść', 'tab_name': 'Zakładka'}
      }
    }
  }
}
</script>
