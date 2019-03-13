<template>
    <div class="container">
        <div class="card m-4">
            <div class="card-body">
                <div class="row" style="white-space: pre">
                    <div class="col-md-6 text-left">{{ info.documents_header_left }}</div>
                    <div class="col-md-6 text-right">{{ info.documents_header_right }}</div>
                </div>
            </div>
        </div>
        <div>
            <div class="card m-4">
                <div class="card-header">Zarezerwuj wizytę</div>
                <div class="card-body">
                    <filters @search-doctors="search"></filters>
                    <div class="mt-4">
                        <div class="row">
                            <div v-for="term in terms" :key="term.id" class="col-auto mt-2">
                                <button style="white-space: normal" class="btn btn-primary" @click="showForm(term)">
                                    {{ term.datetime| formatDate('DD-MM HH:mm') }} {{ term.doctor }} {{ term.localization }}
                                </button>
                            </div>
                        </div>
                        <div class="row mt-4" v-if="this.terms.length > 0">
                            <div class="col-12">
                                <button class="btn btn-info" @click="loadMore">Załaduj więcej</button>
                            </div>
                        </div>
                        <div v-if="this.terms.length == 0">
                            <p class="text-center mt-2" v-if="searchMade">Brak wyników</p>
                        </div>
                    </div>
                </div>
                <b-modal v-if="service" ok-title="Zapisz" cancel-title="Anuluj" size="md" id="booking-form" title="Nowa rezerwacja" ref="bookingModal">
                    <form-booking v-if="!reservationMade" ref="bookingForm" :term="term"></form-booking>
                    <div v-else>
                        <h4>Dziękujemy,</h4>
                        <p>rezerwacja została zapisana</p>
                    </div>
                    <div slot="modal-footer" class="w-100">
                        <b-button size="sm" v-if="!reservationMade" class="float-right"
                                  variant="secondary" @click="cancel">Zamknij</b-button>
                        <b-button size="sm" v-if="reservationMade" class="float-right" variant="primary" @click="cancel">Wróc do listy terminów</b-button>
                        <b-button size="sm" v-else class="float-right mr-2" variant="primary" @click="save">Zapisz</b-button>
                    </div>
                </b-modal>
            </div>
        </div>
    </div>
</template>
<script>
import Filters from '@/components/Calendar/Filters'
import axios from 'axios'
import FormBooking from '../components/Forms/Booking'
export default {
  name: 'booking',
  components: {FormBooking, Filters},
  mounted () {
    axios.get('rest/info/1/').then(response => { this.info = response.data })
  },
  methods: {
    save (evt) {
      evt.preventDefault()
      this.$refs.bookingForm.save(() => {
        this.reservationMade = true
      })
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
      this.searchMade = true
      if (data) {
        console.log(data)
        this.service = {id: data.service, name: data.serviceName}
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
      searchMade: false,
      reservationMade: false,
      term: {},
      terms: [],
      service: {},
      params: {offset: 0},
      info: {}
    }
  }
}
</script>
