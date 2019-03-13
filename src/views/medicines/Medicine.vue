<template>
    <div class="card">
        <div class="card-header">
            {{ medicine.name }}
            <div class="card-toolbar" v-if="userDrug">
                <i class="fa fa-pencil text-primary pointer" @click="edit" title="edytuj" aria-hidden="true"></i>
            </div>
        </div>
        <div class="card-body">
            <table class="table table-striped">
                <tbody>
                <tr>
                    <td>Postać</td><td>{{ medicine.form }}</td>
                </tr>
                <tr>
                    <td>Skład</td><td>{{ medicine.composition }}</td>
                </tr>
                <tr>
                    <td>Dawka</td><td>{{ medicine.dose }}</td>
                </tr>
                <tr>
                    <td>Podmiot odpowiedzialny</td><td>{{ medicine.mah }}</td>
                </tr>
                </tbody>
            </table>
            <h4 class="mb-2 mt-4">Opakowania</h4>
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Wielkość opakowania</th>
                        <th>Kod EAN</th>
                        <th>Kategoria dostępności</th>
                        <th>Refundacja</th>
                    </tr>
                </thead>
                <tbody>
                    <tr :key="child.id" v-for="child in children">
                        <td>{{ child.size }}</td><td>{{ child.ean }}</td>
                        <td>{{ child.availability_cat}}</td>
                        <td>
                            <i class="fa fa-check-square text-primary" v-if="child.refundation"></i>
                            <i class="fa fa-minus-square text-danger" v-else></i>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="card-footer">
            <div v-if="userDrug" class="pull-right">
                <button class="btn btn-primary mr-1" @click="edit">Edytuj</button>
                <button class="btn btn-default" @click="cancel">Powrót</button>
            </div>
            <div v-else class="pull-right">
                <button class="btn btn-default" @click="cancel">Powrót</button>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'medicine',
  data () {
    return {
      medicine: {},
      children: []
    }
  },
  methods: {
    cancel () {
      this.$router.push({name: 'medicinesList'})
    },
    edit () {
      this.$router.push({name: 'editMedicine', params: {id: this.medicine.id}})
    }
  },
  computed: {
    userDrug () {
      return this.medicine.user_id === this.$store.state.user.id
    }
  },
  mounted () {
    axios.get('rest/medicine_parents/' + this.$route.params.id + '/').then(response => {
      this.medicine = response.data
    })
    axios.get('rest/medicines/', {params: { parent: this.$route.params.id }}).then(response => {
      this.children = response.data.results
    })
  }
}
</script>
