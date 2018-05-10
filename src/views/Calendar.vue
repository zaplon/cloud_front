<template>
    <div class="card">
        <div class="card-body">
            <div id="calendar-container">
                    <full-calendar @event-drop="drop" ref="calendar" @event-selected="select" :event-sources="eventSources" :config="config"></full-calendar>
            </div>
            <div id="calendar-sidebar">
                <h3>Najbliższe wizyty</h3>
                <ul>
                    <li :key="visit.id" v-for="visit in nextVisits"><a :href="/visit/" + term.id >{{ visit }}</a></li>
                    <li v-if="nextVisits.length == 0" class="text-muted">Brak zaplanowanych wizyt</li>
                </ul>
            </div>
        </div>
        <b-modal size="sm" id="eventModal" title="Edycja terminu" @ok="modalOk" @cancel="modalCancel" ref="modal">
            <div v-show="!(term.edition || term.patientEdition)">
                <span v-if="term.status=='PENDING'">Czy rozpocząć wizytę {{term.title}} ?</span>
                <span v-if="term.status=='FINISHED'">Przejść do edycji wizyty {{term.title}} ?</span>
            </div>
            <template v-if="config.editable">
                <button v-show="!(term.edition || term.patientEdition)" @click="goToEdition" class="btn btn-primary">Edytuj termin</button>
                <div v-show="term.edition">
                    <form>
                        <div class="form-group">
                            <label for="termPatient">Pacjent</label>
                            <div class="form-row">
                                <div class="col-auto">
                                    <autocomplete id="termPatient" class="form-control"
                                            :source="patientsUrl"
                                            results-property="results"
                                            results-display="name">
                                    </autocomplete>
                                </div>
                                <div class="col-auto">
                                    <button type="button" @click="goToPatientEdition" class="btn btn-primary"><i class="fa fa-plus-square"></i></button>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="termDate">Data</label>
                            <input v-model="termForm.datetime" type="datetime" class="form-control" id="termDate">
                        </div>
                        <div class="form-group">
                            <label for="termDoctor">Lekarz</label>
                            <input v-model="termForm.doctor" type="text" class="form-control" id="termDoctor">
                        </div>
                        <div class="form-group">
                            <label for="termService">Usługa</label>
                            <input v-model="termForm.service" type="text" class="form-control" id="termService">
                        </div>
                        <div class="form-group">
                            <label for="termDuration">Czas trwania</label>
                            <input v-model="termForm.duration" type="number" min="0" class="form-control" id="termDuration">
                        </div>
                    </form>
                </div>
                <backend-form v-show="term.patientEdition" ref="patientform" klass="PatientForm" module="user_profile.forms" :id="term.patientId"></backend-form>
            </template>
        </b-modal>
        <b-modal size="sm" id="moveEventModal" title="Przesunięcie terminu" @ok="confirmMove" @cancel="revertMove" ref="moveModal">
            Czy przenieść termin {{move.event.title}} z {{move.from}}  na {{move.to}} ?
        </b-modal>
    </div>
</template>
<script>
import { FullCalendar } from 'vue-full-calendar'
import Autocomplete from 'vuejs-auto-complete'
import 'fullcalendar/dist/locale/pl'
import axios from 'axios'
export default {
  name: 'calendar',
  methods: {
    goToEdition () {
      axios.get('rest/terms/' + this.term.id + '/').then(response => {
        this.term.edition = true
      })
    },
    goToPatientEdition () {
      this.term.patientEdition = true
      this.term.edition = false
    },
    revertMove () {
      this.$refs.moveModal.hide()
      this.move.revert()
    },
    modalCancel () {
      this.term.edition = false
      this.term.patientEdition = false
      this.$refs.modal.hide()
    },
    modalOk () {
      if (this.term.edition) { this.$refs.termform.handleSubmit() } else
      if (this.term.patientEdition) {
        this.$refs.patientform.handleSubmit()
      } else { this.$router.push('/visit/:id', {id: this.term.id}) }
    },
    confirmMove () {
      axios.post('rest/timetable/move/', {id: this.move.event.id, datetime: this.move.event.start.format('YYYY-MM-DD HH:mm')}).then(response => {
        this.$refs.moveModal.hide()
      })
    },
    drop (event, delta, revertFunc, jsEvent, ui, view) {
      this.move.revert = revertFunc
      this.move.event = event
      var dateFormat = 'DD-MM HH:mm'
      this.move.to = event.start.format(dateFormat)
      console.log(event)
      this.move.from = this.$moment(new Date(event.start - delta.asMilliseconds() - 3600 * 2000)).format(dateFormat)
      this.$refs.moveModal.show()
    },
    select (event, jsEvent, view) {
      this.term.id = event.id
      this.term.title = event.title
      this.term.status = event.status
      // this.$refs.form.loadHtml()
      this.$refs.modal.show()
    },
    saveTerm () {
      this.$refs.form.handleSubmit(() => { this.$refs.modal.hide(); this.$refs.calendar.$emit('refetch-events') })
    }
  },
  computed: {
    config () {
      var doctor = this.$store.state.user.doctor
      var user = this.$store.state.user
      return {
        themeSystem: 'bootstrap4',
        minTime: doctor.terms_start,
        maxTime: doctor.terms_end,
        locale: 'pl',
        editable: user.can_edit_terms,
        slotDuration: '00:15:00',
        displayEventTime: false
      }
    }
  },
  data: () => {
    return {
      patientsUrl: axios.defaults.baseURL + 'rest/patients/?term=',
      doctorsUrl: axios.defaults.baseURL + 'rest/doctors/?term=',
      servicesUrl: axios.defaults.baseURL + 'rest/services/?term=',
      autocompletes: {
        doctor: {id: null, name: null},
        service: {id: null, name: null},
        patient: {id: null, name: null}
      },
      termForm: {
        service: null,
        datetime: null,
        doctor: null,
        duration: null
      },
      term: {
        title: '',
        status: '',
        id: null,
        patientId: null,
        edition: false,
        patientEdition: false
      },
      move: {
        event: {},
        revert: null,
        delta: 0,
        from: ''
      },
      nextVisits: [],
      eventSources:
          [
            {
              events (start, end, timezone, callback) {
                axios.get(`rest/terms/`, { params: {start: this.moment(start).format('YYYY-MM-DD'), end: this.moment(end).format('YYYY-MM-DD')} }).then(response => {
                  callback(response.data)
                })
              }
            }
          ]
    }
  },
  components: {
    FullCalendar,
    Autocomplete
  },
  mounted () {
    axios.get('/rest/terms/?next_visits=1').then(response => {
      this.nextTerms = response.data
    })
  }
}
</script>
<style>
    @import 'fullcalendar/dist/fullcalendar.css';
    #calendar-sidebar {
        display: inline-block;
        width: 295px;
        text-align: right;
    }
    #calendar-sidebar ul {
        list-style: none;
    }
    #calendar-container {
        display: inline-block;
        width: calc(100% - 300px);
    }
</style>
