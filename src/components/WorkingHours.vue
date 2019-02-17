<template>
    <div>
        <div class="working-day row mb-3 pb-3" v-for="day in days" :key="day.name" v-if="days">
            <div class="col-md-1"><input type="checkbox" v-model="day.on" class="form-control"></div>
            <div class="col-md-2"><label :class="{ 'text-muted': !day.on }">{{ day.name }}</label></div>
            <div class="col-md-9" :class="{ 'text-muted': !day.on }"><vue-slider :disabled="readonly" :ref="day.name" :data="sliderData" v-model="day.value" tooltip="always"></vue-slider></div>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
import vueSlider from 'vue-slider-component'
import store from '@/store'
export default {
  name: 'working-hours',
  props: {
    userId: {
      type: Number,
      required: false,
      default: 0
    },
    readonly: {
      type: Boolean,
      required: false,
      default: false
    },
    blank: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {
      id: 0,
      sliderData: this.makeSliderData(),
      baseDays: [{name: 'Poniedziałek', value: ['9:00', '17:00'], on: true}, {name: 'Wtorek', value: ['9:00', '17:00'], on: true},
        {name: 'Środa', value: ['9:00', '17:00'], on: true}, {name: 'Czwartek', value: ['9:00', '17:00'], on: true},
        {name: 'Piątek', value: ['9:00', '17:00'], on: true}, {name: 'Sobota', value: ['9:00', '17:00'], on: false},
        {name: 'Niedziela', value: ['9:00', '17:00'], on: false}],
      days: false
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
      console.log(data)
      this.days = data
    },
    save () {
      return axios.patch('rest/doctors/' + this.id + '/', {days: this.days, only_hours: true}).then((response) =>
        store.commit('setDoctorTerms', response.data.terms_start, response.data.terms_end)
      )
    },
    makeSliderData () {
      var data = []
      var parts = [':00', ':15', ':30', ':45']
      for (var i = 6; i < 22; i++) { parts.forEach((part) => { data.push(i + part) }) }
      return data
    }
  },
  mounted () {
    if (this.blank) {
      this.days = this.baseDays
      return
    }
    let url = 'rest/doctors/'
    if (this.userId) {
      url += 'id=' + this.id
    } else {
      url += '?only_hours=1'
    }
    axios.get(url).then(response => {
      var days = response.data.results[0].working_hours
      this.id = response.data.results[0].id
      if (days.length > 0) { this.days = days } else { this.days = this.baseDays }
    })
  }
}
</script>
<style>
    .working-day .vue-slider-component{
    }
</style>
