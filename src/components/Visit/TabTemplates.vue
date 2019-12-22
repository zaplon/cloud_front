<template>
    <div class="mt-4">
        <div class="btn-group mb-4">
            <button class="btn btn-success" @click="showModal">Zapisz jako szablon</button>
            <button :disabled="!content" class="ml-2 btn btn-default" @click="printTab">Drukuj</button>
        </div>
        <div class="row">
            <div v-for="template in templates" :key="template.id" class="col-md-6 col-sm-12">
                <button @shortkey="putTemplate(template)" v-shortkey="getShortcut(template.key)" type="button" class="btn btn-link" @click="putTemplate(template)">({{ template.key }}) {{ template.text | truncate(100) }}</button>
            </div>
        </div>
        <b-modal :static="true" size="lg" id="templateModal" title="Nowy szablon" @ok="modalOk" @cancel="modalCancel" ref="templateModal">
            <backend-form ref="templateForm" klass="TemplateForm" module="visit.forms" />
            <div slot="modal-footer" class="w-100">
                <b-btn size="sm" class="float-right" variant="primary" @click="modalCancel">Anuluj</b-btn>
                <b-btn size="sm" class="float-right mr-2" variant="default" @click="modalOk">{{ tab.ok }}</b-btn>
            </div>
        </b-modal>
    </div>
</template>
<script>
import axios from 'axios'
import EventBus from '@/eventBus'
export default {
  name: 'tab-templates',
  methods: {
    printTab () {
      console.log(this.name)
      axios.post('pdf/', {text: this.content,
        patient: this.patient,
        name: this.name,
        template_name: 'visit_notes',
        skip_saving: true}).then(response => {
        let url = axios.defaults.baseURL.substr(0, axios.defaults.baseURL.length - 1) + response.data
        EventBus.$emit('show-document', url, 'Notatka dla pacjenta')
      })
    },
    getShortcut (key) {
      return key.toLowerCase().split('+')
    },
    showModal () {
      this.$refs.templateForm.loadHtml(null, {text: this.content, tab: this.name}).then(() => this.$refs.templateModal.show())
    },
    modalOk () {
      this.$refs.templateForm.handleSubmit((response) => {
        this.$refs.templateModal.hide()
      })
    },
    modalCancel () {
      this.$refs.templateModal.hide()
    },
    putTemplate (template) {
      this.$emit('setData', template.text)
    }
  },
  data () {
    return {
      tab: {ok: 'Dodaj'}
    }
  },
  props: {
    templates: Array,
    content: String,
    name: String,
    patient: Object
  }
}
</script>
