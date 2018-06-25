<template>
    <div v-if="show" title="Liczba dostępnych numerów recept / Liczba wszystkich numerów recept">
        <span @click="showModal" id="add-prescriptions">{{ available }} / {{ total }}</span>
        <b-modal size="md" id="numbersModal" ref="modal" title="Dodaj numery recept z pliku">
            <form-prescription-numbers></form-prescription-numbers>
            <div slot="modal-footer" class="w-100">
                <b-btn size="sm" class="float-right" variant="default" @click="cancel">Zamknij</b-btn>
                <b-btn size="sm" class="float-right mr-2" variant="info" @click="save">Prześlij</b-btn>
            </div>
        </b-modal>
    </div>
</template>
<script>
import axios from 'axios'
import FormPrescriptionNumbers from '@/components/Forms/PrescriptionNumbers'
export default {
  name: 'prescription-numbers',
  data: function () {
    return {
      available: 0,
      total: 0,
      show: false
    }
  },
  methods: {
    showModal () {
      this.$refs.modal.show()
    },
    save () {
      axios.post()
    },
    cancel () {
      this.$refs.modal.hide()
    }
  },
  components: { FormPrescriptionNumbers },
  mounted () {
    this.available = this.$store.state.user.doctor.available_prescriptions
    this.total = this.$store.state.user.doctor.total_prescriptions
    console.log(this.$store.state.user.type)
    this.show = this.$store.state.user.type === 'doctor'
  }
}

</script>
<style>
    #add-prescriptions {
        cursor: pointer;
    }
</style>
