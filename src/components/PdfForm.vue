<template>
    <b-modal :class="klass" size="lg" id="pdfFormModal" :title="title" ref="pdfFormModal">
        <iframe id="form-frame" :src="src"></iframe>
        <div slot="modal-footer" class="w-100">
            <b-btn size="sm" class="float-right" variant="default" @click="cancel">Zamknij</b-btn>
            <b-btn size="sm" class="float-left mr-2" variant="info" @click="makePdf">Drukuj</b-btn>
            <b-btn size="sm" class="float-left" variant="success" @click="save">Prześlij do archiwum</b-btn>
        </div>
    </b-modal>
</template>
<script>
import axios from 'axios'
export default {
  name: 'pdf-form',
  created () {
    function receiveMessage (event) {
      window.openFormHandled = true
      if (typeof event.data === 'string' && event.data.endsWith('pdf')) {
        window.open(axios.defaults.baseURL.substring(0, axios.defaults.baseURL.length - 1) + event.data)
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
      axios.post('forms/edit_form/', {
        data: this.data,
        tmp: true,
        name: this.name,
        nice_name: this.title
      }).then(response => { })
    },
    makePdf () {
      let iframe = document.getElementById('form-frame')
      iframe.contentWindow.postMessage({name: this.name}, this.$backendUrl)
    }
  },
  data () {
    return {
      name: null,
      title: null,
      src: null,
      klass: ''
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
