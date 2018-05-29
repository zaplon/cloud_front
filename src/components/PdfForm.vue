<template>
    <b-modal size="lg" id="pdfFormModal" :title="title" ref="pdfFormModal">
        <iframe id="form-frame" :src="src"></iframe>
        <div slot="modal-footer" class="w-100">
            <b-btn size="sm" class="float-right" variant="default" @click="cancel">Zamknij</b-btn>
            <b-btn size="sm" class="float-left mr-2" variant="primary" @click="print">Drukuj</b-btn>
            <b-btn size="sm" class="float-left" variant="success" @click="save">Prześlij do archiwum</b-btn>
        </div>
    </b-modal>
</template>
<script>
import axios from 'axios'
export default {
  name: 'pdf-form',
  methods: {
    show (name, title) {
      this.src = this.$formsRoot + name + '.html'
      this.title = title
      this.$refs.pdfFormModal.show()
    },
    print () {

    },
    cancel () {
      this.$refs.pdfFormModal.hide()
    },
    getData () {
      return ''
    },
    save () {
      axios.post('/forms/edit_form/', {
        data: this.getData(),
        tmp: true,
        name: this.name,
        nice_name: this.title
      }).then(response => { })
    }
  },
  data () {
    return {
      name: null,
      title: null,
      src: null
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
</style>
