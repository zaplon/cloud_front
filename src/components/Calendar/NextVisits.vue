<template>
    <div>
        <h3 class="mt-2">Najbliższe wizyty</h3>
        <ul>
            <li :key="visit.id" v-for="visit in nextVisits"><a :href="visit.link">{{ visit.patient }} {{visit.start|formatDate('MM-DD HH:mm')}}</a></li>
            <li v-if="nextVisits.length == 0" class="text-muted">Brak zaplanowanych wizyt</li>
        </ul>
    </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'next-visits',
  data () {
    return {
      nextVisits: []
    }
  },
  mounted () {
    axios.get('/rest/terms/?next_visits=1').then(response => {
      this.nextVisits = response.data
      this.nextVisits.forEach((r, i) => { r.link = '/#/visit/' + r.id })
    })
  }
}
</script>
