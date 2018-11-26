<template>
    <b-modal size="lg" id="pdfDocumentModal" style="min-width: 900px;" :title="title" ref="pdfDocumentModal">
        <embed style="width:100%; height:70vh;" :src="src"/>
        <div slot="modal-footer" class="w-100">
            <b-btn size="sm" class="float-right" variant="default" @click="cancel">Zamknij</b-btn>
        </div>
    </b-modal>
</template>
<script>
export default {
  name: 'pdf-document',
  data () {
    return {
      src: '',
      title: ''
    }
  },
  methods: {
    showDocument (src, title) {
      this.src = src
      this.title = title
      this.show()
    },
    show () {
      this.$refs.pdfDocumentModal.show()
    },
    cancel () {
      this.$refs.pdfDocumentModal.hide()
    },
    print () {

    }
  }
}
</script>
