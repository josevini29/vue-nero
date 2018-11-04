import {
  Pie
} from 'vue-chartjs'

import { getArrayCores } from '../../Util/Grafico'

export default {
  extends: Pie,
  props: ['dados'],
  mounted () {
    this.renderChart({
      labels: this.dados.label,
      datasets: [{
        backgroundColor: getArrayCores(this.dados.label.length),
        data: this.dados.value
      }]
    }, {
      responsive: true,
      maintainAspectRatio: false
    })
  }
}
