<template>
    <form @submit.prevent="save" v-if="term && term.service">
        <div class="form-group">
            <label for="service">Usługa</label><input class="form-control" type="text" readonly v-model="term.service.name"  id="service">
        </div>
        <div class="form-group">
            <label for="datetime">Data</label><span class="form-control" readonly id="datetime">{{term.datetime | formatDate('YYYY-MM-DD HH:mm') }}</span>
        </div>
        <div class="form-group">
            <label for="doctor">Lekarz</label><input class="form-control" type="text" readonly v-model="term.doctor"  id="doctor">
        </div>

        <div class="form-group">
            <label for="name">Imię</label>
            <input required :class="{ 'is-invalid form-control': errors.firstName, 'form-control': !errors.firstName }" type="text" v-model="firstName"  id="name">
            <div v-if="errors.firstName" class="invalid-feedback">{{ errors.firstName }}</div>
        </div>
        <div class="form-group">
            <label for="lastName">Nazwisko</label>
            <input required :class="{ 'is-invalid form-control': errors.lastName, 'form-control': !errors.lastName }" type="text" v-model="lastName"  id="lastName">
            <div v-if="errors.lastName" class="invalid-feedback">{{ errors.lastName }}</div>
        </div>
        <div class="form-group">
            <label for="phone">Numer telefonu</label>
            <input required :class="{ 'is-invalid form-control': errors.phone, 'form-control': !errors.phone }" type="text" v-model="phone"  id="phone">
            <div v-if="errors.phone" class="invalid-feedback">{{ errors.phone }}</div>
        </div>
    </form>
</template>
<script>
import axios from 'axios'
export default {
  name: 'form-booking',
  props: {
    term: Object
  },
  data () {
    return {
      firstName: '',
      lastName: '',
      phone: '',
      errors: {firstName: '', lastName: '', phone: ''}
    }
  },
  methods: {
    save (callback) {
      this.errors = {firstName: '', lastName: '', phone: ''}
      if (!this.firstName) { this.errors.firstName = 'To pole jest obowiązkowe' }
      if (!this.lastName) { this.errors.lastName = 'To pole jest obowiązkowe' }
      if (!this.phone) { this.errors.phone = 'To pole jest obowiązkowe' }
      if (this.errors.firstName || this.errors.lastName || this.errors.phone) { return }
      let data = {service_id: this.term.service.id,
        patient: {first_name: this.firstName, last_name: this.lastName, phone: this.phone}}
      return axios.patch('rest/booking/' + this.term.id + '/', data).then(response => callback(response))
    }
  }
}
</script>
