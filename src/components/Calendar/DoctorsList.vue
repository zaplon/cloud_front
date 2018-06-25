<template>
    <div>
        <input v-model="search" type="text" placeholder="szukaj lekarza" class="form-control"/>
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Nazwisko</th><th>Najbliższy termin</th>
                </tr>
            </thead>
            <tbody>
                <tr :key="doctor.id" v-for="doctor in doctors" @click="loadCalendar(doctor)" style="cursor: pointer;"
                :class="{ 'table-primary': selectedDoctor == doctor.id } ">
                    <td>{{ doctor.name }}</td>
                    <td>{{ doctor.first_term }}</td>
                </tr>
                <tr><td colspan="2" class="text-center"><span class="text-muted" v-show="doctors.length==0">Brak wyników</span></td></tr>
            </tbody>
        </table>
    </div>
</template>
<script>
import axios from 'axios'
import _ from 'lodash'
export default {
  name: 'doctors-list',
  data () {
    return {
      search: '',
      doctors: [],
      selectedDoctor: 0,
      params: {calendar: 1}
    }
  },
  watch: {
    search (value) {
      this.params.name_like = value
      this.debouncedSearchDoctors()
    }
  },
  methods: {
    loadCalendar (doctor) {
      this.selectedDoctor = doctor.id
      this.$emit('load-calendar', doctor)
    },
    searchDoctors (params) {
      if (params) { this.params = params }
      axios.get('rest/doctors/', {params: this.params}).then(response => {
        this.doctors = response.data.results
      })
    }
  },
  created () {
    this.debouncedSearchDoctors = _.debounce(this.searchDoctors, 500)
  },
  mounted () {
    this.searchDoctors()
  }
}
</script>
