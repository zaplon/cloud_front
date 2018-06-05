<template>
    <div class="card">
        <div class="card-title">{{ medicine.name }}</div>
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
            <h4 class="mb-1 mt-1">Opakowania</h4>
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
                </tbody>
            </table>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'medicine',
  mounted () {
    axios.get('rest/medicines/' + this.$route.params.id + '/').then(response => {
      this.medicine = response.data
    })
  }
}
</script>
