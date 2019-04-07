<template>
    <b-modal size="lg" id="agreementModal" style="min-width: 900px;" :title="consent.title" ref="agreementModal">
        <embed style="width:100%; height:70vh;" :src="consent.document" v-if="consent.document">
        <div v-html="consent.text"></div>
        <div slot="modal-footer" class="w-100">
            <b-btn size="sm" class="float-right" variant="primary" @click="confirm(consent)">Potwierdzam</b-btn>
        </div>
    </b-modal>
</template>
<script>
import axios from 'axios'
export default {
  name: 'agreement',
  props: {
    consents: {
      type: Array,
      required: false,
      default: null
    }
  },
  data () {
    return {
      consent: {},
      consentIndex: 0
    }
  },
  methods: {
    confirm (consent) {
      axios.post('/rest/agreements/' + consent.id + '/confirm/').then(response => {
        if (this.consentIndex < this.consents.length) { this.$refs.agreementModal.hide() } else {
          this.consentIndex += 1
          this.consent = this.consents[this.consentIndex]
        }
      })
    }
  },
  watch: {
    consents () {
      if (this.consents.length > 0) {
        this.consent = this.consents[0]
        this.$refs.agreementModal.show()
      }
    }
  }
}
</script>
