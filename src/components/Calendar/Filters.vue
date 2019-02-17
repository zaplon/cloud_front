<template>
    <form @submit.prevent="search">
        <div class="form-row align-items-center">
            <div class="col-auto"><label>Usługa</label></div>
            <div class="col-auto">
                <autocomplete id="termService" input-class="form-control" @selected="selectService"
                              :source="servicesUrl" placeholder="Wyszukaj..." @clear="clearService"
                              results-property="results" :initialDisplay="autocompletes.service"
                              :request-headers="authHeaders"
                              results-display="name">
                </autocomplete>
            </div>
            <div class="col-auto"><label>Data od</label></div>
            <div class="col-auto">
                <v-date-picker mode='single' v-model='dateFrom'>
                    <input placeholder="Data od" type="text" class="form-control" slot-scope="props" v-model="props.inputValue">
                </v-date-picker>
            </div>
            <div class="col-auto"><label>Lokalizacja</label></div>
            <div class="col-auto">
                <select class="form-control" v-model="localization">
                    <option :key="localization.id" v-for="localization in localizations" v-bind:value="localization.id">
                        {{ localization.name }}
                    </option>
                </select>
            </div>
            <div class="col-auto"><button :disabled="searchDisabled" class="btn btn-primary">Wyszukaj terminy</button></div>
        </div>
    </form>
</template>
<script>
import Autocomplete from 'vuejs-auto-complete'
import axios from 'axios'
export default {
  name: 'filters',
  components: {Autocomplete},
  data () {
    return {
      servicesUrl: axios.defaults.baseURL + 'rest/services/?no_pagination=1&term=',
      doctor: '',
      service: '',
      dateFrom: new Date(),
      localizations: [],
      localization: 0
    }
  },
  computed: {
    searchDisabled () {
      return !this.service
    },
    autocompletes () {
      return {
        doctor: null,
        service: null
      }
    },
    authHeaders () {
      return {
        'Authorization': 'Token ' + localStorage.token
      }
    }
  },
  mounted () {
    axios.get('rest/localizations/?no_pagination=1').then(response => { this.localizations = response.data })
  },
  methods: {
    selectService (obj) {
      this.service = obj.selectedObject
    },
    clearService () {
      this.service = null
    },
    selectDoctor (obj) {
      this.doctor = obj.selectedObject
    },
    search () {
      this.$emit('search-doctors', {calendar: 1,
        dateFrom: this.$moment(this.dateFrom).format('YYYY-MM-DD'),
        service: this.service.id,
        serviceName: this.service.name})
    }
  }
}
</script>
