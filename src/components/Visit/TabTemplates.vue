<template>
    <div class="mt-4">
        <div class="btn-group mb-4">
            <button class="btn btn-success" @click="showModal">Zapisz jako szablon</button>
            <button :disabled="!content" class="ml-2 btn btn-default" @click="printTab">Drukuj</button>
        </div>
        <div class="row">
            <div v-for="template in tabTemplates" :key="template.id" class="col-md-6 col-sm-12">
                <button @shortkey="putTemplate(template)" v-shortkey="getShortcut(template.key)" type="button" class="btn btn-link" @click="putTemplate(template)">
                    <span v-if="template.key.length > 2">({{ template.key }}) </span><span>{{ template.text | truncate(100) }}</span>
                </button>
            </div>
        </div>
        <b-modal :static="true" size="lg" id="templateModal" title="Nowy szablon" @ok="modalOk" @cancel="modalCancel" ref="templateModal">
            <generic-form :fields="templateFormFields" ref="templateForm"></generic-form>
            <div slot="modal-footer" class="w-100">
                <b-btn size="sm" class="float-right" variant="primary" @click="modalCancel">Anuluj</b-btn>
                <b-btn size="sm" class="float-right mr-2" variant="default" @click="modalOk">Zapisz</b-btn>
            </div>
        </b-modal>
    </div>
</template>
<script>
import axios from 'axios'
import EventBus from '@/eventBus'
import GenericForm from '@/components/Forms/GenericForm'
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
      if (key) {
        return key.toLowerCase().split('+')
      }
    },
    showModal () {
      this.$refs.templateForm.setData({tab_name: this.name, text: this.content})
      this.$refs.templateModal.show()
    },
    modalOk () {
      var data = this.$refs.templateForm.getData()
      axios.post('/rest/templates/', data).then(response => {
        this.$refs.templateModal.hide()
        this.tabTemplates.push(response.data)
      }).catch((error) => {
        this.$refs.templateForm.errors = error.response.data
      })
    },
    modalCancel () {
      this.$refs.templateModal.hide()
    },
    putTemplate (template) {
      this.$emit('setData', template.text)
    }
  },
  mounted () {
    this.tabTemplates = this.templates
  },
  data () {
    return {
      tab: {ok: 'Dodaj'},
      tabTemplates: [],
      templateFormFields: [
        {name: 'name', label: 'Nazwa'},
        {name: 'key',
          label: 'Skrót',
          type: 'select',
          choices: [
            {id: 'CTRL+F1', name: 'CTRL + F1'},
            {id: 'CTRL+F2', name: 'CTRL + F2'},
            {id: 'CTRL+F3', name: 'CTRL + F3'},
            {id: 'CTRL+F4', name: 'CTRL + F4'},
            {id: 'CTRL+F5', name: 'CTRL + F5'},
            {id: 'CTRL+F6', name: 'CTRL + F6'},
            {id: 'CTRL+F7', name: 'CTRL + F7'},
            {id: 'CTRL+F8', name: 'CTRL + F8'},
            {id: 'CTRL+F9', name: 'CTRL + F9'},
            {id: 'CTRL+F10', name: 'CTRL + F10'},
            {id: 'ALT+F1', name: 'ALT + F1'},
            {id: 'ALT+F2', name: 'ALT + F2'},
            {id: 'ALT+F3', name: 'ALT + F3'},
            {id: 'ALT+F4', name: 'ALT + F4'},
            {id: 'ALT+F5', name: 'ALT + F5'},
            {id: 'ALT+F6', name: 'ALT + F6'},
            {id: 'ALT+F7', name: 'ALT + F7'},
            {id: 'ALT+F8', name: 'ALT + F8'},
            {id: 'ALT+F9', name: 'ALT + F9'},
            {id: 'ALT+F10', name: 'ALT + F10'}
          ]},
        {name: 'text', label: 'Treść', type: 'textarea'},
        {name: 'tab_name', label: 'Zakładka', readonly: true}
      ]
    }
  },
  props: {
    templates: Array,
    content: String,
    name: String,
    patient: Object
  },
  components: {
    GenericForm
  }
}
</script>
