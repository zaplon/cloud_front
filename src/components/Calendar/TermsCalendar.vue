<template>
    <div>
        <full-calendar @event-drop="drop" ref="calendar" @event-selected="eventClicked"
                       @day-click="slotClicked" :event-sources="eventSources" :config="config"></full-calendar>
        <b-modal size="md" id="eventModal" :title="modalTitle" @ok="modalOk" @cancel="modalCancel" ref="modal">
            <div v-show="!(term.edition || term.patientEdition)">
                <span v-if="term.status=='PENDING'">Czy rozpocząć wizytę {{term.title}} ?</span>
                <span v-if="term.status=='FINISHED'">Przejść do edycji wizyty {{term.title}} ?</span>
                <span v-if="term.status=='FREE'">Termin {{term.start}} jest wolny</span>
            </div>
            <template v-if="config.editable">
                <div v-if="term.edition">
                    <form>
                        <div class="form-group row mb-3">
                            <label for="termPatient" class="col-md-2">Pacjent</label>
                            <div class="input-group col-md-10">
                                <autocomplete id="termPatient" input-class="form-control" @selected="selectPatient"
                                              :source="patientsUrl" style="display: flex; width: calc(100% - 30px)"
                                              :request-headers="authHeaders"
                                              results-property="results" placeholder="Wyszukaj..." :initialDisplay="autocompletes.patient"
                                              results-display="label">
                                </autocomplete>
                                <div class="input-group-append">
                                    <button type="button" @click="goToPatientEdition" class="btn btn-primary"><i class="fa fa-plus-square"></i></button>
                                </div>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="col-md-2" for="termDate">Data</label>
                            <v-date-picker mode='single' v-model='termForm.date' class="col-md-10">
                                <input placeholder="Data" type="text" class="form-control" id="termDate"
                                       slot-scope="props" v-model="props.inputValue">
                            </v-date-picker>
                        </div>
                        <div class="form-group row">
                            <label class="col-md-2" for="termTime">Godzina</label>
                            <div class="col-md-10">
                                <vue-timepicker style="width:100%;" v-model="termForm.time" :minute-interval="5" id="termTime"></vue-timepicker>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="col-md-2" for="termDoctor">Lekarz</label>
                            <div class="col-md-10">
                                <input class="form-control" type="text" id="termDoctor" readonly v-model="termForm.doctor.name"/>
                            </div>
                            <!--<autocomplete id="termDoctor" input-class="form-control" @selected="selectDoctor"-->
                                          <!--:source="doctorsUrl" placeholder="Wyszukaj..." :initialDisplay="autocompletes.doctor"-->
                                          <!--results-property="results"-->
                                          <!--results-display="name">-->
                            <!--</autocomplete>-->
                        </div>
                        <div class="form-group row">
                            <label class="col-md-2" for="termService">Usługa</label>
                            <div class="col-md-10">
                                <autocomplete v-if="hasManyServices" id="termService" input-class="form-control" @selected="selectService"
                                              :source="servicesUrl" placeholder="Wyszukaj..."
                                              :request-headers="authHeaders"
                                              results-property="results" :initialDisplay="autocompletes.service"
                                              results-display="name">
                                </autocomplete>
                                <input v-else class="form-control" type="text" readonly v-model="autocompletes.service">
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="col-md-2" for="termDuration">Czas trwania</label>
                            <div class="col-md-10">
                                <input name="term-duration" v-model="termForm.duration" type="number" min="1" class="form-control" id="termDuration">
                            </div>
                        </div>
                    </form>
                    <div v-if="termForm.errors">
                        <p class="text-danger" :key="error" v-for="error in termForm.errors">{{ error }}</p>
                    </div>
                </div>
                <backend-form v-show="term.patientEdition" ref="patientForm" klass="PatientForm" module="user_profile.forms" :pk="term.patientId"></backend-form>
            </template>
            <div slot="modal-footer" class="w-100">
                <button v-show="!(term.edition || term.patientEdition)" @click="goToEdition" class="pull-left btn btn-sm btn-primary mr-2">Edytuj termin</button>
                <button v-show="term.status == 'PENDING'" @click="cancelVisit(term)" class="pull-left btn btn-sm btn-danger">Anuluj wizytę</button>
                <template v-if="!(term.edition || term.patientEdition) && config.editable && term.status != 'FREE'">
                    <b-btn size="sm" class="float-right" variant="default" @click="modalCancel">Nie</b-btn>
                    <b-btn size="sm" class="float-right mr-2" variant="primary" @click="modalOk">Tak</b-btn>
                </template>
                <template v-if="term.edition || term.patientEdition">
                    <b-btn size="sm" class="float-right" variant="default" @click="modalCancel">Anuluj</b-btn>
                    <b-btn size="sm" class="float-right mr-2" variant="primary" @click="modalOk">Zapisz</b-btn>
                    <b-btn v-if="!term.id && !term.patientEdition" size="sm" class="float-right mr-2" variant="primary" @click="modalOk(true)">
                        Zapisz i rozpocznij
                    </b-btn>
                </template>
            </div>
        </b-modal>
        <b-modal size="sm" id="moveEventModal" title="Przesunięcie terminu" @ok="confirmMove" @cancel="revertMove" ref="moveModal"
        cancelTitle="Anuluj">
            Czy przenieść termin {{move.event.title}} z {{move.from}}  na {{move.to}} ?
        </b-modal>
    </div>
</template>
<script>
import { FullCalendar } from 'vue-full-calendar'
import Autocomplete from 'vuejs-auto-complete'
import 'fullcalendar/dist/locale/pl'
import axios from 'axios'
import VueTimepicker from 'vuejs-timepicker'
import EventBus from '@/eventBus'
export default {
  name: 'terms-calendar',
  components: {FullCalendar, Autocomplete, VueTimepicker},
  methods: {
    cancelVisit (term) {
      axios.post('timetable/cancel/', {id: term.id}).then(response => {
        this.$refs.calendar.$emit('refetch-events')
        this.$refs.modal.hide()
      })
    },
    loadDoctorCalendar (doctor) {
      this.doctor = doctor.id
      console.log(this.$moment(doctor.first_term, 'DD-MM-YYYY'))
      this.$refs.calendar.fireMethod('gotoDate', this.$moment(doctor.first_term, 'DD-MM-YYYY'))
      this.$refs.calendar.$emit('refetch-events')
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
    addNewVisit () {
      this.term.id = null
      this.modalTitle = 'Nowa wizyta'
      this.termForm = this.resetTermForm()
      if (this.$store.state.user.doctor) {
        let doctor = this.$store.state.user.doctor
        this.termForm.duration = this.$store.state.user.doctor.visit_duration
        this.termForm.doctor = {id: doctor.id, name: doctor.name}
        this.autocompletes.doctor = doctor.name
      }
      this.term.edition = true
      this.$refs.modal.show()
    },
    goToEdition () {
      this.modalTitle = 'Edycja terminu'
      return axios.get('rest/terms/' + this.term.id + '/').then(response => {
        var data = response.data
        let datetime = this.$moment(data.datetime)
        this.termForm.date = new Date(data.datetime)
        this.termForm.time = {HH: datetime.format('HH'), mm: datetime.format('mm')}
        this.termForm.id = data.id
        this.termForm.duration = data.duration
        this.termForm.errors = []
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
          if (!this.singleService) {
            this.termForm.service = null
            this.autocompletes.service = null
          } else {
            this.termForm.service = this.singleService
            this.autocompletes.service = this.singleService.name
          }
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
    modalOk (startVisit) {
      if (this.term.edition) {
        this.termForm.errors = []
        if (!this.termForm.patient && this.termForm.service) {
          this.termForm.errors.push('Proszę wybrać pacjenta')
        }
        if (!this.termForm.duration) {
          this.termForm.errors.push('Proszę określić czas trwania wizyty')
        }
        if (!this.termForm.service && this.termForm.patient) {
          this.termForm.errors.push('Proszę wybrać usługę')
        }
        if (this.termForm.errors.length > 0) {
          return
        }
        let datetime = this.$moment(this.termForm.date).format('YYYY-MM-DD') + 'T' +
            this.termForm.time['HH'] + ':' + this.termForm.time['mm']
        let payload = {
          doctor: this.termForm.doctor ? this.termForm.doctor.id : null,
          service: this.termForm.service ? this.termForm.service.id : null,
          patient: this.termForm.service ? this.termForm.patient.id : null,
          duration: this.termForm.duration,
          datetime: datetime
        }
        let callback = () => {
          this.$refs.calendar.$emit('refetch-events')
          this.term.edition = false
          this.$refs.modal.hide()
        }
        if (this.termForm.id) {
          axios.patch('rest/terms/' + this.termForm.id + '/', payload).then(response => {
            callback()
          })
        } else {
          axios.post('rest/terms/', payload).then(response => {
            if (startVisit) {
              this.$router.push({name: 'visit', params: {id: response.data.id}})
            } else {
              callback()
            }
          })
        }
      } else
      if (this.term.patientEdition) {
        this.$refs.patientForm.handleSubmit(res => {
          this.termForm.patient = {id: res.id, label: res.label}
          this.autocompletes.patient = res.label
          this.term.patientEdition = false
          this.$refs.patientForm.loadHtml()
          this.term.edition = true
        })
      } else { this.$router.push({name: 'visit', params: {id: this.term.id}}) }
    },
    confirmMove () {
      axios.post('timetable/move/', {id: this.move.event.id, datetime: this.move.event.start.format('YYYY-MM-DD HH:mm')}).then(response => {
        this.$refs.calendar.$emit('refetch-events')
        this.$refs.moveModal.hide()
      })
    },
    drop (event, delta, revertFunc, jsEvent, ui, view) {
      if (event.status === 'FINISHED') {
        revertFunc()
        return
      }
      this.move.revert = revertFunc
      this.move.event = event
      var dateFormat = 'DD-MM HH:mm'
      this.move.to = event.start.format(dateFormat)
      console.log(event)
      this.move.from = this.$moment(new Date(event.start - delta.asMilliseconds() - 3600 * 2000)).format(dateFormat)
      this.$refs.moveModal.show()
    },
    eventClicked (event, jsEvent, view) {
      this.term.id = event.id
      this.term.title = event.title
      this.term.status = event.status
      this.term.start = event.start.format('DD-MM HH:mm')
      this.term.edition = false
      if (this.term.status === 'FREE') { this.goToEdition().then(res => this.$refs.modal.show()) } else {
        this.$refs.modal.show()
      }
    },
    slotClicked (jsEvent, view) {
      console.log(jsEvent)
    },
    saveTerm () {
      this.$refs.form.handleSubmit(() => { this.$refs.modal.hide(); this.$refs.calendar.$emit('refetch-events') })
    },
    reloadCalendar () {
      this.$refs.calendar.$emit('refresh')
    },
    resetTermForm () {
      let date = this.$moment()
      let minutes = parseInt(date.format('mm'))
      if (minutes > 0 < 15) {
        minutes = 0
      } else if (minutes > 15 < 30) { minutes = 15 } else if (minutes > 30 < 45) { minutes = 30 } else { minutes = 45 }
      minutes = minutes < 10 ? '0' + minutes : '' + minutes
      let time = {HH: date.format('HH'), mm: minutes}
      let data = {id: null, service: null, date: new Date(), time: time, doctor: null, duration: null, patient: null, errors: []}
      if (this.$store.state.user.doctor && this.$store.state.user.doctor.default_service) {
        data.service = this.$store.state.user.doctor.default_service
        this.autocompletes.service = data.service.name
      }
      return data
    }
  },
  computed: {
    authHeaders () {
      return {
        'Authorization': 'Token ' + localStorage.token
      }
    },
    hasManyServices () {
      return !this.$store.state.user.doctor.defaultService
    },
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
        minTime: doctor ? doctor.terms_start : '09:00:00',
        maxTime: doctor ? doctor.terms_end : '17:00:00',
        locale: 'pl',
        editable: user.can_edit_terms,
        slotDuration: '00:15:00',
        displayEventTime: false,
        defaultView: 'agendaWeek',
        weekends: doctor ? doctor.show_weekends : false,
        header: {
          left: 'prev,next today',
          center: 'title',
          right: 'agendaFiveDays,agendaWeek,agendaDay'
        }
      }
    }
  },
  mounted () {
    EventBus.$on('settings-changed', () => {
      this.reloadCalendar()
    })
    axios.get('rest/services/').then(response => {
      if (response.data.count > 1) {
        let service = response.data.results[0]
        this.singleService = {id: service.id, name: service.name}
      }
    })
  },
  data: () => {
    return {
      modalTitle: 'Edycja terminu',
      doctor: null,
      singleService: false,
      patientsUrl: axios.defaults.baseURL + 'rest/patients/?term=',
      doctorsUrl: axios.defaults.baseURL + 'rest/doctors/?term=',
      servicesUrl: axios.defaults.baseURL + 'rest/services/?term=',
      termForm: {id: null, service: null, date: null, time: null, doctor: null, duration: null, patient: null, errors: []},
      term: {
        title: '',
        status: '',
        id: null,
        start: null,
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
      selectedDate: new Date(),
      eventSources:
        [
          {
            events (start, end, timezone, callback) {
              axios.get('rest/terms/', { params: {start: this.moment(start).format('YYYY-MM-DD'),
                end: this.moment(end).format('YYYY-MM-DD'),
                doctor: this.el[0].__vue__.$parent.doctor} }).then(response => {
                callback(response.data)
              })
            }
          }
        ]
    }
  }
}
</script>
<style>
    @import 'fullcalendar/dist/fullcalendar.css';
</style>
