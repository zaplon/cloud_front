<template>
    <div>
        <div class="working-day row mb-3 pb-3 align-items-center" v-for="day in days" :key="day.name" v-if="days">
            <div class="col-md-1">
                <div class="pretty p-bigger p-smooth p-default p-round p-thick">
                    <input type="checkbox" v-model="day.on" />
                    <div class="state p-primary">
                        <!--<i style="top: -5px!important; left:-1px!important; position: absolute;" class="icon fa fa-check"></i>-->
                        <label></label>
                    </div>
                </div>
            </div>
            <div class="col-md-2"><label :class="{ 'text-muted': !day.on }">{{ day.name }}</label></div>
            <div class="col-md-9" :class="{ 'text-muted': !day.on }"><vue-slider :disabled="readonly" :ref="day.name" :data="sliderData" v-model="day.value" tooltip="always"></vue-slider></div>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
import vueSlider from 'vue-slider-component'
import store from '@/store'
import EventBus from '@/eventBus'
export default {
  name: 'working-hours',
  props: {
    forCurrentUser: {
      type: Boolean,
      required: false,
      default: true
    },
    readonly: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {
      sliderData: this.makeSliderData(),
      baseDays: [{name: 'Poniedziałek', value: ['9:00', '17:00'], on: true}, {name: 'Wtorek', value: ['9:00', '17:00'], on: true},
        {name: 'Środa', value: ['9:00', '17:00'], on: true}, {name: 'Czwartek', value: ['9:00', '17:00'], on: true},
        {name: 'Piątek', value: ['9:00', '17:00'], on: true}, {name: 'Sobota', value: ['9:00', '17:00'], on: false},
        {name: 'Niedziela', value: ['9:00', '17:00'], on: false}],
      days: []
    }
  },
  components: {
    vueSlider
  },
  methods: {
    getData () {
      return this.days
    },
    setData (data) {
      if (data) {
        if (data.days.length > 0) {
          this.days = data.days
        } else {
          this.days = this.baseDays
        }
        this.id = data.id
      }
    },
    save () {
      return axios.patch('rest/doctors/' + this.id + '/', {days: this.days, only_hours: true}).then((response) => {
        if (this.forCurrentUser) {
          store.commit('setDoctorTerms', response.data.terms_start, response.data.terms_end)
          EventBus.$emit('reload-calendar', {
            minTime: response.data.terms_start,
            maxTime: response.data.terms_end,
            working_hours: response.data.working_hours
          })
        }
      })
    },
    makeSliderData () {
      var data = []
      var parts = [':00', ':15', ':30', ':45']
      for (var i = 6; i < 22; i++) { parts.forEach((part) => { data.push(i + part) }) }
      return data
    }
  },
  mounted () {
    console.log('mounted')
    if (!this.forCurrentUser) {
      return
    }
    let state = this.$store.state
    let doctor = state.user ? state.user.doctor ? state.user.doctor : {} : {}
    if (doctor) {
      this.id = doctor.id
      if (!doctor.working_hours || doctor.working_hours.length === 0) {
        this.days = this.baseDays
      } else {
        this.days = doctor.working_hours
      }
    } else {
      this.days = this.baseDays
    }
  }
}
</script>
<style>
    .working-day .vue-slider-component{
    }
</style>
