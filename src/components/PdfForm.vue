<template>
    <b-modal :static="true" :class="klass" size="lg" id="pdfFormModal" :title="title" ref="pdfFormModal">
        <iframe id="form-frame" :src="src"></iframe>
        <div slot="modal-footer" class="w-100">
            <b-btn size="sm" class="float-right" variant="default" @click="cancel">Zamknij</b-btn>
            <form class="form-inline">
                <div class="form-group mr-2">
                    <label class="ml-2">Strony</label>
                    <input v-model="pages" placeholder="np. 1-3 5 7 9" type="text" class="ml-2 form-control"
                           name="pages-to-print" style="width: 150px;">
                </div>
                <b-btn size="sm" :disabled="!this.patientId" class="mr-2" variant="success" @click="makePdfAndSave">
                    Drukuj i prześlij do archiwum
                </b-btn>
                <b-btn size="sm" class="mr-2" variant="primary" @click="makePdf">Drukuj</b-btn>
                <b-btn size="sm" :disabled="!this.patientId" variant="primary" @click="save">Prześlij do archiwum</b-btn>
            </form>
        </div>
    </b-modal>
</template>
<script>
import axios from 'axios'
export default {
  name: 'pdf-form',
  props: {
    patientId: Number
  },
  created () {
    var vue = this
    function receiveMessage (event) {
      if (typeof event.data === 'string' && event.data.endsWith('pdf')) {
        window.openFormHandled = true
        window.open(axios.defaults.baseURL.substring(0, axios.defaults.baseURL.length - 1) + event.data)
      }
      if (typeof event.data === 'string' && event.data === 'save') {
        vue.$notify({
          group: 'nots',
          title: 'Dokument został przesłany do archiwum',
          text: ''
        })
      }
    }
    if (!window.openFormHandled) {
      window.addEventListener('message', receiveMessage, false)
    }
  },
  methods: {
    show (name, title, data, modalClass) {
      if (modalClass) { this.klass = modalClass } else { this.klass = '' }
      if (!data) {
        this.src = this.$formsRoot + name + '.html'
      } else {
        if (data.first_name && data.last_name) { data.name = (data.first_name + ' ' + data.last_name) }
        data.header_left = this.$store.state.user.system_settings.documents_header_left
        data.header_right = this.$store.state.user.system_settings.documents_header_right
        this.src = this.$formsRoot + name + '.html?' + this.$urlEncode(data)
      }
      this.title = title
      this.name = name
      this.$refs.pdfFormModal.show()
    },
    cancel () {
      this.$refs.pdfFormModal.hide()
    },
    save () {
      let iframe = document.getElementById('form-frame')
      iframe.contentWindow.postMessage(
        { name: this.name,
          pages: this.pages,
          save: 1,
          user_id: this.$store.state.user.id,
          nice_name: this.title,
          patient_id: this.patientId}, this.$backendUrl
      )
    },
    makePdf () {
      let iframe = document.getElementById('form-frame')
      iframe.contentWindow.postMessage(
        {name: this.name, pages: this.pages}, this.$backendUrl)
    },
    makePdfAndSave () {
      this.makePdf()
      this.save()
    }
  },
  data () {
    return {
      name: null,
      title: null,
      src: null,
      klass: '',
      pages: ''
    }
  }

}
</script>
<style>
    #pdfFormModal .modal-dialog {
        min-width: 900px;
    }
    #form-frame {
        width: 100%;
        height: 70vh;
    }
    .landscape-form .modal-dialog{
        min-width: 29.7cm!important;
    }
</style>
