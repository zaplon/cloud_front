<template>
    <div class="card">
        <div class="card-header">
            Szablony
        </div>
        <div class="card-body">
            <div class="btn-group mb-4">
                <button class="btn btn-success" @click="addTemplate">Dodaj</button>
            </div>
            <v-server-table url="rest/templates/" :columns="columns" :options="options"></v-server-table>
        </div>
        <b-modal size="sm" id="templateModal" :title="template.title" @ok="modalOk" @cancel="modalCancel" ref="templateModal">
            <backend-form ref="templateForm" klass="TemplateForm" module="visit.forms" :pk="template.id" />
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
      this.$refs.templateForm.handleSubmit(() => this.$refs.templateModal.hide())
    },
    addTemplate () {
      this.template.title = 'Nowy szablon'
      this.$refs.templateModal.show()
    }
  },
  data () {
    return {
      template: {title: ''},
      columns: ['name', 'text', 'tab_name'],
      options: {
        headings: {'name': 'Nazwa', 'text': 'Treść', 'tab_name': 'Zakładka'}
      }
    }
  }
}
</script>
