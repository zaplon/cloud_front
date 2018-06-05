<template>
    <div class="card">
        <div class="card-body">
            <div id="calendar-container">
                    <full-calendar @event-drop="drop" ref="calendar" @event-selected="select" :event-sources="eventSources" :config="config"></full-calendar>
            </div>
            <div id="calendar-sidebar">
                <v-calendar :attributes='attrs' v-on:dayclick="setCalendarDate"></v-calendar>
                <h3 class="mt-2">Najbliższe wizyty</h3>
                <ul>
                    <li :key="visit.id" v-for="visit in nextVisits"><a :href="visit.link">{{ visit.title }}</a></li>
                    <li v-if="nextVisits.length == 0" class="text-muted">Brak zaplanowanych wizyt</li>
                </ul>
            </div>
        </div>
        <b-modal size="md" id="eventModal" title="Edycja terminu" @ok="modalOk" @cancel="modalCancel" ref="modal">
            <div v-show="!(term.edition || term.patientEdition)">
                <span v-if="term.status=='PENDING'">Czy rozpocząć wizytę {{term.title}} ?</span>
                <span v-if="term.status=='FINISHED'">Przejść do edycji wizyty {{term.title}} ?</span>
            </div>
            <template v-if="config.editable">
                <div v-if="term.edition">
                    <form>
                        <div class="form-group">
                            <label for="termPatient">Pacjent</label>
                            <div class="input-group mb-3">
                                <autocomplete id="termPatient" input-class="form-control" @selected="selectPatient"
                                        :source="patientsUrl" style="display: flex; width: calc(100% - 37px)"
                                        results-property="results" placeholder="Wyszukaj..." :initialDisplay="autocompletes.patient"
                                        results-display="label">
                                </autocomplete>
                                <div class="input-group-append">
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
                            <autocomplete id="termDoctor" input-class="form-control" @selected="selectDoctor"
                                          :source="doctorsUrl" placeholder="Wyszukaj..." :initialDisplay="autocompletes.doctor"
                                          results-property="results"
                                          results-display="name">
                            </autocomplete>
                        </div>
                        <div class="form-group">
                            <label for="termService">Usługa</label>
                            <autocomplete id="termService" input-class="form-control" @selected="selectService"
                                          :source="servicesUrl" placeholder="Wyszukaj..."
                                          results-property="results" :initialDisplay="autocompletes.service"
                                          results-display="name">
                            </autocomplete>
                        </div>
                        <div class="form-group">
                            <label for="termDuration">Czas trwania</label>
                            <input v-model="termForm.duration" type="number" min="0" class="form-control" id="termDuration">
                        </div>
                    </form>
                </div>
                <backend-form v-show="term.patientEdition" ref="patientform" klass="PatientForm" module="user_profile.forms" :pk="term.patientId"></backend-form>
            </template>
            <div slot="modal-footer" class="w-100">
                <button v-show="!(term.edition || term.patientEdition)" @click="goToEdition" class="pull-left btn btn-sm btn-primary">Edytuj termin</button>
                <button v-show="term.status == 'PENDING'" @click="cancelVisit" class="pull-left btn btn-sm btn-danger">Anuluj wizytę</button>
                <template v-if="!(term.edition || term.patientEdition) && config.editable">
                    <b-btn size="sm" class="float-right" variant="default" @click="modalCancel">Nie</b-btn>
                    <b-btn size="sm" class="float-right" variant="primary" @click="modalOk">Tak</b-btn>
                </template>
                <template v-if="term.edition || term.patientEdition">
                    <b-btn size="sm" class="float-right" variant="default" @click="modalCancel">Anuluj</b-btn>
                    <b-btn size="sm" class="float-right" variant="primary" @click="modalOk">Zapisz</b-btn>
                </template>
            </div>
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
    setCalendarDate (payload) {
      this.attrs[0].dates = payload.date
      this.$refs.calendar.fireMethod('gotoDate', payload.date)
    },
    cancelVisit () {

    },
    selectPatient (obj) {
      this.termForm.patient = obj.selectedObject
    },
    selectService (obj) {
      this.termForm.service = obj.selectedObject
    },
    selectDoctor (obj) {
      this.termForm.doctor = obj.selectedObject
    },
    goToEdition () {
      axios.get('rest/terms/' + this.term.id + '/').then(response => {
        var data = response.data
        this.termForm.datetime = data.datetime
        this.termForm.id = data.id
        this.termForm.duration = data.duration
        if (data.doctor) {
          this.termForm.doctor = {id: data.doctor.id, name: data.doctor.name}
          this.autocompletes.doctor = data.doctor.name
        } else {
          this.autocompletes.doctor = null
          this.termForm.doctor = null
        }
        if (data.service) {
          this.termForm.service = {id: data.service.id, name: data.service.name}
          this.autocompletes.service = data.service.name
        } else {
          this.termForm.service = null
          this.autocompletes.service = null
        }
        if (data.patient) {
          this.termForm.patient = {id: data.patient.id, label: data.patient.name_with_pesel}
          this.autocompletes.patient = data.patient.name_with_pesel
        } else {
          this.termForm.patient = null
          this.autocompletes.patient = null
        }
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
      if (this.term.edition) {
        axios.patch('rest/terms/' + this.termForm.id + '/',
          {doctor: this.termForm.doctor.id,
            service: this.termForm.service.id,
            patient: this.termForm.patient.id,
            duration: this.termForm.duration,
            datetime: this.termForm.datetime}).then(response => {
          this.$refs.calendar.$emit('refetch-events')
          this.term.edition = false
          this.$refs.modal.hide()
        })
      } else
      if (this.term.patientEdition) {
        this.$refs.patientform.handleSubmit()
      } else { this.$router.push({name: 'Visit', params: {id: this.term.id}}) }
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
      this.$refs.modal.show()
    },
    saveTerm () {
      this.$refs.form.handleSubmit(() => { this.$refs.modal.hide(); this.$refs.calendar.$emit('refetch-events') })
    }
  },
  computed: {
    autocompletes () {
      return {
        doctor: null,
        service: null,
        patient: null
      }
    },
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
      termForm: {
        id: null,
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
      selectedDate: new Date(),
      eventSources:
          [
            {
              events (start, end, timezone, callback) {
                axios.get(`rest/terms/`, { params: {start: this.moment(start).format('YYYY-MM-DD'), end: this.moment(end).format('YYYY-MM-DD')} }).then(response => {
                  callback(response.data)
                })
              }
            }
          ],
      attrs: [
        {
          key: 'today',
          highlight: {
            backgroundColor: '#008cba'
            // Other properties are available too, like `height` & `borderRadius`
          },
          contentStyle: {
            color: '#fafafa'
          },
          dates: new Date(new Date().setHours(0, 0, 0, 0))
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
      this.nextVisits = response.data
      this.nextVisits.forEach((r, i) => { r.link = '/#/visit/' + r.id })
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
        vertical-align: top;
        display: inline-block;
        width: calc(100% - 300px);
    }
    .c-day-content {
        cursor: pointer!important;
    }
</style>
