<template>
    <form @submit.prevent="search">
        <div class="form-row align-items-center">
            <div class="col-md-auto col-sm-12"><label>Usługa</label></div>
            <div class="col-md-auto col-sm-12">
                <autocomplete v-if="services.length > 1" id="termService" input-class="form-control" @selected="selectService"
                              placeholder="Wyszukaj..." @clear="clearService"
                              :initialDisplay="autocompletes.service"
                              :source="services"
                              results-display="name">
                </autocomplete>
                <input v-else type="text" class="form-control" readonly v-model="service.name">
            </div>
            <div class="col-md-auto col-sm-12"><label>Data od</label></div>
            <div class="col-md-auto col-sm-12">
                <v-date-picker mode='single' v-model='dateFrom'>
                    <input placeholder="Data od" type="text" class="form-control" slot-scope="props" v-model="props.inputValue">
                </v-date-picker>
            </div>
            <div v-if="localizations.length > 0" class="col-md-auto col-sm-12"><label>Gabinet</label></div>
            <div v-if="localizations.length > 0" class="col-md-auto col-sm-12">
                <select class="form-control" v-model="localization">
                    <option :key="localization.id" v-for="localization in localizations" v-bind:value="localization.id">
                        {{ localization.name }}
                    </option>
                </select>
            </div>
            <div class="col-md-auto mt-4 mt-md-0">
                <button :disabled="searchDisabled" class="btn btn-info col-sm-12">Wyszukaj terminy</button>
            </div>
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
      servicesUrl: axios.defaults.baseURL + 'rest/services/?no_pagination=1',
      services: [],
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
    axios.get(this.servicesUrl, {params: {only_assigned: true}}).then(response => {
      this.services = response.data
      if (this.services.length === 1) { this.service = this.services[0] }
    })
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
        forCalendar: true,
        serviceName: this.service.name})
    }
  }
}
</script>
