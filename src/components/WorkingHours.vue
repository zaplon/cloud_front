<template>
    <div>
        <div class="working-day row mb-3 pb-3" v-for="day in days" :key="day.name">
            <div class="col-md-1"><input type="checkbox" v-model="day.on" class="form-control"></div>
            <div class="col-md-2"><label :class="{ 'text-muted': !day.on }">{{ day.name }}</label></div>
            <div class="col-md-9" :class="{ 'text-muted': !day.on }"><vue-slider :data="sliderData" v-model="day.value" tooltip="always"></vue-slider></div>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
import vueSlider from 'vue-slider-component'
export default {
  name: 'working-hours',
  data () {
    return {
      id: 0,
      sliderData: this.makeSliderData(),
      days: [{name: 'Poniedziałek', value: ['9:00', '17:00'], on: true}, {name: 'Wtorek', value: ['9:00', '17:00'], on: true},
        {name: 'Środa', value: ['9:00', '17:00'], on: true}, {name: 'Czwartek', value: ['9:00', '17:00'], on: true},
        {name: 'Piątek', value: ['9:00', '17:00'], on: true}, {name: 'Sobota', value: ['9:00', '17:00'], on: false},
        {name: 'Niedziela', value: ['9:00', '17:00'], on: false}]
    }
  },
  components: {
    vueSlider
  },
  methods: {
    save () {
      return axios.patch('rest/doctors/' + this.id + '/', {days: this.days, only_hours: true}).then(response => {
      })
    },
    makeSliderData () {
      var data = []
      var parts = [':00', ':15', ':30', ':45']
      for (var i = 6; i < 21; i++) { parts.forEach((part) => { data.push(i + part) }) }
      console.log(data)
      return data
    }
  },
  mounted () {
    axios.get('rest/doctors/?only_hours=1').then(response => {
      var days = response.data.results[0].working_hours
      this.id = response.data.results[0].id
      if (days.length > 0) { this.days = days }
    })
  }
}
</script>
<style>
    .working-day .vue-slider-component{
    }
</style>
