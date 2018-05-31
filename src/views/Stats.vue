<template>
    <div>
        <template v-if="data">
            <div class="row">
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header">Liczba wizyt według miesięcy</div>
                        <div class="card-body">
                            <visits-count :visits="data.visits"></visits-count>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header">Liczba wizyt według godzin</div>
                        <div class="card-body">
                            <visits-time :visits="data.visits_time"></visits-time>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>
<script>
import axios from 'axios'
import VisitsCount from '@/components/Stats/VisitsCount'
import VisitsTime from '@/components/Stats/VisitsTime'
export default {
  name: 'stats',
  components: {VisitsCount, VisitsTime},
  data () {
    return {
      data: false
    }
  },
  mounted () {
    axios.get('rest/stats/', {params: {type: 'all'}}).then(response => {
      this.data = response.data
    })
  }
}
</script>
