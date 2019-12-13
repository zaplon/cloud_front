<template>
    <div v-if="show" title="Liczba dostępnych numerów recept / Liczba wszystkich numerów recept">
        <span @click="showModal" id="add-prescriptions">Recepty:&nbsp;&nbsp;{{ available }} / {{ total }}</span>
        <b-modal size="md" id="numbersModal" ref="modal" title="Dodaj numery recept z pliku">
            <form-prescription-numbers ref="formPrescriptionNumbers"></form-prescription-numbers>
            <div slot="modal-footer" class="w-100">
                <b-btn size="sm" class="float-right" variant="default" @click="cancel">Zamknij</b-btn>
                <b-btn size="sm" class="float-right mr-2" variant="primary" @click="save">Prześlij</b-btn>
            </div>
        </b-modal>
    </div>
</template>
<script>
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
      this.$refs.formPrescriptionNumbers.save((response) => {
        this.$refs.modal.hide()
        this.available = response.data.available
        this.total = response.data.total
      })
    },
    cancel () {
      this.$refs.modal.hide()
    }
  },
  components: { FormPrescriptionNumbers },
  mounted () {
    this.show = this.$store.state.user.type === 'doctor'
    if (this.show) {
      this.available = this.$store.state.user.doctor.available_prescriptions
      this.total = this.$store.state.user.doctor.total_prescriptions
    }
  }
}

</script>
<style>
    #add-prescriptions {
        cursor: pointer;
    }
</style>
