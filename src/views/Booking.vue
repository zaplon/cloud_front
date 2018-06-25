<template>
    <div class="card">
        <div class="card-header">Zarezerwuj wizytę</div>
        <div class="card-body">
            <filters @search-doctors="search"></filters>
            <div class="mt-4">
                <div class="row">
                    <button v-for="term in terms" :key="term.id" class="btn btn-primary ml-2 mt-2" @click="showForm(term)">
                        {{ term.datetime| formatDate('DD-MM HH:mm') }} {{ term.doctor }} {{ term.localization }}
                    </button>
                </div>
                <div class="row mt-4" v-if="this.terms.length > 0">
                    <button class="btn btn-info" @click="loadMore">Załaduj więcej</button>
                </div>
            </div>
        </div>
        <b-modal ok-title="Zapisz" cancel-title="Anuluj" size="md" id="booking-form" title="Nowa rezerwacja" @ok="save" @cancel="cancel" ref="bookingModal">
            <form-booking ref="bookingForm" :term="term"></form-booking>
        </b-modal>
    </div>
</template>
<script>
import Filters from '@/components/Calendar/Filters'
import axios from 'axios'
import FormBooking from '../components/Forms/Booking'
export default {
  name: 'booking',
  components: {FormBooking, Filters},
  methods: {
    save () {
      this.$refs.bookingForm.save(() => { this.$refs.bookingModal.hide() })
    },
    cancel () {
      this.$refs.bookingModal.hide()
    },
    showForm (term) {
      this.term = term
      this.term.service = this.service
      this.$refs.bookingModal.show()
    },
    loadMore () {
      this.params.offset += 10
      this.search(false, true)
    },
    search (data, append) {
      if (data) {
        this.service = data.serviceName
        this.params = {start: data.dateFrom, booking: 1, offset: 0, service: data.service}
      }
      axios.get('rest/booking/', {params: this.params}).then(response => {
        if (!append) { this.terms = response.data.results } else {
          this.terms.push(...response.data.results)
        }
      })
    }
  },
  data () {
    return {
      term: {},
      terms: [],
      service: '',
      params: {offset: 0}
    }
  }
}
</script>
