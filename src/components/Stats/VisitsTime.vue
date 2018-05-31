<script>
import { Line } from 'vue-chartjs'
export default {
  extends: Line,
  props: ['visits'],
  data () {
    return {
      data: {
        labels: this.visits.labels,
        datasets: [{
          label: 'Liczba wizyt',
          backgroundColor: 'rgba(0,130,198,0.8)',
          borderColor: '#d8e2e7',
          data: this.visits.data
        }]
      },
      // Configuration options go here
      options: {
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Godzina'
            }
          }]
        }
      }
    }
  },
  mounted () {
    this.renderChart(this.data, this.options)
  }
}

</script>
