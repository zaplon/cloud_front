<template>
    <b-modal size="lg" id="pdfDocumentModal" style="min-width: 900px;" :title="title" ref="pdfDocumentModal">
        <embed style="width:100%; height:70vh;" :src="src" v-if="!asHTML" />
        <iframe style="width:100%; height:70vh;" :src="src" v-else />
        <div slot="modal-footer" class="w-100">
            <div class="pull-left">
                <b-btn size="sm" class="mr-2" variant="primary" @click="print">Drukuj</b-btn>
                <!--<b-btn size="sm" v-if="patientId" variant="primary" @click="save">Prześlij do archiwum</b-btn>-->
                <slot name="actions"></slot>
            </div>
            <div class="pull-right">
                <b-btn size="sm" class="float-right" variant="default" @click="cancel">Zamknij</b-btn>
            </div>
        </div>
    </b-modal>
</template>
<script>
import axios from 'axios'
export default {
  name: 'pdf-document',
  data () {
    return {
      src: '',
      title: '',
      patientId: null,
      asHTML: false
    }
  },
  methods: {
    showDocument (src, title, patientId, asHTML) {
      if (asHTML) { this.asHTML = asHTML } else { this.asHTML = false }
      console.log(patientId)
      if (location.protocol === 'https:') { src = src.replace('http://', 'https://') }
      this.src = src
      this.title = title
      this.patientId = patientId
      this.show()
    },
    show () {
      this.$refs.pdfDocumentModal.show()
    },
    cancel () {
      this.$refs.pdfDocumentModal.hide()
    },
    print () {
      window.open(this.src)
    },
    save () {
      let path = this.src.replace(window.origin, '')
      axios.post('save_document/', {path: path, name: this.title, patient_id: this.patientId}).then(response => {
        this.$notify({
          group: 'nots',
          title: 'Dokument został przesłany do archiwum',
          text: ''
        })
      }).error(response => {
        this.$notify({
          group: 'nots',
          title: 'Wystąpił błąd podczas przesyłania dokumentu do archiwum',
          text: '',
          type: 'error'
        })
      })
    }
  }
}
</script>
